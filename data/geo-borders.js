// ============================================
// 🗺️ سیستم مرزهای کشورها برای کره سه‌بعدی
// ============================================

// کش برای GeoJSON
let countriesGeoJSON = null;
let bordersLoaded = false;

// بارگذاری GeoJSON از CDN
async function loadCountryBorders() {
    if (bordersLoaded && countriesGeoJSON) {
        return countriesGeoJSON;
    }
    
    console.log('📥 در حال بارگذاری مرزهای کشورها...');
    
    try {
        // استفاده از Natural Earth Data - کم‌حجم و دقیق
        const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
        
        if (!response.ok) {
            throw new Error('خطا در بارگذاری');
        }
        
        countriesGeoJSON = await response.json();
        bordersLoaded = true;
        
        console.log(`✅ ${countriesGeoJSON.features.length} کشور بارگذاری شد`);
        return countriesGeoJSON;
        
    } catch (error) {
        console.error('❌ خطا در بارگذاری مرزها:', error);
        return null;
    }
}

// تبدیل مختصات جغرافیایی به بردار سه‌بعدی روی کره
// این فرمول باید با فرمول script.js یکسان باشه
function latLngToVector3Globe(lat, lng, radius = 1.001) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// ایجاد خط مرز از آرایه مختصات
function createBorderLine(coordinates, color = 0xffffff, opacity = 0.6, lineWidth = 1) {
    const points = [];
    
    coordinates.forEach(coord => {
        // coord = [lng, lat]
        const point = latLngToVector3Globe(coord[1], coord[0]);
        points.push(point);
    });
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: opacity,
        linewidth: lineWidth
    });
    
    return new THREE.Line(geometry, material);
}

// ایجاد تمام مرزهای یک کشور
function createCountryBorders(feature, color = 0xffffff, opacity = 0.6) {
    const group = new THREE.Group();
    const geometry = feature.geometry;
    
    if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(ring => {
            const line = createBorderLine(ring, color, opacity);
            group.add(line);
        });
    } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
            polygon.forEach(ring => {
                const line = createBorderLine(ring, color, opacity);
                group.add(line);
            });
        });
    }
    
    group.userData = {
        countryCode: feature.properties.ISO_A2,
        countryName: feature.properties.ADMIN
    };
    
    return group;
}

// ایجاد تمام مرزهای جهان
// مهم: مرزها باید به earth اضافه بشن نه scene - تا با چرخش کره بچرخن
async function createWorldBorders(earthMesh, options = {}) {
    const {
        defaultColor = 0x4488ff,
        defaultOpacity = 0.4,
        highlightColor = 0x00ff00,
        selectedCountry = null
    } = options;
    
    if (!earthMesh) {
        console.error('❌ earthMesh برای مرزها لازمه!');
        return null;
    }
    
    const geojson = await loadCountryBorders();
    if (!geojson) return null;
    
    const bordersGroup = new THREE.Group();
    bordersGroup.name = 'worldBorders';
    
    const countryGroups = {};
    
    geojson.features.forEach(feature => {
        const countryCode = feature.properties.ISO_A2;
        
        // تعیین رنگ بر اساس رابطه با کشور انتخاب شده
        let borderColor = defaultColor;
        let borderOpacity = defaultOpacity;
        
        if (selectedCountry && countriesData[selectedCountry]) {
            const relations = countriesData[selectedCountry].relations || {};
            if (relations[countryCode]) {
                borderColor = getRelationColor(relations[countryCode]);
                borderOpacity = 0.8;
            }
        }
        
        const countryGroup = createCountryBorders(feature, borderColor, borderOpacity);
        countryGroups[countryCode] = countryGroup;
        bordersGroup.add(countryGroup);
    });
    
    // ذخیره برای دسترسی بعدی
    bordersGroup.userData.countryGroups = countryGroups;
    
    // اضافه کردن به earth تا با چرخش کره بچرخن
    earthMesh.add(bordersGroup);
    return bordersGroup;
}

// آپدیت رنگ مرزها بر اساس کشور انتخاب شده
function updateBordersForCountry(bordersGroup, selectedCountryCode) {
    if (!bordersGroup || !bordersGroup.userData.countryGroups) return;
    
    const countryGroups = bordersGroup.userData.countryGroups;
    const selectedData = countriesData[selectedCountryCode];
    
    if (!selectedData) return;
    
    const relations = selectedData.relations || {};
    
    Object.keys(countryGroups).forEach(code => {
        const group = countryGroups[code];
        let color, opacity;
        
        if (code === selectedCountryCode) {
            // کشور انتخاب شده - آبی درخشان
            color = 0x00ffff;
            opacity = 1.0;
        } else if (relations[code]) {
            // کشورهایی که رابطه تعریف شده دارن
            color = getRelationColor(relations[code]);
            opacity = 0.9;
        } else {
            // بقیه کشورها - خاکستری کم‌رنگ
            color = 0x444444;
            opacity = 0.3;
        }
        
        // آپدیت رنگ همه خطوط در گروه
        group.children.forEach(line => {
            if (line.material) {
                line.material.color.setHex(color);
                line.material.opacity = opacity;
                line.material.needsUpdate = true;
            }
        });
    });
}

// ایجاد خط قوسی سه‌بعدی بین دو نقطه (برای صادرات/واردات)
function createArcLine(startCoords, endCoords, color = 0x00ff00, arcHeight = 0.3) {
    const start = latLngToVector3Globe(startCoords[0], startCoords[1]);
    const end = latLngToVector3Globe(endCoords[0], endCoords[1]);
    
    // نقطه میانی با ارتفاع
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const midLength = mid.length();
    mid.normalize().multiplyScalar(midLength + arcHeight);
    
    // ایجاد منحنی بزیه
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(50);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.8,
        linewidth: 2
    });
    
    return new THREE.Line(geometry, material);
}

// ایجاد خطوط تجارت برای یک کشور
// مهم: باید به earth اضافه بشه نه scene
function createTradeLines(countryCode, tradeType = 'exports', earthMesh) {
    const tradeGroup = new THREE.Group();
    tradeGroup.name = 'tradeLines';
    
    const countryData = countriesData[countryCode];
    if (!countryData) return tradeGroup;
    
    const capital = countryData.capital.coords;
    const tradeData = tradeType === 'exports' ? countryData.exports : countryData.imports;
    
    if (!tradeData || !tradeData.partners) return tradeGroup;
    
    tradeData.partners.forEach(partner => {
        const partnerData = countriesData[partner.country];
        if (!partnerData) return;
        
        const partnerCapital = partnerData.capital.coords;
        
        // رنگ بر اساس حجم تجارت
        let color;
        if (partner.percent >= 15) {
            color = 0x00ff00; // سبز - حجم بالا
        } else if (partner.percent >= 8) {
            color = 0xffff00; // زرد - حجم متوسط
        } else {
            color = 0x888888; // خاکستری - حجم کم
        }
        
        // ارتفاع قوس بر اساس فاصله
        const distance = Math.sqrt(
            Math.pow(capital[0] - partnerCapital[0], 2) + 
            Math.pow(capital[1] - partnerCapital[1], 2)
        );
        const arcHeight = Math.min(0.5, distance / 100);
        
        const arc = tradeType === 'exports' 
            ? createArcLine(capital, partnerCapital, color, arcHeight)
            : createArcLine(partnerCapital, capital, color, arcHeight);
            
        arc.userData = {
            from: countryCode,
            to: partner.country,
            amount: partner.amount,
            percent: partner.percent,
            type: tradeType
        };
        
        tradeGroup.add(arc);
    });
    
    // اضافه کردن به earth
    if (earthMesh) {
        earthMesh.add(tradeGroup);
    }
    return tradeGroup;
}

// ایجاد آدمک جنگ ساده (شبیه استیکمن)
function createWarFigure(position, color = 0xff0000, scale = 0.03) {
    const group = new THREE.Group();
    
    // سر
    const headGeo = new THREE.SphereGeometry(scale * 0.4, 8, 8);
    const headMat = new THREE.MeshBasicMaterial({ color: color });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = scale * 1.5;
    group.add(head);
    
    // بدن
    const bodyGeo = new THREE.CylinderGeometry(scale * 0.1, scale * 0.15, scale * 1, 8);
    const bodyMat = new THREE.MeshBasicMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = scale * 0.7;
    group.add(body);
    
    // دست‌ها (با شمشیر)
    const armGeo = new THREE.CylinderGeometry(scale * 0.05, scale * 0.05, scale * 0.8, 8);
    const armMat = new THREE.MeshBasicMaterial({ color: color });
    
    // دست راست
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(scale * 0.3, scale * 1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    group.add(rightArm);
    
    // شمشیر
    const swordGeo = new THREE.BoxGeometry(scale * 0.05, scale * 1, scale * 0.02);
    const swordMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const sword = new THREE.Mesh(swordGeo, swordMat);
    sword.position.set(scale * 0.6, scale * 1.4, 0);
    sword.rotation.z = -Math.PI / 6;
    group.add(sword);
    
    // پاها
    const legGeo = new THREE.CylinderGeometry(scale * 0.06, scale * 0.06, scale * 0.6, 8);
    const legMat = new THREE.MeshBasicMaterial({ color: color });
    
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-scale * 0.15, scale * 0.1, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(scale * 0.15, scale * 0.1, 0);
    group.add(rightLeg);
    
    // موقعیت روی کره
    group.position.copy(position);
    
    // چرخش به سمت بیرون کره
    const normal = position.clone().normalize();
    group.lookAt(normal.multiplyScalar(2).add(position));
    group.rotateX(Math.PI / 2);
    
    return group;
}

// ایجاد خط درگیری بین دو کشور
function createConflictLine(country1Code, country2Code, intensity = 'war') {
    const group = new THREE.Group();
    
    const data1 = countriesData[country1Code];
    const data2 = countriesData[country2Code];
    
    if (!data1 || !data2) return group;
    
    const pos1 = latLngToVector3Globe(data1.capital.coords[0], data1.capital.coords[1], 1.02);
    const pos2 = latLngToVector3Globe(data2.capital.coords[0], data2.capital.coords[1], 1.02);
    
    const color = getConflictColor(intensity);
    
    // خط قوسی قرمز بین دو پایتخت
    const mid = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
    const midLength = mid.length();
    mid.normalize().multiplyScalar(midLength + 0.15);
    
    const curve = new THREE.QuadraticBezierCurve3(pos1, mid, pos2);
    const points = curve.getPoints(30);
    
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.9,
        linewidth: 3
    });
    const line = new THREE.Line(lineGeo, lineMat);
    group.add(line);
    
    // آدمک‌های جنگی در دو طرف
    // اندازه آدمک حدود 100 کیلومتر نسبت به کره (0.016 از شعاع 1)
    const figureScale = 0.016;
    
    const figure1 = createWarFigure(pos1, color, figureScale);
    figure1.lookAt(pos2); // رو به رو
    group.add(figure1);
    
    const figure2 = createWarFigure(pos2, color, figureScale);
    figure2.lookAt(pos1); // رو به رو
    figure2.rotateY(Math.PI); // چرخش 180 درجه
    group.add(figure2);
    
    group.userData = {
        country1: country1Code,
        country2: country2Code,
        intensity: intensity
    };
    
    return group;
}

// ایجاد تمام خطوط درگیری‌های فعال
// مهم: باید به earth اضافه بشه نه scene
function createAllConflicts(earthMesh) {
    const conflictsGroup = new THREE.Group();
    conflictsGroup.name = 'conflicts';
    
    // پیدا کردن همه درگیری‌ها
    const processedConflicts = new Set();
    
    Object.keys(countriesData).forEach(code => {
        const country = countriesData[code];
        if (!country.conflicts || country.conflicts.length === 0) return;
        
        country.conflicts.forEach(conflict => {
            // جلوگیری از تکرار (مثلاً RU-UA و UA-RU)
            const key = [code, conflict.opponent].sort().join('-');
            if (processedConflicts.has(key)) return;
            processedConflicts.add(key);
            
            const conflictLine = createConflictLine(code, conflict.opponent, conflict.intensity);
            conflictsGroup.add(conflictLine);
        });
    });
    
    // اضافه کردن به earth
    if (earthMesh) {
        earthMesh.add(conflictsGroup);
    }
    return conflictsGroup;
}

// نمایش/مخفی کردن درگیری‌ها
function toggleConflicts(conflictsGroup, visible) {
    if (conflictsGroup) {
        conflictsGroup.visible = visible;
    }
}

// نمایش/مخفی کردن خطوط تجارت
function toggleTradeLines(tradeGroup, visible) {
    if (tradeGroup) {
        tradeGroup.visible = visible;
    }
}

// پاک کردن خطوط تجارت قبلی
function clearTradeLines(earthMesh) {
    if (!earthMesh) return;
    const existing = earthMesh.getObjectByName('tradeLines');
    if (existing) {
        earthMesh.remove(existing);
        existing.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
    }
}

// ایجاد برچسب متنی برای کشور (Sprite)
function createCountryLabel(text, position, scale = 0.08) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // پس‌زمینه شفاف
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // متن
    context.font = 'bold 36px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // سایه
    context.shadowColor = 'rgba(0, 0, 0, 0.8)';
    context.shadowBlur = 4;
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    
    // رنگ متن
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.scale.set(scale, scale * 0.25, 1);
    sprite.userData = { isLabel: true, text };
    
    return sprite;
}

// ایجاد برچسب‌های همه کشورها
function createCountryLabels(earthMesh, camera) {
    if (!earthMesh || typeof countriesData === 'undefined') return null;
    
    const labelsGroup = new THREE.Group();
    labelsGroup.name = 'countryLabels';
    
    Object.entries(countriesData).forEach(([code, data]) => {
        if (!data.capital || !data.capital.coords) return;
        
        const lat = data.capital.coords[0];
        const lng = data.capital.coords[1];
        
        // موقعیت کمی بالاتر از سطح کره
        const position = latLngToVector3Globe(lat, lng, 1.02);
        
        // اندازه برچسب بر اساس GDP یا اهمیت
        let scale = 0.06;
        if (data.gdpRank && data.gdpRank <= 10) scale = 0.1;
        else if (data.gdpRank && data.gdpRank <= 30) scale = 0.08;
        
        const label = createCountryLabel(code, position, scale);
        label.userData.countryCode = code;
        label.userData.countryName = data.name;
        labelsGroup.add(label);
    });
    
    earthMesh.add(labelsGroup);
    return labelsGroup;
}

// آپدیت نمایش برچسب‌ها بر اساس فاصله دوربین
function updateLabelsVisibility(labelsGroup, camera, minDistance = 1.5, maxDistance = 4) {
    if (!labelsGroup || !camera) return;
    
    const cameraDistance = camera.position.length();
    
    labelsGroup.children.forEach(label => {
        if (!label.userData.isLabel) return;
        
        // برچسب‌های بزرگ (کشورهای مهم) همیشه دیده بشن
        // برچسب‌های کوچک فقط وقتی زوم کردیم
        const labelScale = label.scale.x;
        
        if (labelScale >= 0.09) {
            // کشورهای بزرگ - همیشه نمایش
            label.visible = true;
        } else if (labelScale >= 0.07) {
            // کشورهای متوسط - از فاصله متوسط
            label.visible = cameraDistance < 3;
        } else {
            // کشورهای کوچک - فقط با زوم
            label.visible = cameraDistance < 2;
        }
        
        // مقیاس بر اساس فاصله
        const scaleFactor = Math.max(0.5, Math.min(1.5, 2.5 / cameraDistance));
        label.scale.x = labelScale * scaleFactor;
        label.scale.y = labelScale * 0.25 * scaleFactor;
    });
}

// ============================================
// آیکون‌های منابع و صنایع روی کره
// ============================================

// ایجاد آیکون دکل نفت - ساده‌تر و کوچک‌تر
function createOilDerrickIcon(position, scale = 0.02) {
    const group = new THREE.Group();
    
    // استفاده از یک نشانگر ساده‌تر برای اندازه کوچک
    // نقطه نشانگر (روی سطح)
    const dotGeo = new THREE.SphereGeometry(scale * 0.5, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x1f2937 });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    group.add(dot);
    
    // دکل کوچک
    const towerGeo = new THREE.ConeGeometry(scale * 0.3, scale * 1.5, 4);
    const towerMat = new THREE.MeshBasicMaterial({ color: 0x374151 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = scale * 0.75;
    group.add(tower);
    
    // نوک قرمز
    const topGeo = new THREE.SphereGeometry(scale * 0.2, 6, 6);
    const topMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const top = new THREE.Mesh(topGeo, topMat);
    top.position.y = scale * 1.5;
    group.add(top);
    
    // موقعیت گذاری روی سطح کره
    group.position.copy(position);
    
    // جهت‌دهی به سمت بیرون
    group.lookAt(position.clone().multiplyScalar(2));
    group.rotateX(-Math.PI / 2);
    
    return group;
}

// ایجاد آیکون سکوی نفتی (دریایی) - ساده‌تر
function createOilPlatformIcon(position, scale = 0.025) {
    const group = new THREE.Group();
    
    // پایه آبی
    const baseGeo = new THREE.CylinderGeometry(scale * 0.3, scale * 0.4, scale * 0.2, 6);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);
    
    // سکو
    const platformGeo = new THREE.BoxGeometry(scale * 1, scale * 0.15, scale * 1);
    const platformMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = scale * 0.4;
    group.add(platform);
    
    // کرین کوچک
    const craneGeo = new THREE.CylinderGeometry(scale * 0.08, scale * 0.08, scale * 0.8, 6);
    const craneMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const crane = new THREE.Mesh(craneGeo, craneMat);
    crane.position.y = scale * 0.8;
    group.add(crane);
    
    group.position.copy(position);
    group.lookAt(position.clone().multiplyScalar(2));
    group.rotateX(-Math.PI / 2);
    
    return group;
}

// ایجاد آیکون معدن - ساده‌تر
function createMineIcon(position, color = 0xfbbf24, scale = 0.02) {
    const group = new THREE.Group();
    
    // تپه کوچک
    const hillGeo = new THREE.ConeGeometry(scale * 0.6, scale * 0.4, 6);
    const hillMat = new THREE.MeshBasicMaterial({ color: 0x78716c });
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.y = scale * 0.2;
    group.add(hill);
    
    // نشانگر رنگی (نوع منبع)
    const markerGeo = new THREE.SphereGeometry(scale * 0.35, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({ color: color });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.y = scale * 0.6;
    group.add(marker);
    
    group.position.copy(position);
    group.lookAt(position.clone().multiplyScalar(2));
    group.rotateX(-Math.PI / 2);
    
    return group;
}

// ایجاد آیکون پالایشگاه - ساده‌تر
function createRefineryIcon(position, scale = 0.02) {
    const group = new THREE.Group();
    
    // ساختمان
    const buildingGeo = new THREE.BoxGeometry(scale * 0.6, scale * 0.3, scale * 0.4);
    const buildingMat = new THREE.MeshBasicMaterial({ color: 0x6b7280 });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.y = scale * 0.15;
    group.add(building);
    
    // دودکش‌ها (2 عدد)
    for (let i = 0; i < 2; i++) {
        const chimneyGeo = new THREE.CylinderGeometry(scale * 0.08, scale * 0.1, scale * 0.6, 6);
        const chimneyMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
        chimney.position.set((i - 0.5) * scale * 0.25, scale * 0.6, 0);
        group.add(chimney);
    }
    
    group.position.copy(position);
    group.lookAt(position.clone().multiplyScalar(2));
    group.rotateX(-Math.PI / 2);
    
    return group;
}

// ایجاد آیکون کارخانه - ساده‌تر
function createFactoryIcon(position, color = 0x3b82f6, scale = 0.02) {
    const group = new THREE.Group();
    
    // ساختمان
    const buildingGeo = new THREE.BoxGeometry(scale * 0.7, scale * 0.35, scale * 0.5);
    const buildingMat = new THREE.MeshBasicMaterial({ color: 0x4b5563 });
    const building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.y = scale * 0.175;
    group.add(building);
    
    // سقف رنگی
    const roofGeo = new THREE.BoxGeometry(scale * 0.8, scale * 0.15, scale * 0.6);
    const roofMat = new THREE.MeshBasicMaterial({ color: color });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = scale * 0.4;
    group.add(roof);
    
    // دودکش کوچک
    const chimneyGeo = new THREE.CylinderGeometry(scale * 0.08, scale * 0.08, scale * 0.4, 6);
    const chimneyMat = new THREE.MeshBasicMaterial({ color: 0x78716c });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(scale * 0.2, scale * 0.6, 0);
    group.add(chimney);
    
    group.position.copy(position);
    group.lookAt(position.clone().multiplyScalar(2));
    group.rotateX(-Math.PI / 2);
    
    return group;
}

// ایجاد همه آیکون‌های منابع یک کشور
function createResourceIcons(earthMesh, countryCode, resourceFilter = 'all') {
    if (!earthMesh || typeof worldResources === 'undefined') return null;
    
    const resources = worldResources[countryCode];
    if (!resources) return null;
    
    const iconsGroup = new THREE.Group();
    iconsGroup.name = `resources_${countryCode}`;
    
    // شعاع ثابت برای همه آیکون‌ها - چسبیده به سطح کره
    const ICON_RADIUS = 1.003;
    // اندازه کوچک برای آیکون‌ها
    const ICON_SCALE = 0.006;
    
    // میدان‌های نفتی
    if ((resourceFilter === 'all' || resourceFilter === 'oil') && resources.oil_fields) {
        resources.oil_fields.forEach(field => {
            const pos = latLngToVector3Globe(field.lat, field.lng, ICON_RADIUS);
            const icon = createOilDerrickIcon(pos, ICON_SCALE);
            icon.userData = { type: 'oil_field', data: field, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // سکوهای نفتی
    if ((resourceFilter === 'all' || resourceFilter === 'oil') && resources.oil_platforms) {
        resources.oil_platforms.forEach(platform => {
            const pos = latLngToVector3Globe(platform.lat, platform.lng, ICON_RADIUS);
            const icon = createOilPlatformIcon(pos, ICON_SCALE * 1.2);
            icon.userData = { type: 'oil_platform', data: platform, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // میدان‌های گازی
    if ((resourceFilter === 'all' || resourceFilter === 'gas') && resources.gas_fields) {
        resources.gas_fields.forEach(field => {
            const pos = latLngToVector3Globe(field.lat, field.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0x8b5cf6, ICON_SCALE);
            icon.userData = { type: 'gas_field', data: field, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // پالایشگاه‌ها
    if ((resourceFilter === 'all' || resourceFilter === 'refinery') && resources.refineries) {
        resources.refineries.forEach(refinery => {
            const pos = latLngToVector3Globe(refinery.lat, refinery.lng, ICON_RADIUS);
            const icon = createRefineryIcon(pos, ICON_SCALE);
            icon.userData = { type: 'refinery', data: refinery, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن طلا
    if ((resourceFilter === 'all' || resourceFilter === 'gold') && resources.gold_mines) {
        resources.gold_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0xfbbf24, ICON_SCALE);
            icon.userData = { type: 'gold_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن آهن
    if ((resourceFilter === 'all' || resourceFilter === 'iron') && resources.iron_mines) {
        resources.iron_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0x6b7280, ICON_SCALE);
            icon.userData = { type: 'iron_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن مس
    if ((resourceFilter === 'all' || resourceFilter === 'copper') && resources.copper_mines) {
        resources.copper_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0xb45309, ICON_SCALE);
            icon.userData = { type: 'copper_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن زغال
    if ((resourceFilter === 'all' || resourceFilter === 'coal') && resources.coal_mines) {
        resources.coal_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0x1f2937, ICON_SCALE);
            icon.userData = { type: 'coal_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن الماس
    if ((resourceFilter === 'all' || resourceFilter === 'diamond') && resources.diamond_mines) {
        resources.diamond_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0x60a5fa, ICON_SCALE);
            icon.userData = { type: 'diamond_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // معادن اورانیوم
    if ((resourceFilter === 'all' || resourceFilter === 'uranium') && resources.uranium_mines) {
        resources.uranium_mines.forEach(mine => {
            const pos = latLngToVector3Globe(mine.lat, mine.lng, ICON_RADIUS);
            const icon = createMineIcon(pos, 0x22c55e, ICON_SCALE);
            icon.userData = { type: 'uranium_mine', data: mine, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    // کارخانه‌ها
    if ((resourceFilter === 'all' || resourceFilter === 'factory') && resources.factories) {
        resources.factories.forEach(factory => {
            const pos = latLngToVector3Globe(factory.lat, factory.lng, ICON_RADIUS);
            let color = 0x3b82f6;
            if (factory.type === 'factory_auto') color = 0x3b82f6;
            else if (factory.type === 'factory_tech') color = 0x06b6d4;
            else if (factory.type === 'factory_steel') color = 0x78716c;
            
            const icon = createFactoryIcon(pos, color, ICON_SCALE);
            icon.userData = { type: factory.type, data: factory, country: countryCode };
            iconsGroup.add(icon);
        });
    }
    
    earthMesh.add(iconsGroup);
    return iconsGroup;
}

// پاک کردن آیکون‌های منابع
function clearResourceIcons(earthMesh, countryCode = null) {
    if (!earthMesh) return;
    
    const toRemove = [];
    earthMesh.children.forEach(child => {
        if (child.name && child.name.startsWith('resources_')) {
            if (!countryCode || child.name === `resources_${countryCode}`) {
                toRemove.push(child);
            }
        }
    });
    
    toRemove.forEach(child => {
        earthMesh.remove(child);
        child.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
    });
}

// نمایش آیکون‌های همه کشورها برای یک نوع منبع
function showResourcesByType(earthMesh, resourceType) {
    if (!earthMesh || typeof worldResources === 'undefined') return;
    
    clearResourceIcons(earthMesh);
    
    Object.keys(worldResources).forEach(code => {
        createResourceIcons(earthMesh, code, resourceType);
    });
}

// Export
if (typeof window !== 'undefined') {
    window.loadCountryBorders = loadCountryBorders;
    window.createWorldBorders = createWorldBorders;
    window.updateBordersForCountry = updateBordersForCountry;
    window.createTradeLines = createTradeLines;
    window.createConflictLine = createConflictLine;
    window.createAllConflicts = createAllConflicts;
    window.toggleConflicts = toggleConflicts;
    window.toggleTradeLines = toggleTradeLines;
    window.clearTradeLines = clearTradeLines;
    window.createArcLine = createArcLine;
    window.createCountryLabels = createCountryLabels;
    window.updateLabelsVisibility = updateLabelsVisibility;
    window.createResourceIcons = createResourceIcons;
    window.clearResourceIcons = clearResourceIcons;
    window.showResourcesByType = showResourcesByType;
}

