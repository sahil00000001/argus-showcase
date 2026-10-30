/* ============================================================================
   ARGUS site core: shared header and footer, menu, scroll reveals, counters,
   cursor spotlight, the watchful cat, the data-flow canvas, ticker and film modal.
   Plain JavaScript, no build step. Every page works without it; it adds motion.
   ========================================================================== */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page || 'home';

  /* ------------------------------------------------------------ header */
  const NAV = [
    ['home', 'index.html', 'Home'], ['platform', 'platform.html', 'Platform'], ['detections', 'detections.html', 'Detections'],
    ['demo', 'demo.html', 'Try it'], ['compare', 'compare.html', 'Compare'], ['trust', 'trust.html', 'Trust'],
    ['deploy', 'deploy.html', 'Deploy'], ['films', 'films.html', 'Films'],
  ];
  const top = $('header.top');
  if (top) {
    top.innerHTML = '<div class="wrap top-in">' +
      '<a class="brand" href="index.html" aria-label="ARGUS home"><img src="assets/img/argus.svg" alt="" width="36" height="36"><span>ARGUS</span></a>' +
      '<button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span></button>' +
      '<nav class="nav" id="site-nav" aria-label="Pages">' + NAV.map(([id, href, label]) =>
        `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}${id === 'demo' ? '<span class="live">Live</span>' : ''}</a>`).join('') + '</nav>' +
      '<a class="btn primary small top-cta" href="deploy.html#pilot">Plan a pilot <span class="arr" aria-hidden="true">→</span></a></div>';
    const btn = $('.menu-btn', top);
    btn.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) btn.click(); });
  }

  /* ------------------------------------------------------------ footer */
  const foot = $('footer.foot');
  if (foot) {
    foot.innerHTML = '<div class="wrap"><div class="foot-grid">' +
      '<div><a class="brand" href="index.html"><img src="assets/img/argus.svg" alt="" width="30" height="30"><span>ARGUS</span></a>' +
      '<p>Self-hosted data-loss prevention for Windows laptops. Built on Wazuh, Microsoft Sysmon and Microsoft Presidio. Runs entirely on your own infrastructure.</p></div>' +
      '<div><h4>Product</h4><ul><li><a href="platform.html">Platform</a></li><li><a href="detections.html">Ten detections</a></li><li><a href="demo.html">Try the recognisers</a></li><li><a href="compare.html">Compare</a></li></ul></div>' +
      '<div><h4>Trust</h4><ul><li><a href="trust.html#privacy">Privacy profiles</a></li><li><a href="trust.html#tamper">Tamper protection</a></li><li><a href="trust.html#signed">Signed policy</a></li></ul></div>' +
      '<div><h4>Get started</h4><ul><li><a href="deploy.html">Deploy</a></li><li><a href="deploy.html#pilot">Plan a pilot</a></li><li><a href="films.html">Films</a></li></ul></div>' +
      '</div><div class="foot-base"><span>ARGUS 0.6.0 · Agent dependencies are permissively licensed; Wazuh runs as a separate program.</span><span>Sample data on this site is synthetic.</span></div></div>';
  }

  /* ambience */
  if (!$('.ambient')) document.body.insertAdjacentHTML('afterbegin', '<div class="ambient" aria-hidden="true"><div class="orb a"></div><div class="orb b"></div></div>');

  /* ------------------------------------------------------------ reveal + counters */
  const counted = new WeakSet();
  function countUp(el) {
    if (counted.has(el)) return; counted.add(el);
    const target = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    const pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * e).toFixed(dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(countUp);
      if (en.target.matches('[data-count]')) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }) : null;
  function watchReveal(root = document) {
    $$('[data-reveal], [data-count]', root).forEach((el) => { if (io) io.observe(el); else { el.classList.add('in'); if (el.dataset.count) countUp(el); } });
  }
  window.ARGUS_SITE = { watchReveal, reduce, $, $$ };

  /* ------------------------------------------------------------ cursor spotlight on cards */
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ------------------------------------------------------------ copy buttons */
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('.copy');
    if (!b) return;
    const text = b.dataset.copy || (b.previousElementSibling && b.previousElementSibling.textContent) || '';
    try { await navigator.clipboard.writeText(text); b.textContent = 'Copied'; } catch { b.textContent = 'Select and copy'; }
    setTimeout(() => { b.textContent = 'Copy'; }, 1600);
  });

  /* ------------------------------------------------------------ the watchful cat */
  function catSVG() {
    const almond = (cx) => `M${cx - 28},136 Q${cx},104 ${cx + 28},136 Q${cx},166 ${cx - 28},136 Z`;
    const eye = (cx, s) => `<g class="lid" style="transform-box:fill-box;transform-origin:center;transition:transform .12s">` +
      `<path d="${almond(cx)}" fill="url(#hci)"/><g clip-path="url(#hc${s})"><g class="pupil"><ellipse cx="${cx}" cy="136" rx="6.5" ry="17" fill="#0E1424"/>` +
      `<circle cx="${cx + 7}" cy="128" r="4" fill="#fff" opacity=".9"/></g></g><path d="${almond(cx)}" fill="none" stroke="#0E1424" stroke-width="3"/></g>`;
    return `<svg viewBox="0 0 256 256" role="img" aria-label="The ARGUS cat, watching"><defs>` +
      `<radialGradient id="hci" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#FFD27A"/><stop offset=".65" stop-color="#F5B940"/><stop offset="1" stop-color="#C98A1B"/></radialGradient>` +
      `<clipPath id="hcl"><path d="${almond(96)}"/></clipPath><clipPath id="hcr"><path d="${almond(160)}"/></clipPath></defs>` +
      '<path d="M50,150 C50,104 62,82 74,74 L66,34 L108,62 C120,59 136,59 148,62 L190,34 L182,74 C194,82 206,104 206,150 C206,196 170,214 128,214 C86,214 50,196 50,150 Z" fill="#1F2A47" stroke="#F5B940" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M77,66 L73,46 L95,61 Z M179,66 L183,46 L161,61 Z" fill="#F5B940" opacity=".45"/>' + eye(96, 'l') + eye(160, 'r') +
      '<path d="M121,166 L135,166 L128,174 Z" fill="#F2A08A"/><path d="M128,174 Q122,182 115,179 M128,174 Q134,182 141,179" stroke="#F5B940" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M104,170 L40,160 M104,178 L42,186 M152,170 L216,160 M152,178 L214,186" stroke="#CFD8EA" stroke-width="2.5" opacity=".55" stroke-linecap="round"/></svg>';
  }
  $$('[data-cat]').forEach((host) => {
    host.innerHTML = catSVG();
    const pupils = $$('.pupil', host), lids = $$('.lid', host);
    let tx = 0, ty = 0, x = 0, y = 0, last = 0;
    const look = (cx, cy) => {
      const r = host.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height * 0.53);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260);
      tx = (dx / d) * k; ty = (dy / d) * k; last = performance.now();
    };
    addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
    addEventListener('pointerdown', (e) => look(e.clientX, e.clientY), { passive: true });
    const blink = () => { lids.forEach((l) => { l.style.transform = 'scaleY(.08)'; }); setTimeout(() => lids.forEach((l) => { l.style.transform = ''; }), 140); };
    host.addEventListener('click', blink);
    if (reduce) return;
    (function loop(t) {
      if (t - last > 2200) {          // idle: glance around on its own
        const u = Math.floor(t / 1300);
        const h = (k) => { const s = Math.sin(k * 12.9898) * 43758.5453; return s - Math.floor(s); };
        tx = h(u) * 2 - 1; ty = (h(u + 50) * 2 - 1) * 0.6;
      }
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      pupils.forEach((p) => p.setAttribute('transform', `translate(${(x * 13).toFixed(2)},${(y * 7).toFixed(2)})`));
      requestAnimationFrame(loop);
    })(0);
    (function blinks() { setTimeout(() => { blink(); blinks(); }, 2600 + Math.random() * 3200); })();
  });

  /* ------------------------------------------------------------ data flowing past the cat */
  $$('canvas[data-flow]').forEach((cv) => {
    const ctx = cv.getContext('2d');
    const TOK = [['•••• 1111', 1], ['IN_PAN', 1], ['AADHAAR', 1], ['Password=…', 1], ['AKIA…', 1], ['card × 3', 1],
      ['Q3 deck', 0], ['lunch at 1?', 0], ['notes.txt', 0], ['{ "ok": 1 }', 0], ['hello', 0], ['report.pdf', 0], ['meeting 2pm', 0]];
    let W = 0, H = 0, dpr = 1, parts = [], running = true, seed = 7, raf = 0;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const size = () => { const r = cv.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const spawn = (p = {}) => {
      const a = rnd() * Math.PI * 2, R = Math.max(W, H) * 0.62, t = TOK[Math.floor(rnd() * TOK.length)];
      return Object.assign(p, { a, r: R * (0.75 + rnd() * 0.35), v: 0.35 + rnd() * 0.55, text: t[0], bad: !!t[1], hit: 0 });
    };
    size(); for (let i = 0; i < 26; i++) { const p = spawn(); p.r *= 0.4 + rnd() * 0.6; parts.push(p); }
    addEventListener('resize', size);
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running && !reduce && !raf) raf = requestAnimationFrame(draw); }).observe(cv);
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H * 0.53, scan = Math.min(W, H) * 0.29;
      ctx.font = '600 11px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (const p of parts) {
        if (!reduce) p.r -= p.v;
        const x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r * 0.86;
        if (p.r < scan && !p.hit) p.hit = 1;
        if (p.hit) p.hit += 0.03;
        const fade = Math.min(1, p.r / (scan * 0.55));
        let col, alpha = Math.min(1, (Math.max(W, H) * 0.7 - p.r) / 80) * fade;
        if (p.hit && p.bad) { col = '255,107,107'; ctx.fillStyle = `rgba(255,107,107,${0.16 * alpha})`; const tw = ctx.measureText(p.text).width + 14; ctx.fillRect(x - tw / 2, y - 10, tw, 20); }
        else if (p.hit) col = '45,212,191';
        else col = p.bad ? '245,185,64' : '163,180,200';
        ctx.fillStyle = `rgba(${col},${Math.max(0, alpha) * (p.hit ? 1 : 0.75)})`;
        ctx.fillText(p.hit && p.bad ? '⚑ ' + p.text : p.text, x, y);
        if (p.r < scan * 0.45) spawn(p);
      }
      raf = running && !reduce ? requestAnimationFrame(draw) : 0;
    }
    draw();
  });

  /* ------------------------------------------------------------ ticker */
  $$('[data-ticker]').forEach((host) => {
    const items = (window.ARGUS_DATA && ARGUS_DATA.ticker) || [];
    const html = items.map(([l, n, t, x]) => `<span class="tick"><span class="lvl l${l}">${l}</span>${n} <b>${t}</b> · ${x}</span>`).join('');
    host.innerHTML = '<span class="ticker-lab">Sample feed</span><div class="ticker-track">' + html + html + '</div>';
  });

  /* ------------------------------------------------------------ film modal */
  $$('[data-film]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    let m = $('#film-modal');
    if (!m) {
      document.body.insertAdjacentHTML('beforeend', '<div class="modal" id="film-modal" hidden role="dialog" aria-modal="true" aria-label="Film"><button class="modal-close" type="button" aria-label="Close">×</button><div class="modal-in"><video controls playsinline></video></div></div>');
      m = $('#film-modal');
      const close = () => { $('video', m).pause(); m.hidden = true; };
      $('.modal-close', m).addEventListener('click', close);
      m.addEventListener('click', (ev) => { if (ev.target === m) close(); });
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !m.hidden) close(); });
    }
    const v = $('video', m);
    v.src = a.dataset.film; v.poster = a.dataset.poster || '';
    m.hidden = false; v.play().catch(() => {});
  }));

  /* ------------------------------------------------------------ gauges */
  $$('.gauge[data-v]').forEach((g) => {
    const c = $('.val', g), len = 2 * Math.PI * 64;
    c.style.strokeDasharray = len; c.style.strokeDashoffset = len;
    const go = () => { c.style.strokeDashoffset = len * (1 - parseFloat(g.dataset.v)); };
    if (io) new IntersectionObserver(([en], o) => { if (en.isIntersecting) { go(); o.disconnect(); } }).observe(g); else go();
  });

  watchReveal();
})();
