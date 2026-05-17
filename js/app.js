/* ═══════════════════════════════════════════════════════
   Farhan Yousaf · GHLThemer Portfolio — Main JS
   ═══════════════════════════════════════════════════════ */

/* ── Year ─────────────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Nav / Sidebar ────────────────────────────────────── */
const navToggle     = document.getElementById('nav-toggle');
const sidebar       = document.getElementById('sidebar');
const sidebarClose  = document.getElementById('sidebar-close');
const sidebarOvly   = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOvly.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOvly.classList.remove('active');
  document.body.style.overflow = '';
}

navToggle?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
sidebarOvly?.addEventListener('click', closeSidebar);

/* ── Smooth Anchor Scroll ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeSidebar();
    const offset = 72; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Three.js Particle Network ────────────────────────── */
(function initThree() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = () => canvas.clientWidth;
  const H = () => canvas.clientHeight;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, W() / H(), 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);

  /* Particles */
  const N = 130;
  const positions  = new Float32Array(N * 3);
  const pData      = [];

  for (let i = 0; i < N; i++) {
    const x = (Math.random() - .5) * 58;
    const y = (Math.random() - .5) * 38;
    const z = (Math.random() - .5) * 18;
    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    pData.push({
      x, y, z,
      vx: (Math.random() - .5) * .016,
      vy: (Math.random() - .5) * .011,
      vz: (Math.random() - .5) * .007
    });
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const ptMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.17,
    transparent: true,
    opacity: 0.72,
    sizeAttenuation: true
  });
  scene.add(new THREE.Points(ptGeo, ptMat));

  /* Connection lines */
  const MAX_LINES   = N * N;
  const linePos     = new Float32Array(MAX_LINES * 6);
  const lineGeo     = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.1
  });
  const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegs);

  const posAttr  = ptGeo.attributes.position;
  const THRESH   = 8;
  const THRESH2  = THRESH * THRESH;

  /* Mouse parallax */
  const mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth  - .5) * 2;
    mouse.y = (e.clientY / window.innerHeight - .5) * 2;
  });

  /* Animate */
  function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < N; i++) {
      const p = pData[i];
      p.x += p.vx; p.y += p.vy; p.z += p.vz;
      if (Math.abs(p.x) > 29) p.vx *= -1;
      if (Math.abs(p.y) > 19) p.vy *= -1;
      if (Math.abs(p.z) >  9) p.vz *= -1;
      posAttr.setXYZ(i, p.x, p.y, p.z);
    }
    posAttr.needsUpdate = true;

    let li = 0;
    outer: for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pData[i].x - pData[j].x;
        const dy = pData[i].y - pData[j].y;
        if (dx * dx + dy * dy < THRESH2) {
          const base = li * 6;
          linePos[base]     = pData[i].x;
          linePos[base + 1] = pData[i].y;
          linePos[base + 2] = pData[i].z;
          linePos[base + 3] = pData[j].x;
          linePos[base + 4] = pData[j].y;
          linePos[base + 5] = pData[j].z;
          if (++li >= MAX_LINES) break outer;
        }
      }
    }
    lineGeo.setDrawRange(0, li * 2);
    lineGeo.attributes.position.needsUpdate = true;

    camera.position.x += (mouse.x * 1.8 - camera.position.x) * .022;
    camera.position.y += (-mouse.y * 1.2 - camera.position.y) * .022;

    renderer.render(scene, camera);
  }
  animate();

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });
})();

/* ── GSAP Scroll Animations ───────────────────────────── */
(function initGSAP() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* Hero entrance */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
  heroTl
    .fromTo('.hero-badge',    { opacity:0, y:18 }, { opacity:1, y:0, duration:.6 })
    .fromTo('.hero-headline', { opacity:0, y:32 }, { opacity:1, y:0, duration:.75 }, '-=.35')
    .fromTo('.hero-sub',      { opacity:0, y:22 }, { opacity:1, y:0, duration:.6  }, '-=.45')
    .fromTo('.hero-actions',  { opacity:0, y:18 }, { opacity:1, y:0, duration:.55 }, '-=.4')
    .fromTo('.hero-socials',  { opacity:0       }, { opacity:1, duration:.5        }, '-=.3')
    .fromTo('.hero-visual',   { opacity:0, x:40 }, { opacity:1, x:0, duration:.8  }, '-=.65');

  if (typeof ScrollTrigger === 'undefined') return;

  /* Generic reveal blocks */
  gsap.utils.toArray('.gsap-reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity:0, y:40 },
      { opacity:1, y:0, duration:.85, ease:'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true } }
    );
  });

  /* Feature cards stagger */
  gsap.fromTo('.feat-card',
    { opacity:0, y:50, scale:.96 },
    { opacity:1, y:0, scale:1, duration:.65, stagger:.14, ease:'power3.out',
      scrollTrigger: { trigger:'.features-grid', start:'top 82%', once:true } }
  );

  /* Pricing cards stagger */
  gsap.fromTo('.price-card',
    { opacity:0, y:50 },
    { opacity:1, y:0, duration:.65, stagger:.12, ease:'power3.out',
      scrollTrigger: { trigger:'.pricing-grid', start:'top 82%', once:true } }
  );

  /* Stack items */
  gsap.fromTo('.stack-item',
    { opacity:0, scale:.82 },
    { opacity:1, scale:1, duration:.5, stagger:.07, ease:'back.out(1.6)',
      scrollTrigger: { trigger:'.stack-grid', start:'top 86%', once:true } }
  );

  /* Timeline items */
  gsap.fromTo('.tl-item',
    { opacity:0, x:-28 },
    { opacity:1, x:0, duration:.6, stagger:.18, ease:'power3.out',
      scrollTrigger: { trigger:'.timeline', start:'top 82%', once:true } }
  );

  /* Stat counters */
  gsap.utils.toArray('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: '.stats-bar',
      start: 'top 90%',
      once: true,
      onEnter() {
        gsap.fromTo({ val: 0 }, { val: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  /* Browser mockup reveal */
  gsap.fromTo('.browser-mockup',
    { opacity:0, y:50, rotateX:8 },
    { opacity:1, y:0, rotateX:0, duration:1, ease:'power3.out',
      scrollTrigger: { trigger:'.browser-mockup', start:'top 85%', once:true } }
  );

  /* CTA */
  gsap.fromTo('.cta-headline, .cta-sub, .cta-inner .btn-primary',
    { opacity:0, y:30 },
    { opacity:1, y:0, duration:.7, stagger:.15, ease:'power3.out',
      scrollTrigger: { trigger:'.cta-section', start:'top 82%', once:true } }
  );
})();

/* ── Contact Page: Tilt on cards ─────────────────────── */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.contact-card'), {
    max: 8, speed: 400, glare: false
  });
}
