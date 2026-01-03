// مدیریت جابجایی و resize پنجره‌های کره‌های 3D

/**
 * راه‌اندازی قابلیت جابجایی و resize برای همه پنجره‌ها
 */
function setupDraggablePanels() {
    // فقط پنجره‌های داخل modal را بگیر (نه پنل‌های highlight در صفحه globe)
    const panels = document.querySelectorAll('.globe-modal-content .globe-panel');
    
    panels.forEach(panel => {
        // اگر قبلاً راه‌اندازی شده، رد کن
        if (panel.hasAttribute('data-draggable-setup')) {
            return;
        }
        panel.setAttribute('data-draggable-setup', 'true');
        
        // اضافه کردن handle برای resize
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        panel.appendChild(resizeHandle);
        
        // راه‌اندازی جابجایی
        setupPanelDragging(panel);
        
        // راه‌اندازی resize
        setupPanelResize(panel, resizeHandle);
        
        // بستن با کلیک خارج از پنجره
        setupPanelOutsideClick(panel);
    });
}

/**
 * راه‌اندازی جابجایی پنجره - استفاده از روش مشابه AssistiveTouch
 */
function setupPanelDragging(panel) {
    const header = panel.querySelector('.globe-panel-header');
    if (!header) return;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    
    const startDrag = (clientX, clientY) => {
        isDragging = true;
        
        // گرفتن موقعیت فعلی از getBoundingClientRect برای دقت بیشتر
        const rect = panel.getBoundingClientRect();
        const container = panel.closest('.globe-modal-content') || document.body;
        const containerRect = container.getBoundingClientRect();
        
        initialX = rect.left - containerRect.left;
        initialY = rect.top - containerRect.top;
        startX = clientX;
        startY = clientY;
        
        // غیرفعال کردن transition و اضافه کردن حالت درگ
        panel.style.setProperty('transition', 'none', 'important');
        panel.classList.add('dragging');
        
        // اطمینان از اینکه right و bottom تنظیم نشده‌اند
        panel.style.setProperty('right', 'auto', 'important');
        panel.style.setProperty('bottom', 'auto', 'important');
    };
    
    const updatePosition = (clientX, clientY) => {
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // محاسبه محدودیت‌ها
        const container = panel.closest('.globe-modal-content') || document.body;
        const containerRect = container.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const maxX = containerRect.width - panelRect.width;
        const maxY = containerRect.height - panelRect.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // استفاده از left و top برای موقعیت - با !important برای override کردن CSS
        panel.style.setProperty('left', newX + 'px', 'important');
        panel.style.setProperty('top', newY + 'px', 'important');
        panel.style.setProperty('right', 'auto', 'important');
        panel.style.setProperty('bottom', 'auto', 'important');
        
        // Force reflow برای اطمینان از اعمال تغییرات
        panel.offsetHeight;
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        updatePosition(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        const touch = e.touches[0];
        if (!touch) return;
        updatePosition(touch.clientX, touch.clientY);
    };
    
    const endDragging = () => {
        if (!isDragging) return;
        
        isDragging = false;
        panel.classList.remove('dragging');
        panel.style.removeProperty('transition');
    };
    
    const handleMouseDown = (e) => {
        if (e.target.closest('.globe-panel-close') || e.target.closest('.resize-handle')) {
            return;
        }
        
        if (!header.contains(e.target) && header !== e.target) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        startDrag(e.clientX, e.clientY);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', () => {
            endDragging();
            document.removeEventListener('mousemove', handleMouseMove);
        });
    };
    
    const handleTouchStart = (e) => {
        if (e.target.closest('.globe-panel-close') || e.target.closest('.resize-handle')) {
            return;
        }
        
        if (!header.contains(e.target) && header !== e.target) {
            return;
        }
        
        const touch = e.touches[0];
        if (!touch) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        startDrag(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', () => {
            endDragging();
            document.removeEventListener('touchmove', handleTouchMove);
        }, { passive: false });
    };
    
    header.addEventListener('mousedown', handleMouseDown, { passive: false });
    header.addEventListener('touchstart', handleTouchStart, { passive: false });
    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    
    // جلوگیری از dragstart پیش‌فرض
    header.addEventListener('dragstart', (e) => e.preventDefault());
}

/**
 * راه‌اندازی resize پنجره
 */
function setupPanelResize(panel, resizeHandle) {
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;
    
    const resizeStart = (e) => {
        isResizing = true;
        const rect = panel.getBoundingClientRect();
        startX = e.clientX || (e.touches && e.touches[0].clientX);
        startY = e.clientY || (e.touches && e.touches[0].clientY);
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;
        
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', resizeEnd);
        document.addEventListener('touchmove', resize);
        document.addEventListener('touchend', resizeEnd);
        
        e.preventDefault();
        e.stopPropagation();
    };
    
    const resize = (e) => {
        if (!isResizing) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const width = startWidth + (clientX - startX);
        const height = startHeight + (clientY - startY);
        
        // محدودیت‌های حداقل و حداکثر - ریسپانسیو برای موبایل و تبلت
        const isMobile = window.innerWidth <= 768;
        const minWidth = isMobile ? 180 : 200;
        const minHeight = isMobile ? 150 : 180;
        const container = panel.closest('.globe-modal-content') || document.body;
        const containerRect = container.getBoundingClientRect();
        const maxWidth = Math.min(containerRect.width * 0.95, window.innerWidth * 0.9);
        const maxHeight = Math.min(containerRect.height * 0.95, window.innerHeight * 0.9);
        
        const newWidth = Math.max(minWidth, Math.min(width, maxWidth));
        const newHeight = Math.max(minHeight, Math.min(height, maxHeight));
        
        // اعمال با !important برای override کردن CSS
        panel.style.setProperty('width', newWidth + 'px', 'important');
        panel.style.setProperty('height', newHeight + 'px', 'important');
        
        // اطمینان از اینکه پنجره از container خارج نشود
        const panelRect = panel.getBoundingClientRect();
        
        if (panelRect.right > containerRect.right) {
            panel.style.setProperty('left', (containerRect.right - newWidth) + 'px', 'important');
        }
        if (panelRect.bottom > containerRect.bottom) {
            panel.style.setProperty('top', (containerRect.bottom - newHeight) + 'px', 'important');
        }
        
        // Force reflow
        panel.offsetHeight;
    };
    
    const resizeEnd = () => {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', resizeEnd);
        document.removeEventListener('touchmove', resize);
        document.removeEventListener('touchend', resizeEnd);
    };
    
    resizeHandle.addEventListener('mousedown', resizeStart);
    resizeHandle.addEventListener('touchstart', resizeStart, { passive: false });
}

/**
 * بستن پنجره با کلیک خارج از آن
 */
function setupPanelOutsideClick(panel) {
    const container = panel.closest('.globe-modal-content') || document.body;
    
    const handleOutsideClick = (e) => {
        // اگر پنجره فعال نیست، کاری نکن
        if (!panel.classList.contains('active')) {
            return;
        }
        
        // اگر کلیک روی خود پنجره یا فرزندانش بود، کاری نکن
        if (panel.contains(e.target)) {
            return;
        }
        
        // اگر کلیک روی دکمه‌های کنترل کره بود، کاری نکن
        if (e.target.closest('.globe-assistive-touch') || 
            e.target.closest('.globe-glass-menu') ||
            e.target.closest('.globe-open-btn')) {
            return;
        }
        
        // بستن پنجره
        panel.classList.remove('active');
    };
    
    // استفاده از capture phase برای اطمینان از اجرا
    container.addEventListener('click', handleOutsideClick, true);
    container.addEventListener('touchend', handleOutsideClick, true);
}

// راه‌اندازی خودکار وقتی DOM آماده است
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(setupDraggablePanels, 1000);
    });
} else {
    setTimeout(setupDraggablePanels, 1000);
}

// راه‌اندازی مجدد وقتی پنجره جدیدی اضافه می‌شود یا فعال می‌شود
const panelObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                // چک کردن node خودش
                if (node.classList && node.classList.contains('globe-panel') && 
                    node.closest('.globe-modal-content')) {
                    setTimeout(() => {
                        setupDraggablePanels();
                    }, 100);
                }
                // چک کردن فرزندان
                const panels = node.querySelectorAll && node.querySelectorAll('.globe-modal-content .globe-panel');
                if (panels && panels.length > 0) {
                    setTimeout(() => {
                        setupDraggablePanels();
                    }, 100);
                }
            }
        });
        
        // همچنین وقتی کلاس active اضافه می‌شود
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const target = mutation.target;
            if (target.classList && target.classList.contains('globe-panel') && 
                target.classList.contains('active') &&
                target.closest('.globe-modal-content')) {
                setTimeout(() => {
                    setupDraggablePanels();
                }, 100);
            }
        }
    });
});

panelObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
});

// در دسترس قرار دادن توابع
window.setupDraggablePanels = setupDraggablePanels;
