// =============================================
//  script.js — יום הולדת לרחלי
// =============================================

let lbIndex    = 0;
let galleryOff = 0;
const CHUNK    = 12;

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────
window.addEventListener('load', () => {
  fixMissingImages();
  initStars();
  initBalloons();
  initMouseTrail();
  initSectionBgs();
  initHeroThumbs();
  initBlessingStrips();
  initPhotoOnlySections();
  initGallery();
  initScrollAnimations();
  initKeyboardNav();
  initNavDots();

  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    setTimeout(launchConfetti, 900);
  }, 1600);
});

// ─────────────────────────────────────────────
//  IMAGE PLACEHOLDERS (fallback on error)
// ─────────────────────────────────────────────
function fixMissingImages() {
  document.querySelectorAll('img').forEach(img => {
    const origSrc = img.src;
    img.addEventListener('error', function() {
      const alt = img.alt || img.dataset.label || '';
      img.src = _ph(alt || '📸', '#c9445a', '#8b1a2f');
      img.onerror = null;
    });
    // If src not set yet (data-src pattern), skip
  });
}

// ─────────────────────────────────────────────
//  SECTION BACKGROUNDS
// ─────────────────────────────────────────────
function initSectionBgs() {
  Object.entries(sectionBgs).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url('${url}')`; };
    img.onerror = () => {
      const label = id.replace('-bg','');
      el.style.background = `linear-gradient(135deg, #c9445a 0%, #8b1a2f 100%)`;
    };
    img.src = url;
  });
}

// ─────────────────────────────────────────────
//  HERO THUMBNAILS (family photos)
// ─────────────────────────────────────────────
function initHeroThumbs() {
  const container = document.getElementById('hero-thumbs');
  if (!container) return;
  const showCount = Math.min(familyPhotos.length, 5);
  for (let i = 0; i < showCount; i++) {
    const ph = familyPhotos[i];
    const img = document.createElement('img');
    img.className = 'hero-thumb animate-on-scroll';
    img.alt = ph.caption || 'תמונה משפחתית';
    img.loading = 'lazy';
    img.src = ph.src;
    img.onerror = () => { img.src = PLACEHOLDERS.family(i + 1); img.onerror = null; };
    img.onclick = () => openLightbox(i);
    img.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(img);
  }
}

// ─────────────────────────────────────────────
//  BLESSING PHOTO STRIPS
// ─────────────────────────────────────────────
function initBlessingStrips() {
  const strips = [
    { id: 'strip-tzafrir', photos: tzafrirPhotos, ph: PLACEHOLDERS.tzafrir, offset: 0 },
    { id: 'strip-tal',     photos: talPhotos,     ph: PLACEHOLDERS.tal,     offset: 100 },
    { id: 'strip-guy',     photos: guyPhotos,     ph: PLACEHOLDERS.guy,     offset: 200 },
    { id: 'strip-uri',     photos: uriPhotos,     ph: PLACEHOLDERS.uri,     offset: 300 },
    { id: 'strip-scott',   photos: scottPhotos,   ph: PLACEHOLDERS.scott,   offset: 400 },
  ];

  strips.forEach(({ id, photos, ph, offset }) => {
    const el = document.getElementById(id);
    if (!el) return;
    photos.forEach((src, i) => {
      const img = document.createElement('img');
      img.className = 'strip-photo';
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => { img.src = ph(i + 1); img.onerror = null; };
      img.onclick = () => openPersonLightbox([...photos], i, ph);
      el.appendChild(img);
    });
  });
}

// ─────────────────────────────────────────────
//  PHOTO-ONLY SECTIONS (צפריר / גיא / אורי)
// ─────────────────────────────────────────────
function initPhotoOnlySections() {
  const sections = [
    { bgId: 'tzafrir-cycle', dotsId: 'tzafrir-cycle-dots', photos: tzafrirPhotos, ph: PLACEHOLDERS.tzafrir },
    { bgId: 'guy-cycle',     dotsId: 'guy-cycle-dots',     photos: guyPhotos,     ph: PLACEHOLDERS.guy },
    { bgId: 'uri-cycle',     dotsId: 'uri-cycle-dots',     photos: uriPhotos,     ph: PLACEHOLDERS.uri },
  ];

  sections.forEach(({ bgId, dotsId, photos, ph }) => {
    const bg = document.getElementById(bgId);
    const dotsEl = document.getElementById(dotsId);
    if (!bg || !photos.length) return;

    let current = 0;

    const imgs = photos.map((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = i === 0 ? 'eager' : 'lazy';
      img.onerror = () => { img.src = ph(i + 1); img.onerror = null; };
      if (i === 0) img.classList.add('active');
      bg.appendChild(img);
      return img;
    });

    if (dotsEl) {
      photos.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'cycle-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
    }

    function goTo(idx) {
      imgs[current].classList.remove('active');
      const allDots = dotsEl ? dotsEl.querySelectorAll('.cycle-dot') : [];
      if (allDots[current]) allDots[current].classList.remove('active');
      current = idx;
      imgs[current].classList.add('active');
      if (allDots[current]) allDots[current].classList.add('active');
    }

    setInterval(() => goTo((current + 1) % imgs.length), 3500);
  });
}

// ─────────────────────────────────────────────
//  GALLERY
// ─────────────────────────────────────────────
function initGallery() {
  loadMorePhotos();
}

function loadMorePhotos() {
  const grid = document.getElementById('photo-grid');
  const btn  = document.getElementById('load-more-btn');
  if (!grid) return;

  const chunk = familyPhotos.slice(galleryOff, galleryOff + CHUNK);
  chunk.forEach((ph, localIdx) => {
    const globalIdx = galleryOff + localIdx;
    const card = document.createElement('div');
    card.className = 'photo-card animate-on-scroll';

    const img = document.createElement('img');
    img.src = ph.src;
    img.alt = ph.caption || '';
    img.loading = 'lazy';
    img.onerror = () => { img.src = PLACEHOLDERS.family(globalIdx + 1); img.onerror = null; };
    card.appendChild(img);

    if (ph.caption) {
      const cap = document.createElement('div');
      cap.className = 'photo-caption';
      cap.textContent = ph.caption;
      card.appendChild(cap);
    }

    card.addEventListener('click', () => openLightbox(globalIdx));
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), 60 * localIdx);
  });

  galleryOff += CHUNK;
  if (btn) btn.style.display = galleryOff >= familyPhotos.length ? 'none' : 'block';
}

// ─────────────────────────────────────────────
//  LIGHTBOX (family photos)
// ─────────────────────────────────────────────
let _lbPhotos = null;
let _lbPh     = null;

function openLightbox(idx) {
  _lbPhotos = familyPhotos.map(p => ({ src: p.src, caption: p.caption }));
  _lbPh     = PLACEHOLDERS.family;
  lbIndex   = idx;
  _showLightbox();
}

function openPersonLightbox(srcs, idx, phFn) {
  _lbPhotos = srcs.map(s => ({ src: s, caption: '' }));
  _lbPh     = phFn;
  lbIndex   = idx;
  _showLightbox();
}

function _showLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  _updateLightbox();
}

function closeLightbox(e) {
  if (e && !e.target.matches('#lightbox, .lb-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function _updateLightbox() {
  if (!_lbPhotos) return;
  const ph = _lbPhotos[lbIndex];
  const img = document.getElementById('lb-img');
  img.src = ph.src;
  img.onerror = () => { img.src = _lbPh(lbIndex + 1); img.onerror = null; };
  document.getElementById('lb-caption').textContent = ph.caption || '';
}

function lbPrev(e) {
  if (e) e.stopPropagation();
  if (!_lbPhotos) return;
  lbIndex = (lbIndex - 1 + _lbPhotos.length) % _lbPhotos.length;
  _updateLightbox();
}

function lbNext(e) {
  if (e) e.stopPropagation();
  if (!_lbPhotos) return;
  lbIndex = (lbIndex + 1) % _lbPhotos.length;
  _updateLightbox();
}

// ─────────────────────────────────────────────
//  SCROLL NAVIGATION
// ─────────────────────────────────────────────
function initScrollAnimations() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => io.observe(el));

  const sections = document.querySelectorAll('.section');
  const navIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...sections].indexOf(e.target);
        document.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => navIo.observe(s));
}

function initNavDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToSection(i));
  });
}

function scrollToSection(idx) {
  const s = document.querySelectorAll('.section')[idx];
  if (s) s.scrollIntoView({ behavior: 'smooth' });
}

function initKeyboardNav() {
  document.addEventListener('keydown', e => {
    const lb = document.getElementById('lightbox');
    if (lb.classList.contains('open')) {
      if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
      if (e.key === 'ArrowLeft')  lbNext({ stopPropagation: () => {} });
      if (e.key === 'ArrowRight') lbPrev({ stopPropagation: () => {} });
      return;
    }
    const sections = document.querySelectorAll('.section');
    const cur = Math.round(window.scrollY / window.innerHeight);
    if (e.key === 'ArrowDown' && cur < sections.length - 1) scrollToSection(cur + 1);
    if (e.key === 'ArrowUp'   && cur > 0) scrollToSection(cur - 1);
  });
}

// ─────────────────────────────────────────────
//  SCRATCH CARD
// ─────────────────────────────────────────────
let scratchDone = false;

function initScratchCard() {
  const card   = document.querySelector('.scratch-card');
  const canvas = document.getElementById('scratchCanvas');
  const overlay = document.getElementById('scratchOverlay');
  const finalMsg = document.getElementById('finalMessage');
  const instruction = document.getElementById('scratchInstruction');
  if (!card || !canvas || !overlay) return;

  scratchDone = false;
  card.classList.remove('scratch-revealed');
  if (finalMsg) finalMsg.classList.add('hidden');
  if (instruction) instruction.classList.remove('hidden');
  overlay.style.pointerEvents = 'auto';

  const rect = card.getBoundingClientRect();
  const w = Math.max(280, Math.round(rect.width));
  const h = Math.max(175, Math.round(rect.height));
  canvas.width = w; canvas.height = h;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#a0475c';
  ctx.fillRect(0, 0, w, h);

  const r = 24;
  const brushSize = Math.ceil(r * 2.2);
  const bc = document.createElement('canvas');
  bc.width = bc.height = brushSize;
  const bctx = bc.getContext('2d');
  const g = bctx.createRadialGradient(brushSize/2, brushSize/2, 0, brushSize/2, brushSize/2, r);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.6, 'rgba(0,0,0,0.65)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  bctx.fillStyle = g;
  bctx.fillRect(0, 0, brushSize, brushSize);

  let cleared = 0;
  const total = w * h;
  let drawing = false;

  function coords(e) {
    const r = overlay.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: cx * (canvas.width / r.width), y: cy * (canvas.height / r.height) };
  }

  function erase(cx, cy) {
    if (scratchDone) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(bc, cx - brushSize/2, cy - brushSize/2, brushSize, brushSize);
    ctx.globalCompositeOperation = 'source-over';
    cleared += Math.PI * r * r * 0.8;
    if (cleared / total >= 2.5) {
      scratchDone = true;
      overlay.style.pointerEvents = 'none';
      if (instruction) instruction.classList.add('hidden');
      card.classList.add('scratch-revealed');
      if (finalMsg) finalMsg.classList.remove('hidden');
      launchConfetti();
    }
  }

  overlay.addEventListener('mousedown',  e => { e.preventDefault(); drawing = true; erase(...Object.values(coords(e))); }, false);
  overlay.addEventListener('mousemove',  e => { e.preventDefault(); if (drawing) erase(...Object.values(coords(e))); }, false);
  overlay.addEventListener('mouseup',    e => { e.preventDefault(); drawing = false; }, false);
  overlay.addEventListener('mouseleave', e => { drawing = false; }, false);
  overlay.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; erase(...Object.values(coords(e))); }, { passive: false });
  overlay.addEventListener('touchmove',  e => { e.preventDefault(); if (drawing) erase(...Object.values(coords(e))); }, { passive: false });
  overlay.addEventListener('touchend',   e => { e.preventDefault(); drawing = false; }, { passive: false });
}

// ─────────────────────────────────────────────
//  STARS
// ─────────────────────────────────────────────
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6 + 0.3,
    alpha: Math.random(),
    speed: (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? 1 : -1)
  }));

  // Shooting stars
  setInterval(() => {
    const x0 = Math.random() * innerWidth;
    const y0 = Math.random() * innerHeight * 0.5;
    let t = 0;
    const len = Math.random() * 110 + 55;
    const ang = Math.PI / 5;
    (function shoot() {
      if (t > 1) return;
      t += 0.05;
      ctx.save();
      ctx.globalAlpha = (1 - t) * 0.65;
      ctx.strokeStyle = '#ffd0e0';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + len * t * Math.cos(ang), y0 + len * t * Math.sin(ang));
      ctx.stroke();
      ctx.restore();
      requestAnimationFrame(shoot);
    })();
  }, 4200);

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,225,235,${Math.max(0, Math.min(1, s.alpha))})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

// ─────────────────────────────────────────────
//  BALLOONS
// ─────────────────────────────────────────────
function initBalloons() {
  const container = document.getElementById('balloons-container');
  const items = ['🎈','🎀','💕','🎊','💝','🌸','💖','🎉'];

  function spawn() {
    const el = document.createElement('div');
    el.className = 'balloon';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    const dur = Math.random() * 10 + 9;
    el.style.cssText = `
      left:${Math.random()*100}vw;
      font-size:${Math.random()*26+26}px;
      animation-duration:${dur}s;
      animation-delay:${Math.random()*2}s;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }

  for (let i = 0; i < 10; i++) setTimeout(spawn, i * 400);
  setInterval(spawn, 2500);
}

// ─────────────────────────────────────────────
//  MOUSE TRAIL
// ─────────────────────────────────────────────
function initMouseTrail() {
  const glyphs = ['✨','💕','⭐','🌟','💫','🌸','🎀','💗'];
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - last < 100) return;
    last = now;
    const el = document.createElement('div');
    el.className = 'sparkle-burst';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    el.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;font-size:${Math.random()*12+15}px;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  });
}

// ─────────────────────────────────────────────
//  CONFETTI
// ─────────────────────────────────────────────
function launchConfetti() {
  const colors = ['#f72585','#ffd700','#ff69b4','#c9445a','#ffb3c1','#ff6b6b','#fce8ed','#c9984a'];
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = Math.random() * 10 + 5;
      el.style.cssText = `
        left:${Math.random()*100}vw;
        width:${size}px;height:${size}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>.5?'50%':'2px'};
        animation-duration:${Math.random()*2.5+2.5}s;
        animation-delay:${Math.random()*.5}s;
      `;
      container.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 25);
  }
}

// ─────────────────────────────────────────────
//  SCROLL TO SCRATCH (from button)
// ─────────────────────────────────────────────
function goToScratch() {
  const sections = document.querySelectorAll('.section');
  const last = sections[sections.length - 1];
  if (last) {
    last.scrollIntoView({ behavior: 'smooth' });
    setTimeout(initScratchCard, 600);
  }
}

// ─────────────────────────────────────────────
//  SCRATCH INIT ON SCROLL INTO VIEW
// ─────────────────────────────────────────────
let scratchInited = false;
const scratchObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !scratchInited) {
      scratchInited = true;
      setTimeout(initScratchCard, 300);
    }
  });
}, { threshold: 0.4 });

window.addEventListener('load', () => {
  const sec = document.getElementById('section-scratch');
  if (sec) scratchObs.observe(sec);
});
