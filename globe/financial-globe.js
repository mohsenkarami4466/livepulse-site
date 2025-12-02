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
        console.log('🏦 شروع ساخت کره مالی...');
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container پیدا نشد:', containerId);
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
        
        const check = () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            
            console.log(`🔍 کره مالی - تلاش ${attempts + 1}: ${width}x${height}`);
            
            if (width > 100 && height > 100) {
                console.log(`✅ کره مالی - اندازه OK: ${width}x${height}`);
                this.createScene();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 100);
            } else {
                console.error('❌ کره مالی - Container اندازه ندارد!');
                this.showError();
            }
        };
        
        check();
    }

    createScene() {
        try {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            console.log(`🌍 ساخت کره مالی: ${width}x${height}`);

            // بررسی THREE.js
            if (typeof THREE === 'undefined') {
                console.error('❌ THREE.js لود نشده!');
                this.showError();
                return;
            }

            // Scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x000814);

            // Camera - موقعیت اولیه به سمت ایران
            this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
            const iranLat = 32.4279;
            const iranLng = 53.6880;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            const distance = 3;
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);

            // Renderer
            this.renderer = new THREE.WebGLRenderer({ 
                antialias: true,
                alpha: false 
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.container.appendChild(this.renderer.domElement);

            console.log('✅ Renderer اضافه شد');

            // Controls
            if (typeof THREE.OrbitControls !== 'undefined') {
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.minDistance = 1.5;
                this.controls.maxDistance = 10;
                this.controls.enablePan = false;
                this.controls.enableRotate = true;
                this.controls.autoRotate = false; // پیش‌فرض: چرخش اتوماتیک خاموش
                this.controls.autoRotateSpeed = 0;
                
                // جلوگیری از چرخش با wheel event
                const originalWheelHandler = this.controls.handleMouseWheel;
                this.controls.handleMouseWheel = function(event) {
                    // فقط zoom، نه rotate
                    if (event.deltaY !== 0) {
                        const zoom = event.deltaY > 0 ? 1.1 : 0.9;
                        this.dolly(zoom);
                        this.update();
                    }
                };
                
                console.log('✅ OrbitControls فعال شد');
            } else {
                console.warn('⚠️ OrbitControls در دسترس نیست');
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

            console.log('✅ کره مالی آماده شد!');
        } catch (error) {
            console.error('❌ خطا در ساخت کره مالی:', error);
            this.showError();
        }
    }

    createGlobe() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // ساخت کره اولیه با رنگ پیش‌فرض تا بلافاصله نمایش داده شود
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: 0x1d4ed8,
            shininess: 25,
            emissive: 0x0f172a,
            emissiveIntensity: 0.08
        });
        
        this.globe = new THREE.Mesh(geometry, baseMaterial);
        this.scene.add(this.globe);
        console.log('✅ کره مالی اولیه ساخته شد');
        
        // بارگذاری تکسچر
        const loader = new THREE.TextureLoader();
        const texturePaths = [
            './earth-day.jpg',
            'earth-day.jpg',
            '/earth-day.jpg',
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
        ];
        
        const tryLoadTexture = (index) => {
            if (index >= texturePaths.length) {
                console.warn('⚠️ هیچ تکسچری بارگذاری نشد، از رنگ پیش‌فرض استفاده می‌شود');
                return;
            }
            
            loader.load(
                texturePaths[index],
                (texture) => {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    
                    this.globe.material.map = texture;
                    this.globe.material.needsUpdate = true;
                    
                    console.log('✅ تکسچر کره مالی بارگذاری شد:', texturePaths[index]);
                },
                undefined,
                () => {
                    console.warn(`⚠️ تکسچر ${texturePaths[index]} بارگذاری نشد، تلاش بعدی...`);
                    tryLoadTexture(index + 1);
                }
            );
        };
        
        tryLoadTexture(0);

        // هاله اطراف کره
        this.addAtmosphere();
    }

    addAtmosphere() {
        const geometry = new THREE.SphereGeometry(1.02, 64, 64);
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x3b82f6, 0.5);
        pointLight.position.set(-5, -3, -5);
        this.scene.add(pointLight);
    }

    addMarkers() {
        // پاک کردن مارکرهای قبلی
        this.markers.forEach(m => this.scene.remove(m));
        this.markers = [];

        // دریافت داده‌های بازارها
        const markets = typeof mockFinancialData !== 'undefined' ? mockFinancialData : [];
        
        if (markets.length === 0) {
            console.warn('⚠️ داده‌های بازار موجود نیست');
            return;
        }
        
        markets.forEach(market => {
            const marker = this.createMarker(market);
            if (marker) {
                this.markers.push(marker);
                this.scene.add(marker);
            }
        });
        
        console.log(`✅ ${this.markers.length} مارکر بازار اضافه شد`);
    }

    createMarker(market) {
        const { lat, lng, status } = market;
        
        // تبدیل lat/lng به موقعیت 3D
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        const x = -1.02 * Math.sin(phi) * Math.cos(theta);
        const y = 1.02 * Math.cos(phi);
        const z = 1.02 * Math.sin(phi) * Math.sin(theta);

        // رنگ بر اساس وضعیت
        const color = status === 'open' ? 0x10b981 : 0xef4444;
        
        // نقطه
        const geometry = new THREE.SphereGeometry(0.025, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: color
        });
        
        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(x, y, z);
        marker.userData = market;

        return marker;
    }

    setupEvents() {
        window.addEventListener('resize', () => this.handleResize());
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
            this.globe.rotation.y += 0.001;
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
            // بازگشت به موقعیت ایران
            const iranLat = 32.4279;
            const iranLng = 53.6880;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            const distance = 3;
            const x = -distance * Math.sin(phi) * Math.cos(theta);
            const y = distance * Math.cos(phi);
            const z = distance * Math.sin(phi) * Math.sin(theta);
            this.camera.position.set(x, y, z);
            this.camera.lookAt(0, 0, 0);
        }
    }
    
    toggleRotate() {
        if (this.controls) {
            this.controls.autoRotate = !this.controls.autoRotate;
            this.controls.autoRotateSpeed = this.controls.autoRotate ? 0.5 : 0;
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
        console.log('🗑️ پاک کردن کره مالی...');
        
        this.isInitialized = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
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
    console.log('📞 initFinancialGlobe فراخوانی شد');
    
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

console.log('✅ financial-globe.js لود شد');
