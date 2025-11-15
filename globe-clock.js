/*  globe-clock.js  |  نسخه جدید  */
let marketData = [];          // بعداً fetch می‌شود
let scene, camera, renderer, globe, dayMat, nightMat;
let sunAngle = 0;             // زاویه خورشید بر اساس UTC واقعی
const sunSpeed = 0.0001;      // سرعت واقعی چرخش روز/شب

/* شروع fetch داده‌ها */
fetch('./market-data.json')
  .then(res => res.json())
  .then(data => {
    marketData = data;
    initGlobe();
  })
  .catch(err => console.error('JSON load failed:', err));

/* ساخت صحنه */
function initGlobe() {
  const container = document.getElementById('globeContainer');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 2.8;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* نورهای واقعی */
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.name = 'sun';
  scene.add(sun);

  /* کره با متریال روز/شب */
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const loader = new THREE.TextureLoader();
  dayMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-day.jpg') });
  nightMat = new THREE.MeshPhongMaterial({ map: loader.load('earth-night.jpg') });

  globe = new THREE.Mesh(geometry, dayMat);
  scene.add(globe);

  /* نقاط بازار */
  addMarketPoints();

  /* شروع انیمیشن */
  animate();
}

/* افزودن نقاط بازار - چشمک‌زن */
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

    /* چشمک زدن */
    let visible = true;
    setInterval(() => {
      visible = !visible;
      point.visible = visible;
    }, 500);
  });
}

/* رنگ وضعیت بازار */
function statusColor(market) {
  const now = utcMinutes();
  const open  = timeToMinutes(market.open);
  const close = timeToMinutes(market.close);

  if (now >= open && now < close) return 0x00ff00;        // سبز (باز)
  if (Math.abs(now - open)  <= 15) return 0xffff00;     // زرد (در شرف باز)
  if (Math.abs(now - close) <= 15) return 0xff8800;     // نارنجی (در شرف بسته)
  return 0xff0000; // قرمز (بسته)
}
function timeToMinutes(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function utcMinutes() {
  const d = new Date();
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

/* تبدیل lat,lng → Vector3 */
function latLngToVector3(lat, lng) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(Math.sin(phi) * Math.cos(theta));
  const z =  Math.sin(phi) * Math.sin(theta);
  const y =  Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/* انیمیشن اصلی - روز/شب واقعی */
function animate() {
  requestAnimationFrame(animate);

  /* چرخش خودکار کره */
  globe.rotation.y += 0.0008;

  /* موقعیت خورشید بر اساب UTC واقعی */
  const now = new Date();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  sunAngle = (utcHour / 24) * 2 * Math.PI;   // ۰-۲π
  const sunX = Math.cos(sunAngle) * 5;
  const sunY = Math.sin(sunAngle * 0.3) * 2; // زاویه ارتفاع ملایم
  const sun = scene.getObjectByName('sun');
  if (sun) sun.position.set(sunX, sunY, 3);

  /* interpolate متریال */
  const dayWeight   = Math.max(0, Math.cos(sunAngle));
  globe.material = dayWeight > 0.5 ? dayMat : nightMat;

  renderer.render(scene, camera);
}

/* باز/بسته مودال */
const modal = document.getElementById('gcModal');
const simpleClock = document.getElementById('gcClockSimple');

document.getElementById('globeContainer').addEventListener('click', () => {
  modal.style.display = 'grid';
  const active = marketData.filter(m => statusColor(m) === 0x00ff00).length;
  simpleClock.innerHTML = `
    <p>ساعت UTC هم‌اکنون: <strong>${String(new Date().getUTCHours()).padStart(2,'0')}:${String(new Date().getUTCMinutes()).padStart(2,'0')}</strong></p>
    <p>بازارهای فعال: ${active}</p>
  `;
});
document.querySelector('.gc-close').onclick = () => modal.style.display = 'none';
