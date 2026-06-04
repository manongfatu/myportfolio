// main.js — Portfolio v3

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME ─── */
  const toggle = document.getElementById('theme-toggle');
  const root   = document.documentElement;
  const saved  = localStorage.getItem('theme') || 'dark';
  root.setAttribute('data-theme', saved);
  setThemeIcon(saved);

  toggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcon(next);
    window.dispatchEvent(new Event('themeChanged'));
  });

  function setThemeIcon(t) {
    if (!toggle) return;
    toggle.innerHTML = t === 'dark'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  /* ── HAMBURGER ─── */
  const burger  = document.getElementById('hamburger');
  const mobNav  = document.getElementById('mob-nav');
  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobNav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#mob-nav a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open'); mobNav.classList.remove('open');
  }));

  /* ── NAV SCROLL / ACTIVE ─── */
  const nav      = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a, #mob-nav a');
  const sects    = document.querySelectorAll('section[id], .hero');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    updateActive();
  }, { passive: true });

  function updateActive() {
    let cur = '';
    sects.forEach(s => { if (scrollY >= s.offsetTop - 130) cur = s.id || 'home'; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }

  /* ── FADE-UP ─── */
  const fuObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));

  /* ── COUNTERS ─── */
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      e.target.dataset.done = '1';
      const tgt = +e.target.dataset.target, sfx = e.target.dataset.suffix || '';
      let cur = 0, step = tgt / (1600 / 16);
      const t = setInterval(() => {
        cur = Math.min(cur + step, tgt);
        e.target.textContent = Math.floor(cur) + sfx;
        if (cur >= tgt) clearInterval(t);
      }, 16);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.cnt').forEach(c => cntObs.observe(c));

  /* ── PORTFOLIO FILTERS ─── */
  const fBtns = document.querySelectorAll('.f-btn');
  const pItems = document.querySelectorAll('.p-item');
  fBtns.forEach(btn => btn.addEventListener('click', () => {
    fBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    pItems.forEach(item => item.classList.toggle('hidden', f !== 'all' && !item.dataset.category.split(' ').includes(f)));
    buildLb();
  }));

  /* ── LIGHTBOX ─── */
  const lb       = document.getElementById('lb');
  const lbInner  = document.getElementById('lb-inner');
  const lbImg    = document.getElementById('lb-img');
  const lbCat    = document.getElementById('lb-cat');
  const lbTitle  = document.getElementById('lb-title');
  const lbCount  = document.getElementById('lb-count');
  let imgs = [], idx = 0, zoomed = false;

  function buildLb() {
    imgs = [...document.querySelectorAll('.p-item:not(.hidden)')].map(item => ({
      src: item.querySelector('img').src,
      cat: item.dataset.category?.split(' ')[0] || '',
      title: item.dataset.title || ''
    }));
  }
  buildLb();

  document.querySelectorAll('.p-item').forEach(item => {
    item.addEventListener('click', () => {
      buildLb();
      const src = item.querySelector('img').src;
      idx = imgs.findIndex(i => i.src === src);
      if (idx < 0) idx = 0;
      openLb();
    });
  });

  function openLb() {
    const d = imgs[idx]; if (!d) return;
    resetZoom();
    lbImg.src = d.src; lbImg.alt = d.title;
    if (lbCat) lbCat.textContent = d.cat;
    if (lbTitle) lbTitle.textContent = d.title;
    if (lbCount) lbCount.textContent = `${idx + 1} / ${imgs.length}`;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    resetZoom(); lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function resetZoom() { zoomed = false; lbInner?.classList.remove('zoomed'); }

  lbInner?.addEventListener('click', e => {
    if (e.target === lbInner || e.target === lbImg) { zoomed = !zoomed; lbInner.classList.toggle('zoomed', zoomed); }
  });
  document.getElementById('lb-close')?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.getElementById('lb-prev')?.addEventListener('click', () => { resetZoom(); idx = (idx - 1 + imgs.length) % imgs.length; openLb(); });
  document.getElementById('lb-next')?.addEventListener('click', () => { resetZoom(); idx = (idx + 1) % imgs.length; openLb(); });

  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { resetZoom(); idx = (idx - 1 + imgs.length) % imgs.length; openLb(); }
    if (e.key === 'ArrowRight') { resetZoom(); idx = (idx + 1) % imgs.length; openLb(); }
    if (e.key === ' ') { e.preventDefault(); zoomed = !zoomed; lbInner?.classList.toggle('zoomed', zoomed); }
  });

  let tx = 0;
  lb?.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb?.addEventListener('touchend', e => {
    const dx = tx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 48) { resetZoom(); dx > 0 ? idx = (idx+1)%imgs.length : idx = (idx-1+imgs.length)%imgs.length; openLb(); }
  }, { passive: true });

  /* ── CONTACT FORM ─── */
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const ok  = document.getElementById('form-ok');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    const data = new FormData(form);
    const fp = form.dataset.formspree;
    if (fp) {
      try {
        const r = await fetch(fp, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (r.ok) { form.reset(); if (ok) ok.style.display = 'block'; btn.textContent = 'Sent ✓'; return; }
      } catch {}
    }
    const n = data.get('name') || '', em = data.get('email') || '', s = data.get('subject') || 'Inquiry', m = data.get('message') || '';
    window.location.href = `mailto:jurrisleuwetolosa@gmail.com?subject=${encodeURIComponent(s+' from '+n)}&body=${encodeURIComponent('Name: '+n+'\nEmail: '+em+'\n\n'+m)}`;
    btn.textContent = orig; btn.disabled = false;
  });

  /* ── SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});
