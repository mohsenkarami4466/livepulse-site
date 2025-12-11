// ==================== //
// 🌍 Globe Helper Functions
// ==================== //
// توابع کمکی مشترک برای کلاس‌های Globe

/**
 * تبدیل مختصات جغرافیایی (lat/lng) به موقعیت 3D در کره
 * @param {number} lat - عرض جغرافیایی
 * @param {number} lng - طول جغرافیایی
 * @param {number} radius - شعاع کره (پیش‌فرض: 1.02 برای markerها)
 * @returns {THREE.Vector3} موقعیت 3D
 */
function latLngToVector3(lat, lng, radius = 1.02) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

/**
 * محاسبه موقعیت camera برای نمایش ایران
 * @param {number} width - عرض container
 * @param {number} height - ارتفاع container
 * @returns {Object} {x, y, z, distance}
 */
function calculateCameraPositionForIran(width, height) {
    const cfg = window.CONFIG || CONFIG;
    const iranLat = cfg.GLOBE.IRAN.LAT;
    const iranLng = cfg.GLOBE.IRAN.LNG;
    const phi = (90 - iranLat) * (Math.PI / 180);
    const theta = (iranLng + 180) * (Math.PI / 180);
    
    const distance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(width, height) / cfg.GLOBE.DISTANCE_RATIO);
    const x = -distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.cos(phi);
    const z = distance * Math.sin(phi) * Math.sin(theta);
    
    return { x, y, z, distance };
}

/**
 * ساخت marker برای کره
 * @param {Object} options - گزینه‌های marker
 * @param {number} options.lat - عرض جغرافیایی
 * @param {number} options.lng - طول جغرافیایی
 * @param {number} options.color - رنگ marker
 * @param {number} options.size - اندازه marker (پیش‌فرض: از CONFIG)
 * @param {Object} options.userData - داده‌های اضافی برای marker
 * @param {string} options.type - نوع marker ('financial' یا 'resources')
 * @returns {THREE.Mesh} marker mesh
 */
function createGlobeMarker(options) {
    const { lat, lng, color, size, userData, type = 'financial' } = options;
    
    if (typeof THREE === 'undefined') {
        const log = window.logger || { error: console.error };
        log.error('THREE.js در دسترس نیست');
        return null;
    }
    
    const cfg = window.CONFIG || CONFIG;
    
    // تبدیل lat/lng به موقعیت 3D
    const position = latLngToVector3(lat, lng, 1.02);
    
    // تعیین اندازه marker
    let markerSize = size;
    if (!markerSize) {
        markerSize = type === 'resources' 
            ? cfg.GLOBE.GEOMETRY.RESOURCES_MARKER_SIZE 
            : cfg.GLOBE.GEOMETRY.MARKER_SIZE;
    }
    
    // ساخت geometry
    const geometry = new THREE.SphereGeometry(
        markerSize, 
        cfg.GLOBE.GEOMETRY.MARKER_SEGMENTS, 
        cfg.GLOBE.GEOMETRY.MARKER_SEGMENTS
    );
    
    // ساخت material
    const material = new THREE.MeshBasicMaterial({ 
        color: color || cfg.GLOBE.MARKER_COLORS.DEFAULT
    });
    
    // ساخت marker
    const marker = new THREE.Mesh(geometry, material);
    marker.position.copy(position);
    
    if (userData) {
        marker.userData = userData;
    }
    
    return marker;
}

/**
 * بارگذاری texture با fallback به چند مسیر
 * @param {THREE.TextureLoader} loader - Texture loader
 * @param {Array<string>} texturePaths - لیست مسیرهای texture
 * @param {Function} onSuccess - callback برای موفقیت
 * @param {Function} onError - callback برای خطا
 * @param {Object} options - گزینه‌های texture
 */
function loadTextureWithFallback(loader, texturePaths, onSuccess, onError, options = {}) {
    const log = window.logger || { info: console.log, warn: console.warn };
    let currentIndex = 0;
    
    const tryLoadTexture = (index) => {
        if (index >= texturePaths.length) {
            log.warn('⚠️ هیچ تکسچری بارگذاری نشد');
            if (onError) onError();
            return;
        }
        
        loader.load(
            texturePaths[index],
            (texture) => {
                // تنظیمات texture
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;
                
                // Anisotropy
                if (options.renderer && options.renderer.capabilities && options.renderer.capabilities.getMaxAnisotropy) {
                    texture.anisotropy = options.renderer.capabilities.getMaxAnisotropy();
                }
                
                log.info(`✅ تکسچر با کیفیت بالا بارگذاری شد: ${texturePaths[index]}`);
                if (onSuccess) onSuccess(texture);
            },
            undefined,
            () => {
                log.warn(`⚠️ تکسچر ${texturePaths[index]} بارگذاری نشد، تلاش بعدی...`);
                tryLoadTexture(index + 1);
            }
        );
    };
    
    tryLoadTexture(0);
}

/**
 * Setup resize handler برای globe
 * @param {Object} globeInstance - instance کلاس Globe
 * @param {Function} handler - تابع handler (اختیاری)
 */
function setupGlobeResizeHandler(globeInstance, handler) {
    if (!globeInstance) return;
    
    const defaultHandler = () => {
        if (!globeInstance.container || !globeInstance.camera || !globeInstance.renderer) return;
        
        const width = globeInstance.container.clientWidth;
        const height = globeInstance.container.clientHeight;
        
        if (width > 0 && height > 0) {
            globeInstance.camera.aspect = width / height;
            globeInstance.camera.updateProjectionMatrix();
            globeInstance.renderer.setSize(width, height);
        }
    };
    
    const resizeHandler = handler || defaultHandler;
    
    // حذف listener قبلی اگر وجود داشت
    if (globeInstance._resizeHandler) {
        window.removeEventListener('resize', globeInstance._resizeHandler);
    }
    
    // اضافه کردن listener جدید
    globeInstance._resizeHandler = resizeHandler;
    window.addEventListener('resize', resizeHandler);
}

/**
 * Cleanup resize handler
 * @param {Object} globeInstance - instance کلاس Globe
 */
function cleanupGlobeResizeHandler(globeInstance) {
    if (globeInstance && globeInstance._resizeHandler) {
        window.removeEventListener('resize', globeInstance._resizeHandler);
        globeInstance._resizeHandler = null;
    }
}

/**
 * ساخت atmosphere برای کره
 * @param {Object} options - گزینه‌های atmosphere
 * @param {number} options.radius - شعاع atmosphere (پیش‌فرض: از CONFIG)
 * @param {string} options.color - رنگ atmosphere (vec4 format)
 * @param {number} options.intensity - شدت atmosphere (پیش‌فرض: 0.7)
 * @returns {THREE.Mesh} atmosphere mesh
 */
function createGlobeAtmosphere(options = {}) {
    if (typeof THREE === 'undefined') {
        const log = window.logger || { error: console.error };
        log.error('THREE.js در دسترس نیست');
        return null;
    }
    
    const cfg = window.CONFIG || CONFIG;
    const radius = options.radius || cfg.GLOBE.GEOMETRY.ATMOSPHERE_RADIUS;
    const color = options.color || '0.3, 0.6, 1.0';
    const intensity = options.intensity || 0.7;
    
    const geometry = new THREE.SphereGeometry(
        radius, 
        cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS, 
        cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS
    );
    
    const material = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(${intensity} - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                gl_FragColor = vec4(${color}, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    
    return new THREE.Mesh(geometry, material);
}

// Export functions
if (typeof window !== 'undefined') {
    window.GlobeHelpers = {
        latLngToVector3,
        calculateCameraPositionForIran,
        createGlobeMarker,
        loadTextureWithFallback,
        setupGlobeResizeHandler,
        cleanupGlobeResizeHandler,
        createGlobeAtmosphere
    };
}

