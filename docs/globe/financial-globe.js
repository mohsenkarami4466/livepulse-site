// =============================================
// 🌍 کره مالی - ساعت بازارها
// Financial Globe - Market Hours
// =============================================

class FinancialGlobe {
    constructor() {
        this.container = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.controls = null;
        this.animationId = null;
        this.markers = [];
        this.isInitialized = false;
    }

    init(containerId) {
        const log = window.logger || { info: console.log, error: console.error };
        log.info('🏦 شروع ساخت کره مالی...');
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            log.error('Container پیدا نشد:', containerId);
            return;
        }

        // پاک کردن محتوای قبلی
        this.container.innerHTML = '';
        
        // شروع چک کردن اندازه
        this.waitAndCreate();
    }

    waitAndCreate() {
        let attempts = 0;
        const maxAttempts = 50;
        
        const log = window.logger || { info: console.log, error: console.error };
        const check = () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            log.info(`🔍 کره مالی - تلاش ${attempts + 1}: ${width}x${height}`);
            
            if (width > 100 && height > 100) {
                log.info(`✅ کره مالی - اندازه OK: ${width}x${height}`);
                this.createScene();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 100);
            } else {
                log.error('❌ کره مالی - Container اندازه ندارد!');
                this.showError();
            }
        };
        
        check();
    }

    createScene() {
        const log = window.logger || { info: console.log, error: console.error, warn: console.warn };
        const cfg = window.CONFIG || CONFIG;
        try {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            log.info(`🌍 ساخت کره مالی: ${width}x${height}`);

            // بررسی THREE.js
            if (typeof THREE === 'undefined') {
                log.error('❌ THREE.js لود نشده!');
                this.showError();
                return;
            }

            // Scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000814);

            // Camera - موقعیت اولیه به سمت ایران با فاصله مناسب برای نمایش کامل کره
            this.camera = new THREE.PerspectiveCamera(
                cfg.GLOBE.CAMERA.FOV, 
                width / height, 
                cfg.GLOBE.CAMERA.NEAR, 
                cfg.GLOBE.CAMERA.FAR
            );
            const iranLat = cfg.GLOBE.IRAN.LAT;
            const iranLng = cfg.GLOBE.IRAN.LNG;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            // فاصله بیشتر برای نمایش کامل کره در همه ریسپانسیوها
            const distance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(width, height) / cfg.GLOBE.DISTANCE_RATIO);
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
            
            // Renderer با کیفیت بسیار بالا
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: false 
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, cfg.GLOBE.RENDERER.MAX_PIXEL_RATIO));
            this.container.appendChild(this.renderer.domElement);

            log.info('✅ Renderer اضافه شد');

            // Controls
            if (typeof THREE.OrbitControls !== 'undefined') {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = cfg.GLOBE.CONTROLS.ENABLE_DAMPING;
                this.controls.dampingFactor = cfg.GLOBE.CONTROLS.DAMPING_FACTOR;
                // تنظیم فاصله برای نمایش کامل کره در همه ریسپانسیوها
                const baseDistance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(width, height) / cfg.GLOBE.DISTANCE_RATIO);
                this.controls.minDistance = baseDistance * cfg.GLOBE.DISTANCE_MULTIPLIER.MIN;
                this.controls.maxDistance = baseDistance * cfg.GLOBE.DISTANCE_MULTIPLIER.MAX;
                this.controls.target.set(0, 0, 0);
                this.controls.update();
                this.controls.enablePan = cfg.GLOBE.CONTROLS.ENABLE_PAN;
                this.controls.enableRotate = cfg.GLOBE.CONTROLS.ENABLE_ROTATE;
                this.controls.autoRotate = cfg.GLOBE.CONTROLS.AUTO_ROTATE;
                this.controls.autoRotateSpeed = cfg.GLOBE.CONTROLS.AUTO_ROTATE ? cfg.GLOBE.CONTROLS.AUTO_ROTATE_SPEED : 0;
                
                // جلوگیری از چرخش با wheel event
                const _originalWheelHandler = this.controls.handleMouseWheel;
                this.controls.handleMouseWheel = function(event) {
                    // فقط zoom، نه rotate
                    if (event.deltaY !== 0) {
                        const zoom = event.deltaY > 0 ? 1.1 : 0.9;
                        this.dolly(zoom);
                        this.update();
                    }
                };
                
                log.info('✅ OrbitControls فعال شد');
            } else {
                log.warn('⚠️ OrbitControls در دسترس نیست');
            }

            // Globe
            this.createGlobe();
            
            // Lights
            this.addLights();
            
            // Markers
            this.addMarkers();

            // Events
            this.setupEvents();

            // Start animation
            this.isInitialized = true;
            this.animate();

            log.info('✅ کره مالی آماده شد!');
        } catch (error) {
            log.error('❌ خطا در ساخت کره مالی:', error);
            if (window.errorHandler) {
                window.errorHandler.handleError(error, 'FinancialGlobe.createScene');
            }
            this.showError();
        }
    }

    createGlobe() {
        const cfg = window.CONFIG || CONFIG;
        // کره با کیفیت بسیار بالا
        const geometry = new THREE.SphereGeometry(1, cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS, cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS);
        
        // ساخت کره اولیه با رنگ پیش‌فرض تا بلافاصله نمایش داده شود
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: cfg.GLOBE.MATERIAL.FINANCIAL_COLOR,
            shininess: cfg.GLOBE.MATERIAL.FINANCIAL_SHININESS,
            emissive: cfg.GLOBE.MATERIAL.FINANCIAL_EMISSIVE,
            emissiveIntensity: cfg.GLOBE.MATERIAL.FINANCIAL_EMISSIVE_INTENSITY
        });
        
        this.globe = new THREE.Mesh(geometry, baseMaterial);
        this.scene.add(this.globe);
        const log = window.logger || { info: console.log, warn: console.warn };
        log.info('✅ کره مالی اولیه ساخته شد');
        
        // بارگذاری تکسچر - اولویت با فایل‌های محلی
        const loader = new THREE.TextureLoader();
        
        // تشخیص محیط: development یا production
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const basePath = isDev ? '' : '/livepulse-site';
        
        const texturePaths = [
            // اول از فایل محلی در development
            '/assets/images/earth-day.jpg',
            './assets/images/earth-day.jpg',
            'assets/images/earth-day.jpg',
            // سپس production paths
            `${basePath}/assets/images/earth-day.jpg`,
            `${basePath}/earth-day.jpg`,
            // سپس فایل‌های محلی دیگر
            './earth-day.jpg',
            'earth-day.jpg',
            '/earth-day.jpg',
            // سپس CDN fallback (با crossOrigin)
            'https://unpkg.com/three-globe@2.27.3/example/img/earth-blue-marble.jpg',
            'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
            'https://raw.githubusercontent.com/dataarts/webgl-globe/master/globe/diffuse.jpg',
            'https://cdn.jsdelivr.net/gh/dataarts/webgl-globe@master/globe/diffuse.jpg'
        ];
        
        const tryLoadTexture = (index) => {
            if (index >= texturePaths.length) {
                log.warn('⚠️ هیچ تکسچری بارگذاری نشد، از رنگ پیش‌فرض استفاده می‌شود');
                return;
            }
            
            const texturePath = texturePaths[index];
            const isCDN = texturePath.startsWith('http://') || texturePath.startsWith('https://');
            
            // تنظیم crossOrigin برای CDN
            if (isCDN) {
                loader.crossOrigin = 'anonymous';
            }
            
            loader.load(
                texturePath,
                (texture) => {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    // بهبود کیفیت تکسچر
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    if (this.renderer && this.renderer.capabilities && this.renderer.capabilities.getMaxAnisotropy) {
                        texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    }
                    
                    this.globe.material.map = texture;
                    this.globe.material.needsUpdate = true;
                    
                    log.info('✅ تکسچر کره مالی با کیفیت بالا بارگذاری شد:', texturePath);
                },
                undefined,
                (error) => {
                    log.warn(`⚠️ تکسچر ${texturePath} بارگذاری نشد، تلاش بعدی...`, error);
                    tryLoadTexture(index + 1);
                }
            );
        };
        
        tryLoadTexture(0);

        // هاله اطراف کره
        this.addAtmosphere();
    }

    addAtmosphere() {
        const cfg = window.CONFIG || CONFIG;
        // هاله با کیفیت بسیار بالا
        const geometry = new THREE.SphereGeometry(cfg.GLOBE.GEOMETRY.ATMOSPHERE_RADIUS, cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS, cfg.GLOBE.GEOMETRY.SPHERE_SEGMENTS);
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
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        
        const atmosphere = new THREE.Mesh(geometry, material);
        this.scene.add(atmosphere);
    }

    addLights() {
        const cfg = window.CONFIG || CONFIG;
        const ambientLight = new THREE.AmbientLight(0xffffff, cfg.GLOBE.LIGHTS.AMBIENT_INTENSITY);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, cfg.GLOBE.LIGHTS.DIRECTIONAL_INTENSITY);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x3b82f6, cfg.GLOBE.LIGHTS.POINT_INTENSITY);
        pointLight.position.set(-5, -3, -5);
        this.scene.add(pointLight);
    }

    addMarkers() {
        // پاک کردن مارکرهای قبلی
        this.markers.forEach(m => this.scene.remove(m));
        this.markers = [];

        // دریافت داده‌های بازارها
        const markets = typeof mockFinancialData !== 'undefined' ? mockFinancialData : [];
        const log = window.logger || { warn: console.warn, info: console.log };
        
        if (markets.length === 0) {
            log.warn('⚠️ داده‌های بازار موجود نیست');
            return;
        }
        
        markets.forEach(market => {
            const marker = this.createMarker(market);
            if (marker) {
                this.markers.push(marker);
                this.scene.add(marker);
            }
        });
        
        log.info(`✅ ${this.markers.length} مارکر بازار اضافه شد`);
    }

    createMarker(market) {
        const { lat, lng, status } = market;
        
        // تبدیل lat/lng به موقعیت 3D
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const x = -1.02 * Math.sin(phi) * Math.cos(theta);
        const y = 1.02 * Math.cos(phi);
        const z = 1.02 * Math.sin(phi) * Math.sin(theta);

        const cfg = window.CONFIG || CONFIG;
        // رنگ بر اساس وضعیت
        const color = status === 'open' ? cfg.GLOBE.MARKER_COLORS.MARKET_OPEN : cfg.GLOBE.MARKER_COLORS.MARKET_CLOSED;
        
        // نقطه
        const geometry = new THREE.SphereGeometry(cfg.GLOBE.GEOMETRY.MARKER_SIZE, cfg.GLOBE.GEOMETRY.MARKER_SEGMENTS, cfg.GLOBE.GEOMETRY.MARKER_SEGMENTS);
        const material = new THREE.MeshBasicMaterial({ 
            color: color
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(x, y, z);
        marker.userData = market;

        return marker;
    }

    setupEvents() {
        // استفاده از debounce برای بهینه‌سازی performance
        const debouncedResize = typeof debounce !== 'undefined' 
            ? debounce(() => this.handleResize(), 250)
            : (() => {
                let timeout;
                return () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => this.handleResize(), 250);
                };
            })();
        
        window.addEventListener('resize', debouncedResize);
        this._resizeHandler = debouncedResize; // ذخیره برای cleanup
    }

    handleResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        if (width > 0 && height > 0) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    animate() {
        if (!this.isInitialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // چرخش کره فقط اگر autoRotate فعال باشد
        if (this.globe && this.globe.rotation && this.controls && this.controls.autoRotate) {
            const cfg = window.CONFIG || CONFIG;
            this.globe.rotation.y += cfg.GLOBE.ANIMATION.ROTATION_SPEED;
        }
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resetView() {
        if (this.camera) {
            const cfg = window.CONFIG || CONFIG;
            // بازگشت به موقعیت ایران
            const iranLat = cfg.GLOBE.IRAN.LAT;
            const iranLng = cfg.GLOBE.IRAN.LNG;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            const distance = cfg.GLOBE.DEFAULT_DISTANCE;
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    toggleRotate() {
        if (this.controls) {
            const cfg = window.CONFIG || CONFIG;
            this.controls.autoRotate = !this.controls.autoRotate;
            this.controls.autoRotateSpeed = this.controls.autoRotate ? cfg.GLOBE.CONTROLS.AUTO_ROTATE_SPEED : 0;
            return this.controls.autoRotate;
        }
        return false;
    }

    showError() {
        if (this.container) {
            this.container.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:white;text-align:center;padding:20px;background:#000814;">
                    <div style="font-size:64px;margin-bottom:20px;">🌍</div>
                    <h3 style="margin-bottom:10px;color:#ef4444;">خطا در بارگذاری کره مالی</h3>
                    <p style="color:#94a3b8;">لطفاً صفحه را رفرش کنید</p>
                </div>
            `;
        }
    }

    destroy() {
        const log = window.logger || { info: console.log };
        log.info('🗑️ پاک کردن کره مالی...');
        
        this.isInitialized = false;
        
        // Cleanup resize handler
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        
        if (this.animationId) {
            if (typeof cancelAnimationFrameSafe !== 'undefined') {
                cancelAnimationFrameSafe(this.animationId);
            } else {
                cancelAnimationFrame(this.animationId);
            }
            this.animationId = null;
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.scene = null;
        this.camera = null;
        this.globe = null;
        this.controls = null;
    }
}

// ساخت instance سراسری
var financialGlobeInstance = null;

function initFinancialGlobe(containerId) {
    const log = window.logger || { info: console.log };
    log.info('📞 initFinancialGlobe فراخوانی شد');
    
    // اگر قبلاً ساخته شده، پاک کن
    if (financialGlobeInstance) {
        financialGlobeInstance.destroy();
    }
    
    financialGlobeInstance = new FinancialGlobe();
    financialGlobeInstance.init(containerId);
}

function resetFinancialGlobeView() {
    if (financialGlobeInstance) {
        financialGlobeInstance.resetView();
    }
}

// Export
window.initFinancialGlobe = initFinancialGlobe;
window.resetFinancialGlobeView = resetFinancialGlobeView;
window.financialGlobeInstance = financialGlobeInstance;

(function() {
    const log = window.logger || { info: console.log };
    log.info('✅ financial-globe.js لود شد');
})();
