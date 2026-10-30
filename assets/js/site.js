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
  /* The cat: its eyes scan left and right on their own (or follow whatever drives them, such as the
     orbit's scan beam), look at the cursor for a moment when it moves, and blink every second. */
  const BLINK_MS = 1000;
  $$('[data-cat]').forEach((host) => {
    host.innerHTML = catSVG();
    const pupils = $$('.pupil', host), lids = $$('.lid', host);
    const st = { x: 0, y: 0, dx: null, dy: 0, px: 0, py: 0, pAt: -1e9 };
    host.drive = (x, y) => { st.dx = x; st.dy = y; };
    const look = (cx, cy) => {
      const r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height * 0.53);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 220);
      st.px = (dx / d) * k; st.py = (dy / d) * k; st.pAt = performance.now();
    };
    addEventListener('pointermove', (e) => look(e.clientX, e.clientY), { passive: true });
    const shut = (v) => lids.forEach((l) => { l.style.transform = v ? 'scaleY(.06)' : ''; });
    const blink = () => { shut(true); setTimeout(() => shut(false), 120); };
    host.addEventListener('click', blink);
    if (reduce) return;
    shut(true);                                   // eyes open as the hero arrives
    setTimeout(() => { shut(false); setInterval(blink, BLINK_MS); }, 900);
    (function loop(t) {
      let tx, ty;
      if (t - st.pAt < 1500) { tx = st.px; ty = st.py; }
      else if (st.dx !== null) { tx = st.dx; ty = st.dy; }
      else { tx = Math.sin(t / 1000 * Math.PI); ty = 0; }
      st.x += (tx - st.x) * 0.16; st.y += (ty - st.y) * 0.16;
      pupils.forEach((p) => p.setAttribute('transform', `translate(${(st.x * 13).toFixed(2)},${(st.y * 7).toFixed(2)})`));
      requestAnimationFrame(loop);
    })(0);
  });

  /* ------------------------------------------------------------ data in orbit around the cat */
  /* Three tilted rings. A scan beam sweeps out from the cat; every item it passes is judged:
     sensitive data is flagged, everything else is waved through. The cat's eyes follow the beam. */
  $$('[data-orbit]').forEach((sys) => {
    const cat = $('[data-cat]', sys), beam = $('.sweep', sys), host = $('.chips', sys), svg = $('.rings', sys);
    const nClean = $('[data-clean]', sys), nFlag = $('[data-flag]', sys);
    const TILT = -12 * Math.PI / 180, SQ = 0.40, BEAM = 90, SPEED = [0.34, 0.24, 0.17];
    const ITEMS = [
      [2, 20, 'Card numbers × 3', 1, 'blocked'], [2, 140, 'notes.txt', 0], [2, 260, 'customers.csv → USB', 1, 'flagged'],
      [1, 80, 'Aadhaar', 1, 'flagged'], [1, 200, 'Q3 deck.pptx', 0], [1, 320, 'Password=…', 1, 'flagged'],
      [0, 0, 'PAN', 1, 'flagged'], [0, 120, 'Lunch at 1?', 0], [0, 240, 'report.pdf', 0],
    ];
    const chips = ITEMS.map(([ring, deg, label, bad, verdict], i) => {
      const el = document.createElement('span');
      el.className = 'orb-chip ' + (bad ? 'bad' : 'ok');
      el.innerHTML = `<i></i><span>${label}</span><span class="flag">${bad ? '⚑ ' + verdict : '✓ clean'}</span>`;
      host.appendChild(el);
      return { el, ring, a0: deg * Math.PI / 180, bad, last: -1e9, i };
    });
    let W = 0, H = 0, R = [];
    const layout = () => {
      W = sys.clientWidth; H = sys.clientHeight;
      R = (W < 480 ? [0.22, 0.31, 0.39] : [0.28, 0.385, 0.49]).map((f) => W * f);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = R.map((rx, i) => `<ellipse class="ring r${i + 1}" cx="${W / 2}" cy="${H / 2}" rx="${rx.toFixed(1)}" ry="${(rx * SQ).toFixed(1)}" transform="rotate(${(TILT * 180 / Math.PI).toFixed(1)} ${W / 2} ${H / 2})"/>`).join('');
      const d = R[2] * 2;
      Object.assign(beam.style, { width: d + 'px', height: d + 'px', left: (W / 2 - d / 2) + 'px', top: (H / 2 - d / 2) + 'px' });
    };
    layout(); addEventListener('resize', layout);
    let clean = 0, flagged = 0, running = true, raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      const t = (now - t0) / 1000, A = reduce ? 0 : t * BEAM;
      beam.style.transform = `rotate(${TILT}rad) scaleY(${SQ}) rotate(${A.toFixed(2)}deg)`;
      const lead = ((A + 30 - 90) % 360 + 360) % 360, lr = lead * Math.PI / 180;
      if (cat && cat.drive) cat.drive(Math.cos(lr), Math.sin(lr) * 0.5);
      chips.forEach((c) => {
        const th = c.a0 + (reduce ? 0 : t * SPEED[c.ring]);
        const rx = R[c.ring], x = rx * Math.cos(th), y = rx * SQ * Math.sin(th);
        const X = x * Math.cos(TILT) - y * Math.sin(TILT), Y = x * Math.sin(TILT) + y * Math.cos(TILT);
        const depth = Math.sin(th), s = 0.8 + 0.2 * (depth + 1) / 2;
        const shown = reduce || t > 0.9 + c.i * 0.09;
        c.el.style.transform = `translate(${(W / 2 + X).toFixed(1)}px, ${(H / 2 + Y).toFixed(1)}px) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        c.el.style.zIndex = depth > 0 ? 4 : 1;
        c.el.style.opacity = shown ? (0.5 + 0.5 * (depth + 1) / 2).toFixed(2) : 0;
        if (reduce || !shown) return;
        const thDeg = ((th * 180 / Math.PI) % 360 + 360) % 360;
        if (((lead - thDeg) % 360 + 360) % 360 < 7 && now - c.last > 1200) {
          c.last = now; c.el.classList.add('hit');
          if (c.bad) nFlag.textContent = ++flagged; else nClean.textContent = ++clean;
          setTimeout(() => c.el.classList.remove('hit'), c.bad ? 1700 : 1000);
        }
      });
      raf = running && !reduce ? requestAnimationFrame(frame) : 0;
    };
    requestAnimationFrame(() => sys.classList.add('ready'));
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running && !raf && !reduce) raf = requestAnimationFrame(frame); }).observe(sys);
    raf = requestAnimationFrame(frame);
  });

  /* headline words rise one after another */
  $$('[data-words]').forEach((h) => {
    let i = 0;
    [...h.childNodes].forEach((n) => {
      if (n.nodeType === 1) { n.classList.add('w'); n.style.setProperty('--wi', i++); return; }
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((p) => {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.append(p); return; }
        const s = document.createElement('span'); s.className = 'w'; s.style.setProperty('--wi', i++); s.textContent = p; frag.append(s);
      });
      n.replaceWith(frag);
    });
  });

  /* ------------------------------------------------------------ ticker: always running, right to left */
  $$('[data-ticker]').forEach((host) => {
    const items = (window.ARGUS_DATA && ARGUS_DATA.ticker) || [];
    const one = items.map((x) => `<span class="tick"><span class="lvl l${x.l}" title="Level ${x.l}">${x.l}</span><b>${x.what}</b>` +
      `<span class="arrow" aria-hidden="true">→</span><span class="did">${x.did}</span><span class="who">${x.who} · ${x.at}</span></span>`).join('');
    host.innerHTML = '<span class="ticker-lab">Example alerts</span><div class="ticker-track"><div class="ticker-set">' + one +
      '</div><div class="ticker-set" aria-hidden="true">' + one + '</div></div>';
  });

  /* ------------------------------------------------------------ film strip (every film) */
  $$('[data-strip]').forEach((host) => {
    const F = (window.ARGUS_DATA && ARGUS_DATA.films) || [];
    host.innerHTML = F.map(([b, k, n, t]) => `<a href="films.html" data-film="${b}/videos/${k}.mp4" data-poster="${b}/posters/${k}.png" aria-label="Play ${t}">` +
      `<span class="th"><img src="${b}/posters/${k}.png" alt="" loading="lazy" width="640" height="360"></span><span class="nm"><span>${n}</span>${t}</span></a>`).join('');
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
