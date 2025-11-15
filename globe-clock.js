/*  globe-clock.js  |  نسخهٔ تمیز  */
let marketData = [];          // بعداً fetch می‌شود
let scene, camera, renderer, globe, dayMat, nightMat;
let sunAngle = 0;             // ← این همان متغیری است که گم شده
const sunSpeed = 0.0008;      // سرعت چرخش باند نور

/* ========== شروع ========== */
fetch('./market-data.json')
  .then(res => res.json())
  .then(data => {
    marketData = data;
    initGlobe();              // همه چیز اینجا آغاز می‌شود
  })
  .catch(err => console.error('JSON load failed:', err));

/* ========== ساخت صحنه ========== */
function initGlobe() {
  const container = document.getElementById('globeContainer');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 2.8;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(160, 160);
  container.appendChild(renderer.domElement);

  /* نور */
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.name = 'sun';        // برای پیدا کردن بعداً
  directional.position.set(5, 3, 5);
  scene.add(directional);

  /* کره */
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  dayMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-day.jpg') });
  nightMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-night.jpg') });

  globe = new THREE.Mesh(geometry, dayMat);
  scene.add(globe);

  /* نقاط بازار */
  addMarketPoints();

  /* شروع چرخهٔ انیمیشن */
  animate();
}

/* ========== نقاط بازار (چشمک) ========== */
function addMarketPoints() {
  marketData.forEach(m => {
    const pos = latLngToVector3(m.coords[0], m.coords[1]);
    const color = statusColor(m);
    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 16, 16),
      new THREE.MeshBasicMaterial({ color })
    );
    point.position.copy(pos);
    globe.add(point);
  });
}

/* ========== رنگ وضعیت بازار ========== */
function statusColor(mark) {
  const now = utcMinutes();
  const open  = timeToMinutes(mark.open);
  const close = timeToMinutes(mark.close);
  if (now >= open && now < close) return 0x00ff00;        // سبز
  if (Math.abs(now - open)  <= 15) return 0xffff00;     // زرد
  if (Math.abs(now - close) <= 15) return 0xff8800;     // نارنجی
  return 0x444444; // خاکستری (بسته)
}
function timeToMinutes(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function utcMinutes() {
  const d = new Date();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/* ========== تبدیل lat,lng → Vector3 ========== */
function latLngToVector3(lat, lng) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const z =  Math.sin(phi) * Math.sin(theta);
  const y =  Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/* ========== انیمیشن اصلی ========== */
function animate() {
  requestAnimationFrame(animate);

  /* چرخش خودکار کره */
  globe.rotation.y += 0.001;

  /* چرخش باند نور روز/شب */
  sunAngle += sunSpeed;
  const sunX = Math.cos(sunAngle) * 5;
  const sun  = scene.getObjectByName('sun');
  if (sun) sun.position.set(sunX, 2, 3);

  /* interpolate متریال */
  const dayWeight   = Math.max(0, Math.cos(sunAngle));
  const nightWeight = 1 - dayWeight;
  globe.material = dayWeight > 0.5 ? dayMat : nightMat;

  renderer.render(scene, camera);
}

/* ========== باز/بسته مودال ========== */
const modal = document.getElementById('gcModal');
const simpleClock = document.getElementById('gcClockSimple');

document.getElementById('globeContainer').addEventListener('click', () => {
  modal.style.display = 'grid';
  simpleClock.innerHTML = `
    <p>ساعت UTC هم‌اکنون: <strong>${String(new Date().getUTCHours()).padStart(2,'0')}:${String(new Date().getUTCMinutes()).padStart(2,'0')}</strong></p>
    <p>بازارهای فعال: ${marketData.filter(m => statusColor(m) === 0x00ff00).length}</p>
  `;
});
document.querySelector('.gc-close').onclick = () => modal.style.display = 'none';
