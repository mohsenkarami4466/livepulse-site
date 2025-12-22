/**
 * ============================================
 * 🌍 Globe Simple - Simple Globe Builder
 * ============================================
 * 
 * این فایل شامل تابع اصلی ساخت کره ساده است.
 * This file contains the main function for building simple globes.
 * 
 * وابستگی‌ها / Dependencies:
 * - THREE.js (THREE.Scene, THREE.PerspectiveCamera, THREE.WebGLRenderer, etc.)
 * - globe-helpers.js (addEventListenerOnce)
 * - globe-markets.js (getMarketStatusInfo, zoomToMarker, showMarketPopup)
 * - globe-resources.js (showFacilityPopup, selectCountry)
 * - window.CONFIG (برای تنظیمات کره)
 * - window.marketData (داده‌های بازارها)
 * - window.countriesData (داده‌های کشورها)
 * - window.createWorldBorders (تابع ساخت مرزها)
 * - window.logger (optional)
 * - window.errorHandler (optional)
 * 
 * استفاده / Usage:
 * این فایل باید بعد از globe-helpers.js, globe-clock.js, globe-markets.js لود شود.
 * This file should be loaded after globe-helpers.js, globe-clock.js, globe-markets.js.
 * 
 * توابع اصلی / Main Functions:
 * - buildSimpleGlobe: ساخت کره ساده با THREE.js
 * - simpleGlobeScenes: object نگه‌دارنده scene های کره‌ها
 * 
 * Export ها / Exports:
 * - window.buildSimpleGlobe
 * - window.simpleGlobeScenes
 * 
 * ============================================
 */

let simpleGlobeScenes = {
    financial: null,
    resources: null,
    weather: null,
    military: null,
    universities: null,
    historical: null,
    earthquake: null,
    'natural-resources': null
};

function buildSimpleGlobe(containerId, type) {
    const log = window.logger || { info: console.log }; log.info(`🌍 buildSimpleGlobe شروع: ${type}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        const log = window.logger || { error: console.error }; log.error('❌ Container پیدا نشد:', containerId);
        return;
    }
    
    container.innerHTML = '';
    
    if (typeof THREE === 'undefined') {
        const log = window.logger || { error: console.error }; log.error('❌ THREE.js لود نشده!');
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">Three.js لود نشده است!</p>';
        return;
    }
    
    // بررسی پشتیبانی WebGL
    try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
        if (!gl) {
            throw new Error('WebGL پشتیبانی نمی‌شود');
        }
    } catch (error) {
            if (window.errorHandler) {
                window.errorHandler.showUserError('مرورگر شما از WebGL پشتیبانی نمی‌کند. لطفاً مرورگر خود را به‌روزرسانی کنید.', 'خطای WebGL');
            } else {
                const log = window.logger || { error: console.error }; log.error('WebGL پشتیبانی نمی‌شود:', error);
            }
        container.innerHTML = '<p style="color: #ff6b6b; padding: 20px;">مرورگر شما از WebGL پشتیبانی نمی‌کند.</p>';
        return;
    }
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    try {
        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000510);
        
        // Camera - موقعیت اولیه به سمت ایران با فاصله مناسب برای نمایش کامل کره
        const cfg = window.CONFIG || CONFIG;
        const camera = new THREE.PerspectiveCamera(50, width / height, cfg.GLOBE.CAMERA.NEAR, cfg.GLOBE.CAMERA.FAR);
        // مختصات ایران از CONFIG
        const iranLat = cfg.GLOBE.IRAN.LAT;
        const iranLng = cfg.GLOBE.IRAN.LNG;
        const phi = (90 - iranLat) * (Math.PI / 180);
        const theta = (iranLng + 180) * (Math.PI / 180);
        // فاصله بیشتر برای نمایش کامل کره در همه ریسپانسیوها
        const distance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(width, height) / cfg.GLOBE.DISTANCE_RATIO);
        const x = -distance * Math.sin(phi) * Math.cos(theta);
        const y = distance * Math.cos(phi);
        const z = distance * Math.sin(phi) * Math.sin(theta);
        camera.position.set(x, y, z);
        camera.lookAt(0, 0, 0);
        
        // Renderer با کیفیت بسیار بالا
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3)); // کیفیت بالاتر
        
        // تنظیم حداکثر anisotropy برای کیفیت بالاتر تکسچرها
        if (renderer.capabilities && renderer.capabilities.getMaxAnisotropy) {
            const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
            // این مقدار بعداً برای تکسچرها استفاده می‌شود
        }
        container.appendChild(renderer.domElement);
        
        // Controls
        let controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 1.2;
            controls.maxDistance = 8;
            controls.enablePan = true; // فعال کردن pan برای جابجایی
            controls.enableRotate = true; // چرخش با ماوس فعال است
            controls.enableZoom = true; // فعال کردن zoom
            controls.autoRotate = false; // پیش‌فرض: چرخش اتوماتیک خاموش
            controls.autoRotateSpeed = 0;
            
            // جلوگیری از چرخش با wheel event
            const originalWheelHandler = controls.handleMouseWheel;
            controls.handleMouseWheel = function(event) {
                // فقط zoom، نه rotate
                if (event.deltaY !== 0) {
                    const zoom = event.deltaY > 0 ? 1.1 : 0.9;
                    this.dolly(zoom);
                    this.update();
                }
            };
            
            controls.rotateSpeed = 0.5;
            
            // تنظیم سرعت چرخش بر اساس زوم
            controls.addEventListener('change', () => {
                const distance = camera.position.length();
                const minDist = controls.minDistance;
                const maxDist = controls.maxDistance;
                const normalizedDistance = Math.min(1, Math.max(0, (distance - minDist) / (maxDist - minDist)));
                controls.rotateSpeed = 0.08 + (normalizedDistance * 0.42);
            });
        }
        
        // نورپردازی یکنواخت
        scene.add(new THREE.AmbientLight(0xffffff, 1.0));
        const sun = new THREE.DirectionalLight(0xffffff, 0.4);
        sun.position.set(5, 3, 5);
        scene.add(sun);
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, -3, -5);
        scene.add(fillLight);
        
        // کره زمین با کیفیت بسیار بالا
        const earthGeo = new THREE.SphereGeometry(1, 256, 256); // افزایش کیفیت به 256
        const earthMat = new THREE.MeshPhongMaterial({ color: 0x2563eb, shininess: 25 });
        const earth = new THREE.Mesh(earthGeo, earthMat);
        scene.add(earth);
        
        // اولین render
        renderer.render(scene, camera);
        
        // بارگذاری تکسچر
        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        
        // بارگذاری تکسچر - اولویت با فایل‌های محلی
        const texturePaths = [
            // اول از فایل‌های محلی با base path استفاده کن
            '/livepulse-site/earth-day.jpg',
            './earth-day.jpg',
            'earth-day.jpg',
            '/earth-day.jpg',
            // سپس CDN به عنوان fallback
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
            'https://raw.githubusercontent.com/dataarts/webgl-globe/master/globe/diffuse.jpg'
        ];
        
        const tryLoadTexture = (index) => {
            if (index >= texturePaths.length) {
                const log = window.logger || { warn: console.warn }; log.warn('⚠️ هیچ تکسچری بارگذاری نشد، استفاده از رنگ پیش‌فرض');
                return;
            }
            
            loader.load(
                texturePaths[index],
                (texture) => {
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    // بهبود کیفیت تکسچر - استفاده از فیلترهای با کیفیت بالا
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // حداکثر کیفیت
            earth.material.map = texture;
            earth.material.needsUpdate = true;
                    const log = window.logger || { info: console.log }; log.info('✅ تکسچر کره با کیفیت بالا بارگذاری شد:', texturePaths[index]);
                },
                undefined,
                () => {
                    const log = window.logger || { warn: console.warn }; log.warn(`⚠️ تکسچر ${texturePaths[index]} بارگذاری نشد، تلاش بعدی...`);
                    tryLoadTexture(index + 1);
                }
            );
        };
        
        tryLoadTexture(0);
        
        // هاله با کیفیت بالاتر
        const atmosGeo = new THREE.SphereGeometry(1.03, 128, 128);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: type === 'financial' ? 0x3b82f6 : 0xfbbf24,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });
        scene.add(new THREE.Mesh(atmosGeo, atmosMat));
        
        // ذخیره مارکرها برای انیمیشن و کلیک
        const markers = [];
        const markerGroup = new THREE.Group();
        earth.add(markerGroup);
        
        // === کره مالی ===
        if (type === 'financial' && typeof marketData !== 'undefined') {
            const log = window.logger || { info: console.log }; log.info(`📍 تعداد بازارها: ${marketData.length}`);
            
            marketData.forEach((market, index) => {
                const lat = market.coords[0];
                const lng = market.coords[1];
                const phi = (90 - lat) * (Math.PI / 180);
                const theta = (lng + 180) * (Math.PI / 180);
                
                // چسبیده به سطح کره
                const radius = 1.005;
                const x = -radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.cos(phi);
                const z = radius * Math.sin(phi) * Math.sin(theta);
                
                // رنگ بر اساس وضعیت بازار
                const statusInfo = getMarketStatusInfo(market);
                const isMajor = market.major === true;
                
                let core, glow, rays = [];
                
                if (isMajor) {
                    // ⭐ بازار اصلی - ستاره‌ای و بزرگتر
                    
                    // مرکز ستاره
                    const coreGeo = new THREE.SphereGeometry(0.018, 12, 12);
                    const coreMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor
                    });
                    core = new THREE.Mesh(coreGeo, coreMat);
                    core.position.set(x, y, z);
                    core.userData = { market, index, type: 'market', major: true };
                    markerGroup.add(core);
                    
                    // هاله بزرگتر
                    const glowGeo = new THREE.SphereGeometry(0.028, 12, 12);
                    const glowMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.glowColor,
                        transparent: true,
                        opacity: 0.6
                    });
                    glow = new THREE.Mesh(glowGeo, glowMat);
                    glow.position.set(x, y, z);
                    glow.userData = { market, index, type: 'market', major: true };
                    markerGroup.add(glow);
                    
                    // پرتوهای ستاره (4 پرتو)
                    const rayLength = 0.04;
                    const rayWidth = 0.004;
                    for (let i = 0; i < 4; i++) {
                        const rayGeo = new THREE.BoxGeometry(rayWidth, rayLength, rayWidth);
                        const rayMat = new THREE.MeshBasicMaterial({ 
                            color: statusInfo.coreColor,
                            transparent: true,
                            opacity: 0.9
                        });
                        const ray = new THREE.Mesh(rayGeo, rayMat);
                        
                        // موقعیت پرتو
                        ray.position.set(x, y, z);
                        
                        // چرخش پرتوها به سمت خارج
                        const normal = new THREE.Vector3(x, y, z).normalize();
                        ray.lookAt(normal.multiplyScalar(2).add(ray.position));
                        ray.rotateZ(i * Math.PI / 4); // 45 درجه بین پرتوها
                        
                        ray.userData = { market, index, type: 'market', major: true, isRay: true };
                        markerGroup.add(ray);
                        rays.push(ray);
                    }
                    
                    // حلقه دور ستاره
                    const ringGeo = new THREE.RingGeometry(0.03, 0.035, 32);
                    const ringMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor,
                        transparent: true,
                        opacity: 0.4,
                        side: THREE.DoubleSide
                    });
                    const ring = new THREE.Mesh(ringGeo, ringMat);
                    ring.position.set(x, y, z);
                    
                    // حلقه رو به سمت دوربین (بیرون کره)
                    const normalVec = new THREE.Vector3(x, y, z).normalize();
                    ring.lookAt(normalVec.multiplyScalar(10).add(ring.position));
                    
                    ring.userData = { market, index, type: 'market', major: true, isRing: true };
                    markerGroup.add(ring);
                    rays.push(ring);
                    
                } else {
                    // ● بازار معمولی - نقطه کوچک
                    
                    const coreGeo = new THREE.SphereGeometry(0.010, 8, 8);
                    const coreMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.coreColor
                    });
                    core = new THREE.Mesh(coreGeo, coreMat);
                    core.position.set(x, y, z);
                    core.userData = { market, index, type: 'market' };
                    markerGroup.add(core);
                    
                    // هاله نور کوچک
                    const glowGeo = new THREE.SphereGeometry(0.015, 8, 8);
                    const glowMat = new THREE.MeshBasicMaterial({ 
                        color: statusInfo.glowColor,
                        transparent: true,
                        opacity: 0.4
                    });
                    glow = new THREE.Mesh(glowGeo, glowMat);
                    glow.position.set(x, y, z);
                    glow.userData = { market, index, type: 'market' };
                    markerGroup.add(glow);
                }
                
                markers.push({ 
                    core, glow, rays, market, 
                    statusInfo,
                    isMajor,
                    position: { x, y, z }
                });
            });
        }
        
        // === کره منابع ===
        // نکته: آیکون‌های منابع از طریق سیستم worldResources اضافه میشن
        // نه از mockResourcesData - حذف شد
        if (type === 'resources') {
            const log = window.logger || { info: console.log }; log.info('📍 کره منابع - آیکون‌ها از طریق فیلتر اضافه میشن');
        }
        
        // Raycaster برای تشخیص کلیک
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let selectedMarker = null;
        
        // انیمیشن چراغ‌های بازار
        let animTime = 0;
        const blinkInterval = setInterval(() => {
            if (type === 'financial') {
                animTime += 0.1;
                markers.forEach(m => {
                    if (!m.core || !m.glow) return;
                    
                    // آپدیت وضعیت بازار
                    const newStatus = getMarketStatusInfo(m.market);
                    m.core.material.color.setHex(newStatus.coreColor);
                    m.glow.material.color.setHex(newStatus.glowColor);
                    
                    if (m.isMajor) {
                        // انیمیشن ستاره - درخشش قوی‌تر و چرخش
                        const breathe = 0.5 + Math.sin(animTime * 4) * 0.3;
                        m.glow.material.opacity = breathe;
                        
                        // چرخش پرتوها
                        if (m.rays && m.rays.length > 0) {
                            m.rays.forEach((ray, i) => {
                                if (ray.userData.isRay) {
                                    ray.rotation.z += 0.02;
                                    ray.material.color.setHex(newStatus.coreColor);
                                }
                                if (ray.userData.isRing) {
                                    ray.rotation.z += 0.01;
                                    ray.material.color.setHex(newStatus.coreColor);
                                    ray.material.opacity = 0.3 + Math.sin(animTime * 2) * 0.2;
                                }
                            });
                        }
                    } else {
                        // بازار معمولی - افکت تنفس ساده
                        const breathe = 0.4 + Math.sin(animTime * 3) * 0.2;
                        m.glow.material.opacity = breathe;
                    }
                });
            }
        }, 50);
        
        // چرخش اتوماتیک - پیش‌فرض: غیرفعال
        let autoRotate = false;
        let frameId;
        
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            // چرخش کره فقط اگر autoRotate فعال باشد
            if (autoRotate && earth) {
                earth.rotation.y += 0.001;
            }
            
            // چرخش حلقه‌های المان‌های facility
            if (type === 'resources' && facilityMarkersGroup) {
                facilityMarkersGroup.children.forEach(marker => {
                    if (marker.userData && marker.userData.rotateRings && marker.userData.rings) {
                        marker.userData.rings.forEach(ring => {
                            if (ring.userData.rotate) {
                                ring.rotation.z += ring.userData.rotationSpeed || 0.02;
                            }
                        });
                    }
                });
            }
            
            if (controls) controls.update();
            renderer.render(scene, camera);
        };
        animate();
        
        // ریسایز
        const onResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            
            // تنظیم مجدد فاصله دوربین برای نمایش کامل کره در همه ریسپانسیوها
            const cfg = window.CONFIG || CONFIG;
            const baseDistance = Math.max(cfg.GLOBE.MIN_DISTANCE, Math.min(w, h) / cfg.GLOBE.DISTANCE_RATIO);
            const iranLat = cfg.GLOBE.IRAN.LAT;
            const iranLng = cfg.GLOBE.IRAN.LNG;
            const phi = (90 - iranLat) * (Math.PI / 180);
            const theta = (iranLng + 180) * (Math.PI / 180);
            const x = -baseDistance * Math.sin(phi) * Math.cos(theta);
            const y = baseDistance * Math.cos(phi);
            const z = baseDistance * Math.sin(phi) * Math.sin(theta);
            camera.position.set(x, y, z);
            camera.lookAt(0, 0, 0);
            
            // تنظیم controls
            if (controls) {
                controls.minDistance = baseDistance * 0.8;
                controls.maxDistance = baseDistance * 2.5;
                controls.target.set(0, 0, 0);
                controls.update();
            }
        };
        window.addEventListener('resize', onResize);
        
        // تابع مشترک برای کلیک و تاچ روی مارکر
        const handleMarkerInteraction = (clientX, clientY) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            
            // بررسی برخورد با مارکرها
            const allMarkerObjects = [];
            markers.forEach(m => {
                if (m.core) allMarkerObjects.push(m.core);
                if (m.glow) allMarkerObjects.push(m.glow);
            });
            
            // اضافه کردن المان‌های facility (گمرک، معادن و...)
            if ((type === 'resources' || type === 'military' || type === 'universities' || type === 'historical') && facilityMarkersGroup) {
                facilityMarkersGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های نظامی
            if ((type === 'military' || type === 'resources') && militaryMarkersGroup) {
                militaryMarkersGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های conflicts
            if ((type === 'military' || type === 'resources') && resourcesGlobeData && resourcesGlobeData.conflictsGroup) {
                resourcesGlobeData.conflictsGroup.traverse((child) => {
                    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
                        allMarkerObjects.push(child);
                    }
                });
            }
            
            // اضافه کردن المان‌های دانشگاه، تاریخی، آب و هوا، زلزله و منابع طبیعی از scene
            if (type === 'universities' || type === 'historical' || type === 'weather' || type === 'earthquake' || type === 'natural-resources') {
                scene.scene.traverse((obj) => {
                    if (obj.name === 'universities' || obj.name === 'historical' || obj.name === 'weather' || 
                        obj.name === 'earthquakes' || obj.name === 'naturalResources') {
                        obj.traverse((child) => {
                            if (child instanceof THREE.Mesh || child instanceof THREE.Group || child instanceof THREE.Line) {
                                allMarkerObjects.push(child);
                            }
                        });
                    }
                });
            }
            
            const intersects = raycaster.intersectObjects(allMarkerObjects, true);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                
                // کلیک روی بازار (کره مالی)
                if (clicked.userData && clicked.userData.market) {
                    const log = window.logger || { info: console.log }; log.info('📍 کلیک روی بازار:', clicked.userData.market.name);
                    autoRotate = false;
                    zoomToMarker(clicked.userData.market, camera, controls, earth);
                    showMarketPopup(clicked.userData.market, container);
                    return true;
                }
                
                // کلیک روی المان facility (کره منابع) - اولویت بالا
                if (clicked.userData && clicked.userData.type) {
                    const facilityData = clicked.userData;
                    const log = window.logger || { info: console.log }; log.info('📍 کلیک روی المان:', facilityData.type, facilityData.name);
                    autoRotate = false;
                    
                    // نمایش popup روی کره - جلوگیری از انتخاب کشور
                    event?.stopPropagation?.();
                    showFacilityPopup(facilityData, intersects[0].point, container, camera);
                    return true;
                }
                
                // اگر روی المان کلیک شد، دیگر کشور را انتخاب نکن
                return true;
            }
            
            // در کره منابع: تشخیص کلیک روی کشور (روی خود کره) - فقط اگر روی المان کلیک نشد
            if (type === 'resources') {
                // فقط mesh اصلی کره، نه فرزندان (مرزها/آیکون‌ها)
                const earthIntersects = raycaster.intersectObject(earth, false);
                if (earthIntersects.length > 0) {
                    // چک کن که آیا روی المان کلیک شده یا نه
                    const facilityIntersects = facilityMarkersGroup ? 
                        raycaster.intersectObjects(facilityMarkersGroup.children, true) : [];
                    
                    // اگر روی المان کلیک نشد، کشور را انتخاب کن
                    if (facilityIntersects.length === 0) {
                        const worldPoint = earthIntersects[0].point;
                        
                        // تبدیل نقطه از سیستم جهانی به سیستم محلی کره
                        const localPoint = earth.worldToLocal(worldPoint.clone());
                        
                        // تبدیل موقعیت 3D به lat/lng
                        const latLng = vector3ToLatLng(localPoint);
                        
                        // پیدا کردن کشور بر اساس مختصات
                        const countryCode = findCountryByLatLng(latLng.lat, latLng.lng);
                        if (countryCode) {
                            const log = window.logger || { info: console.log }; log.info('🗺️ کشور:', countryCode);
                            selectCountry(countryCode);
                            return true;
                        }
                    }
                }
            }
            
            return false;
        };
        
        // تبدیل Vector3 به lat/lng - معکوس latLngToVector3Globe
        // فرمول اصلی latLngToVector3Globe:
        // phi = (90 - lat) * π/180
        // theta = (lng + 180) * π/180
        // x = -r * sin(phi) * cos(theta)
        // y = r * cos(phi)
        // z = r * sin(phi) * sin(theta)
        const vector3ToLatLng = (vec) => {
            const r = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
            if (r === 0) return { lat: 0, lng: 0 };
            
            // از y → lat
            // y = r * cos(phi) → phi = acos(y/r)
            // lat = 90 - phi * 180/π
            const phi = Math.acos(Math.max(-1, Math.min(1, vec.y / r)));
            const lat = 90 - (phi * 180 / Math.PI);
            
            // از x,z → lng
            // x = -r * sin(phi) * cos(theta)
            // z = r * sin(phi) * sin(theta)
            // tan(theta) = z / (-x) = -z/x
            // theta = atan2(z, -x)
            // theta = (lng + 180) * π/180
            // lng = theta * 180/π - 180
            const theta = Math.atan2(vec.z, -vec.x);
            let lng = (theta * 180 / Math.PI) - 180;
            
            // نرمال‌سازی به [-180, 180]
            while (lng < -180) lng += 360;
            while (lng > 180) lng -= 360;
            
            return { lat, lng };
        };
        
        // پیدا کردن کشور بر اساس مختصات - روش پیشرفته با فاصله از مرکز
        const findCountryByLatLng = (lat, lng) => {
            if (typeof countriesData === 'undefined' || !countriesData) return null;
            
            // استفاده از مختصات پایتخت‌ها و محاسبه نزدیک‌ترین کشور
            // این روش دقیق‌تر از bounding box است
            
            let closestCountry = null;
            let minDistance = Infinity;
            
            // محاسبه فاصله تقریبی (Haversine ساده شده)
            const getDistance = (lat1, lng1, lat2, lng2) => {
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLng = (lng2 - lng1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng / 2) * Math.sin(dLng / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return c * 6371; // فاصله به کیلومتر
            };
            
            // اول از countriesData استفاده کن (دقیق‌تر)
            if (typeof countriesData !== 'undefined' && countriesData) {
                for (const [code, data] of Object.entries(countriesData)) {
                    if (data.capital && data.capital.coords) {
                        const [capLat, capLng] = data.capital.coords;
                        const dist = getDistance(lat, lng, capLat, capLng);
                        // برای کشورهای کوچک، شعاع کوچکتر
                        const radius = data.populationDensity > 200 ? 200 : 
                                     data.populationDensity > 50 ? 500 : 1000; // کیلومتر
                        
                        if (dist < radius && dist < minDistance) {
                            minDistance = dist;
                            closestCountry = code;
                        }
                    }
                }
                
                // اگر کشور پیدا شد و فاصله معقول است، برگردان
                if (closestCountry && minDistance < 1500) {
                    const log = window.logger || { info: console.log }; log.info('✅ کشور از countriesData پیدا شد:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
                    return closestCountry;
                }
            }
            
            // محدوده تقریبی هر کشور - برخی کشورهای بزرگ چند منطقه دارن
            const countryZones = [
                // === کشورهای کوچک - اولویت بالا ===
                { code: 'IL', center: [31.5, 35], radius: 1.5 },      // اسرائیل
                { code: 'AE', center: [24, 54], radius: 2.5 },        // امارات
                { code: 'KR', center: [36, 128], radius: 3 },         // کره جنوبی
                { code: 'KP', center: [40, 127], radius: 2.5 },       // کره شمالی
                { code: 'SY', center: [35, 38], radius: 3 },          // سوریه
                { code: 'YE', center: [16, 47], radius: 4 },          // یمن
                
                // === کشورهای متوسط ===
                { code: 'IQ', center: [33, 44], radius: 4 },          // عراق
                { code: 'AF', center: [34, 66], radius: 5 },          // افغانستان
                { code: 'UK', center: [54, -2], radius: 5 },          // بریتانیا
                { code: 'DE', center: [51, 10], radius: 4 },          // آلمان
                { code: 'FR', center: [46, 2], radius: 5 },           // فرانسه
                { code: 'JP', center: [36, 138], radius: 6 },         // ژاپن
                { code: 'EG', center: [27, 30], radius: 5 },          // مصر
                { code: 'UA', center: [49, 32], radius: 5 },          // اوکراین
                { code: 'PK', center: [30, 69], radius: 6 },          // پاکستان
                { code: 'TR', center: [39, 35], radius: 6 },          // ترکیه
                { code: 'IR', center: [32, 53], radius: 8 },          // ایران
                
                // === کشورهای بزرگ ===
                { code: 'SA', center: [24, 45], radius: 8 },          // عربستان
                { code: 'IN', center: [22, 80], radius: 12 },         // هند
                { code: 'ZA', center: [-29, 25], radius: 8 },         // آفریقای جنوبی
                { code: 'AU', center: [-25, 134], radius: 18 },       // استرالیا
                
                // === کشورهای خیلی بزرگ - چند منطقه ===
                // چین
                { code: 'CN', center: [35, 105], radius: 12 },        // چین شرقی
                { code: 'CN', center: [40, 85], radius: 10 },         // چین غربی (سین‌کیانگ)
                
                // آمریکا
                { code: 'US', center: [39, -98], radius: 15 },        // مرکز آمریکا
                { code: 'US', center: [34, -118], radius: 8 },        // کالیفرنیا
                { code: 'US', center: [40, -74], radius: 6 },         // نیویورک
                { code: 'US', center: [25, -80], radius: 5 },         // فلوریدا
                
                // کانادا
                { code: 'CA', center: [56, -106], radius: 20 },       // کانادا مرکزی
                { code: 'CA', center: [49, -123], radius: 8 },        // ونکوور
                { code: 'CA', center: [45, -75], radius: 6 },         // اتاوا/مونترال
                
                // برزیل
                { code: 'BR', center: [-14, -51], radius: 15 },       // برزیل
                { code: 'BR', center: [-23, -46], radius: 6 },        // سائوپائولو
                
                // === آمریکای جنوبی ===
                { code: 'AR', center: [-34, -64], radius: 12 },       // آرژانتین
                { code: 'CL', center: [-35, -71], radius: 8 },       // شیلی
                { code: 'CO', center: [4, -74], radius: 6 },          // کلمبیا
                { code: 'PE', center: [-9, -75], radius: 6 },         // پرو
                { code: 'VE', center: [8, -66], radius: 6 },           // ونزوئلا
                { code: 'EC', center: [-1, -78], radius: 4 },        // اکوادور
                { code: 'BO', center: [-16, -64], radius: 6 },        // بولیوی
                { code: 'PY', center: [-23, -58], radius: 4 },        // پاراگوئه
                { code: 'UY', center: [-33, -56], radius: 3 },        // اروگوئه
                { code: 'GY', center: [5, -59], radius: 4 },          // گویان
                { code: 'SR', center: [4, -56], radius: 3 },          // سورینام
                { code: 'GF', center: [4, -53], radius: 3 },          // گویان فرانسه
                
                // === آمریکای مرکزی ===
                { code: 'MX', center: [23, -102], radius: 10 },       // مکزیک
                { code: 'GT', center: [15, -90], radius: 3 },         // گواتمالا
                { code: 'CR', center: [10, -84], radius: 2 },         // کاستاریکا
                { code: 'PA', center: [9, -80], radius: 2 },          // پاناما
                { code: 'HN', center: [15, -86], radius: 3 },        // هندوراس
                { code: 'NI', center: [13, -85], radius: 3 },         // نیکاراگوئه
                { code: 'SV', center: [14, -89], radius: 1.5 },       // السالوادور
                { code: 'BZ', center: [17, -88], radius: 2 },          // بلیز
                { code: 'CU', center: [22, -80], radius: 3 },          // کوبا
                { code: 'JM', center: [18, -77], radius: 1.5 },       // جامائیکا
                { code: 'HT', center: [19, -72], radius: 1.5 },       // هائیتی
                { code: 'DO', center: [19, -70], radius: 2 },         // جمهوری دومینیکن
                
                // === آفریقا ===
                { code: 'DZ', center: [28, 3], radius: 8 },           // الجزایر
                { code: 'LY', center: [27, 17], radius: 6 },           // لیبی
                { code: 'TN', center: [34, 9], radius: 3 },           // تونس
                { code: 'MA', center: [32, -6], radius: 4 },          // مراکش
                { code: 'SD', center: [15, 30], radius: 8 },          // سودان
                { code: 'ET', center: [9, 38], radius: 6 },            // اتیوپی
                { code: 'KE', center: [0, 38], radius: 4 },           // کنیا
                { code: 'TZ', center: [-6, 35], radius: 6 },          // تانزانیا
                { code: 'UG', center: [1, 32], radius: 3 },           // اوگاندا
                { code: 'GH', center: [8, -1], radius: 4 },           // غنا
                { code: 'SN', center: [14, -14], radius: 3 },         // سنگال
                { code: 'CI', center: [8, -5], radius: 4 },           // ساحل عاج
                { code: 'CM', center: [7, 12], radius: 4 },           // کامرون
                { code: 'AO', center: [-12, 17], radius: 6 },         // آنگولا
                { code: 'MZ', center: [-18, 35], radius: 5 },          // موزامبیک
                { code: 'ZM', center: [-13, 28], radius: 5 },          // زامبیا
                { code: 'ZW', center: [-19, 30], radius: 4 },          // زیمبابوه
                { code: 'MG', center: [-19, 47], radius: 5 },          // ماداگاسکار
                
                // === آسیا (بیشتر) ===
                { code: 'BD', center: [24, 90], radius: 4 },           // بنگلادش
                { code: 'MM', center: [22, 96], radius: 6 },           // میانمار
                { code: 'LK', center: [7, 81], radius: 2 },           // سری‌لانکا
                { code: 'NP', center: [28, 84], radius: 3 },          // نپال
                { code: 'BT', center: [27, 90], radius: 2 },           // بوتان
                { code: 'MN', center: [46, 105], radius: 8 },         // مغولستان
                { code: 'KZ', center: [48, 66], radius: 12 },          // قزاقستان
                { code: 'UZ', center: [41, 64], radius: 4 },          // ازبکستان
                { code: 'TM', center: [39, 59], radius: 4 },           // ترکمنستان
                { code: 'TJ', center: [39, 71], radius: 3 },           // تاجیکستان
                { code: 'KG', center: [41, 75], radius: 3 },           // قرقیزستان
                { code: 'AM', center: [40, 45], radius: 2 },          // ارمنستان
                { code: 'AZ', center: [40, 47], radius: 3 },          // آذربایجان
                { code: 'GE', center: [42, 43], radius: 2 },          // گرجستان
                { code: 'LB', center: [34, 36], radius: 2 },           // لبنان
                { code: 'JO', center: [31, 36], radius: 2 },          // اردن
                { code: 'KW', center: [29, 48], radius: 1.5 },       // کویت
                { code: 'QA', center: [25, 51], radius: 1.5 },         // قطر
                { code: 'BH', center: [26, 50], radius: 1 },          // بحرین
                { code: 'OM', center: [21, 57], radius: 4 },           // عمان
                
                // === اروپا (بیشتر) ===
                { code: 'IT', center: [42, 12], radius: 6 },          // ایتالیا
                { code: 'ES', center: [40, -3], radius: 5 },         // اسپانیا
                { code: 'PL', center: [52, 20], radius: 4 },          // لهستان
                { code: 'RO', center: [46, 25], radius: 4 },          // رومانی
                { code: 'NL', center: [52, 5], radius: 2 },           // هلند
                { code: 'BE', center: [51, 4], radius: 1.5 },         // بلژیک
                { code: 'GR', center: [39, 22], radius: 4 },          // یونان
                { code: 'PT', center: [40, -8], radius: 3 },         // پرتغال
                { code: 'CZ', center: [50, 15], radius: 3 },         // جمهوری چک
                { code: 'HU', center: [47, 20], radius: 3 },          // مجارستان
                { code: 'SE', center: [60, 18], radius: 5 },           // سوئد
                { code: 'NO', center: [60, 8], radius: 6 },           // نروژ
                { code: 'FI', center: [61, 26], radius: 5 },         // فنلاند
                { code: 'DK', center: [56, 10], radius: 2 },          // دانمارک
                { code: 'AT', center: [47, 14], radius: 3 },         // اتریش
                { code: 'CH', center: [47, 8], radius: 2 },           // سوئیس
                { code: 'IE', center: [53, -8], radius: 2 },          // ایرلند
                
                // === اقیانوسیه ===
                { code: 'NZ', center: [-41, 174], radius: 5 },        // نیوزیلند
                { code: 'FJ', center: [-18, 178], radius: 2 },        // فیجی
                { code: 'PG', center: [-6, 147], radius: 5 },         // پاپوآ گینه نو
                
                // روسیه - چند منطقه مهم
                { code: 'RU', center: [55, 37], radius: 8 },          // مسکو و اروپایی
                { code: 'RU', center: [55, 60], radius: 10 },         // اورال
                { code: 'RU', center: [55, 83], radius: 12 },         // سیبری غربی
                { code: 'RU', center: [55, 105], radius: 12 },        // سیبری شرقی
                { code: 'RU', center: [55, 130], radius: 12 },        // خاور دور
                { code: 'RU', center: [65, 90], radius: 15 },         // شمال سیبری
                { code: 'RU', center: [45, 45], radius: 8 },          // قفقاز
            ];
            
            // استفاده از countryZones به عنوان fallback (تبدیل radius از درجه به کیلومتر)
            const candidates = [];
            
            for (const zone of countryZones) {
                const dist = getDistance(lat, lng, zone.center[0], zone.center[1]); // کیلومتر
                const radiusKm = zone.radius * 111; // تبدیل درجه به کیلومتر (تقریبی)
                const ratio = dist / radiusKm;
                if (ratio <= 1.5) { // حداکثر 50% خارج از شعاع
                    candidates.push({ 
                        code: zone.code, 
                        dist, 
                        radius: radiusKm,
                        ratio,
                        withinRadius: ratio <= 1.0 
                    });
                }
            }
            
            // اگر کاندیدایی از countryZones پیدا شد، از آن استفاده کن
            if (candidates.length > 0) {
                // حذف کشورهای تکراری - نگه داشتن بهترین منطقه هر کشور
                const bestByCountry = {};
                for (const c of candidates) {
                    if (!bestByCountry[c.code] || c.ratio < bestByCountry[c.code].ratio) {
                        bestByCountry[c.code] = c;
                    }
                }
                const uniqueCandidates = Object.values(bestByCountry);
                
                // مرتب‌سازی هوشمند:
                uniqueCandidates.sort((a, b) => {
                    // اگر یکی داخل شعاع و دیگری خارج، داخلی برنده
                    if (a.withinRadius && !b.withinRadius) return -1;
                    if (!a.withinRadius && b.withinRadius) return 1;
                    // هر دو داخل یا هر دو خارج - کمترین ratio
                    return a.ratio - b.ratio;
                });
                
                const log = window.logger || { info: console.log }; log.info('🎯 کاندیدا از countryZones:', uniqueCandidates.map(c => `${c.code}(${c.ratio.toFixed(2)})`).join(', '));
                return uniqueCandidates[0].code;
            }
            
            // اگر هیچ کاندیدایی پیدا نشد، نزدیک‌ترین کشور از countryZones
            for (const zone of countryZones) {
                const dist = getDistance(lat, lng, zone.center[0], zone.center[1]);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestCountry = zone.code;
                }
            }
            
            if (closestCountry && minDistance < 2000) { // حداکثر 2000 کیلومتر
                const log = window.logger || { info: console.log }; log.info('⚠️ کشور نزدیک از countryZones:', closestCountry, 'فاصله:', minDistance.toFixed(1), 'km');
                return closestCountry;
            }
            
            // اگر هیچ کاندیدایی پیدا نشد
            return null;
        };
        
        // متغیرهای مشترک برای تشخیص کلیک vs درگ
        let pointerStartX = 0;
        let pointerStartY = 0;
        let pointerStartTime = 0;
        
        // Pointer events - برای تشخیص دوبار کلیک/ضربه
        let clickCount = 0;
        let clickTimer = null;
        let lastClickTime = 0;
        let lastClickX = 0;
        let lastClickY = 0;
        
        const onPointerDown = (event) => {
            pointerStartTime = Date.now();
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
        };
        
        const onPointerUp = (event) => {
            const duration = Date.now() - pointerStartTime;
            const moveX = Math.abs(event.clientX - pointerStartX);
            const moveY = Math.abs(event.clientY - pointerStartY);
            const totalMove = Math.sqrt(moveX * moveX + moveY * moveY);
            
            // فقط اگر کلیک کوتاه بود و حرکت کمتر از 15 پیکسل
            if (duration < 400 && totalMove < 15) {
                const currentTime = Date.now();
                const timeSinceLastClick = currentTime - lastClickTime;
                const distanceFromLastClick = Math.sqrt(
                    Math.pow(event.clientX - lastClickX, 2) + 
                    Math.pow(event.clientY - lastClickY, 2)
                );
                
                // چک کردن دوبار کلیک/ضربه (در عرض 500ms و فاصله کمتر از 30px)
                if (timeSinceLastClick < 500 && distanceFromLastClick < 30) {
                    clickCount++;
                    if (clickCount === 2) {
                        const log = window.logger || { info: console.log }; log.info('✅ دوبار کلیک/ضربه تشخیص داده شد');
                handleMarkerInteraction(event.clientX, event.clientY);
                        clickCount = 0;
                        lastClickTime = 0;
                        if (clickTimer) {
                            clearTimeout(clickTimer);
                            clickTimer = null;
                        }
                    }
                } else {
                    clickCount = 1;
                    lastClickTime = currentTime;
                    lastClickX = event.clientX;
                    lastClickY = event.clientY;
                    
                    // ریست کردن بعد از 500ms
                    if (clickTimer) clearTimeout(clickTimer);
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                        lastClickTime = 0;
                    }, 500);
                }
            }
        };
        
        // استفاده از Pointer Events - یکپارچه برای موس و تاچ
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        
        // ذخیره برای پاکسازی
        const globeData = {
            scene, camera, renderer, controls, frameId, earth, markers, markerGroup,
            autoRotate: false, // پیش‌فرض: چرخش اتوماتیک خاموش
            setAutoRotate: (value) => { autoRotate = value; },
            getAutoRotate: () => autoRotate,
            destroy: function() {
                const log = window.logger || { info: console.log }; log.info(`🗑️ پاکسازی کره ${type}...`);
                try {
                    clearInterval(blinkInterval);
                    cancelAnimationFrame(frameId);
                    window.removeEventListener('resize', onResize);
                    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
                    renderer.domElement.removeEventListener('pointerup', onPointerUp);
                    if (controls) controls.dispose();
                    scene.traverse((obj) => {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            if (Array.isArray(obj.material)) {
                                obj.material.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
                            } else {
                                if (obj.material.map) obj.material.map.dispose();
                                obj.material.dispose();
                            }
                        }
                    });
                    scene.clear();
                    renderer.dispose();
                    renderer.forceContextLoss();
                    if (renderer.domElement.parentNode) {
                        renderer.domElement.parentNode.removeChild(renderer.domElement);
                    }
                    // حذف popup اگر باز بود
                    const popup = container.querySelector('.market-3d-popup');
                    if (popup) popup.remove();
                } catch (err) {
                    const log = window.logger || { error: console.error }; log.error('خطا در پاکسازی:', err);
                }
            }
        };
        
        // ذخیره در simpleGlobeScenes
        simpleGlobeScenes[type] = globeData;
        
        // ذخیره در window برای دسترسی از توابع دیگر
        if (type === 'financial') {
            window.financialGlobeObjects = globeData;
        } else if (type === 'resources') {
            window.resourcesGlobeObjects = globeData;
        }
        
        // اضافه کردن خطوط مرز کشورها به کره
        const loadBorders = async (retryCount = 0) => {
            const maxRetries = 3;
            const scene = simpleGlobeScenes[type];
            
            if (!scene || !scene.earth) {
                if (retryCount < maxRetries) {
                    setTimeout(() => loadBorders(retryCount + 1), 1000);
                } else {
                    const log = window.logger || { warn: console.warn };
                    log.warn(`⚠️ earth برای کره ${type} پیدا نشد - مرزها اضافه نشدند`);
                }
                return;
            }
            
            // بررسی وجود createWorldBorders
            if (typeof createWorldBorders === 'undefined') {
                if (retryCount < maxRetries) {
                    setTimeout(() => loadBorders(retryCount + 1), 1000);
                } else {
                    const log = window.logger || { warn: console.warn };
                    log.warn('⚠️ تابع createWorldBorders پیدا نشد');
                }
                return;
            }
            
            const log = window.logger || { info: console.log };
            log.info(`🗺️ اضافه کردن مرزها به کره ${type}...`);
            
            try {
                if (typeof createWorldBorders === 'function') {
                    const bordersGroup = await createWorldBorders(scene.earth, {
                        defaultColor: 0x4488ff,
                        defaultOpacity: 0.4
                    });
                    if (bordersGroup) {
                        log.info(`✅ مرزها به کره ${type} اضافه شدند`);
                        // ذخیره bordersGroup در scene برای دسترسی بعدی
                        scene.bordersGroup = bordersGroup;
                    } else {
                        log.warn(`⚠️ مرزها برای کره ${type} لود نشدند`);
                    }
                } else {
                    log.warn('⚠️ تابع createWorldBorders پیدا نشد');
                }
            } catch (error) {
                const log = window.logger || { error: console.error };
                log.error(`❌ خطا در اضافه کردن مرزها به کره ${type}:`, error);
                if (window.errorHandler) {
                    window.errorHandler.handleError(error, `buildSimpleGlobe - loadBorders (${type})`);
                }
                if (retryCount < maxRetries) {
                    setTimeout(() => loadBorders(retryCount + 1), 2000);
                }
            }
        };
        
        // شروع بارگذاری مرزها با تاخیر
        setTimeout(() => loadBorders(), 2000);
        
        const log = window.logger || { info: console.log }; log.info(`✅ کره ${type} آماده!`, {
            hasScene: !!globeData.scene,
            hasEarth: !!globeData.earth,
            hasCamera: !!globeData.camera,
            hasRenderer: !!globeData.renderer
        });
        
        // برگرداندن globeData
        return globeData;
        
    } catch (error) {
        const log = window.logger || { error: console.error }; log.error('❌ خطا در buildSimpleGlobe:', error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div style="color: #ff6b6b; padding: 20px; text-align: center;">
                <p>❌ خطا در ساخت کره</p>
                <p style="font-size: 0.9em; margin-top: 10px;">${error.message}</p>
            </div>`;
        }
        return null;
    }
}

// ============================================
// Export توابع به window
// Export functions to window
// ============================================

window.buildSimpleGlobe = buildSimpleGlobe;
window.simpleGlobeScenes = simpleGlobeScenes;

