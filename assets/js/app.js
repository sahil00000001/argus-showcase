/* ============================================================================
   ARGUS showcase: loads film batches (batches/manifest.js -> batches/<id>/batch.js),
   then renders the chaptered product tour and the film library.
   Plain JavaScript, no build step; works from file:// and from any web server.
   ========================================================================== */
(() => {
  'use strict';

  const batches = [];
  let loading = null;            // id of the batch whose batch.js is loading
  let tourVideo = null;
  let tourBatch = null;
  const state = { topics: {} };

  /* batch.js files call this */
  window.ARGUS = {
    registerBatch(spec) {
      batches.push(Object.assign({ base: 'batches/' + (loading || spec.id) + '/' }, spec));
    },
  };

  /* ---------------------------------------------------------------- utils */
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, props = {}, kids = []) => {
    const node = Object.assign(document.createElement(tag), props);
    for (const k of [].concat(kids)) if (k != null) node.append(k);
    return node;
  };
  const clock = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const fmtDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = el('script', { src });
      s.onload = resolve;
      s.onerror = () => reject(new Error('could not load ' + src));
      document.head.append(s);
    });
  }

  /** A video that explains itself when its file is missing (useful while a new batch is being filled). */
  function video(src, poster, label) {
    const v = el('video', { src, poster, controls: true, preload: 'none', playsInline: true });
    v.setAttribute('aria-label', label);
    v.addEventListener('error', () => {
      if (v.dataset.reported) return;
      v.dataset.reported = '1';
      v.after(el('p', { className: 'missing', textContent: 'This video could not be played. Check that the file exists: ' + src }));
    }, true);
    return v;
  }

  /* ----------------------------------------------------------- the tour */
  function renderTour() {
    const host = $('[data-tour]');
    tourBatch = batches.find((b) => b.showcase);
    if (!tourBatch) return;
    const sc = tourBatch.showcase;
    tourVideo = video(tourBatch.base + sc.src, tourBatch.base + sc.poster, sc.title);
    const now = el('span', { textContent: 'Chapter 1 of ' + sc.chapters.length });
    const player = el('div', { className: 'player' }, [
      tourVideo,
      el('div', { className: 'player-cap' }, [
        el('span', {}, [el('b', { textContent: sc.title }), ' · ' + clock(sc.duration) + ' · ' + tourBatch.format]),
        now,
      ]),
    ]);
    const buttons = sc.chapters.map((c, i) => {
      const b = el('button', { type: 'button' }, [
        el('span', { className: 'cn', textContent: c.n }),
        el('span', { textContent: c.title }),
        el('span', { className: 'ct', textContent: clock(c.t) }),
      ]);
      b.addEventListener('click', () => playTourAt(c.t));
      b.setAttribute('aria-label', 'Play from ' + clock(c.t) + ': ' + c.title);
      return el('li', {}, b);
    });
    const list = el('ol', { className: 'chapters' }, buttons);
    list.setAttribute('aria-label', 'Chapters');
    host.replaceChildren(player, list);

    const mark = () => {
      const t = tourVideo.currentTime;
      let idx = 0;
      sc.chapters.forEach((c, i) => { if (t >= c.t - 0.05) idx = i; });
      buttons.forEach((li, i) => li.firstChild.classList.toggle('on', i === idx));
      now.textContent = 'Chapter ' + (idx + 1) + ' of ' + sc.chapters.length + ' · ' + sc.chapters[idx].title;
    };
    tourVideo.addEventListener('timeupdate', mark);
    tourVideo.addEventListener('seeked', mark);
    mark();
  }

  function playTourAt(t) {
    if (!tourVideo) return;
    const go = () => { tourVideo.currentTime = t; tourVideo.play().catch(() => {}); };
    if (tourVideo.readyState >= 1) go();
    else { tourVideo.preload = 'metadata'; tourVideo.addEventListener('loadedmetadata', go, { once: true }); tourVideo.load(); }
    $('#tour').scrollIntoView({ block: 'start' });
  }

  /* -------------------------------------------------------- the library */
  function renderLibrary() {
    const host = $('[data-library]');
    if (!batches.length) {
      host.replaceChildren(el('p', { className: 'tour-empty', textContent: 'No film batches found. Add one to batches/manifest.js.' }));
      return;
    }
    host.replaceChildren(...batches.map(batchBlock));   // every batch on the page, newest first
  }

  function batchBlock(b) {
    const topic = state.topics[b.id] || 'all';
    const parts = [];
    const total = b.films.reduce((s, f) => s + (f.duration || 0), 0);
    parts.push(el('div', { className: 'batch-head' }, [
      el('div', {}, [
        el('h3', { textContent: b.title }),
        el('p', { className: 'bmeta', textContent: 'Batch ' + b.id }),
        el('p', { textContent: b.summary }),
      ]),
      el('dl', {}, [
        el('dt', { textContent: 'Released' }), el('dd', { textContent: fmtDate(b.date) }),
        el('dt', { textContent: 'Films' }), el('dd', { textContent: b.films.length + ' · ' + clock(total) + ' in total' }),
        el('dt', { textContent: 'Format' }), el('dd', { textContent: b.format }),
      ]),
    ]));
    const topics = Object.entries(b.topics || {});
    if (topics.length > 1) {
      const filters = el('div', { className: 'filters', role: 'group' }, [['all', 'All films'], ...topics].map(([k, label]) => {
        const count = k === 'all' ? b.films.length : b.films.filter((f) => f.topic === k).length;
        const f = el('button', { type: 'button', textContent: label + ' (' + count + ')' });
        f.setAttribute('aria-pressed', String(topic === k));
        f.addEventListener('click', () => { state.topics[b.id] = k; block.replaceWith(batchBlock(b)); });
        return f;
      }));
      filters.setAttribute('aria-label', 'Filter ' + b.title + ' by topic');
      parts.push(filters);
    }
    const films = b.films.filter((f) => topic === 'all' || f.topic === topic);
    parts.push(el('div', { className: 'grid' }, films.map((f) => filmCard(b, f))));
    if (b.notes && b.notes.length) {
      parts.push(el('div', { className: 'notes' }, b.notes.map((n) => el('div', {}, [
        el('h4', { textContent: n.title }), el('p', { textContent: n.body }),
      ]))));
    }
    const block = el('section', { className: 'batch-block', id: 'batch-' + b.id }, parts);
    return block;
  }

  function filmCard(b, f) {
    const chapter = b === tourBatch && b.showcase ? b.showcase.chapters.find((c) => c.n === f.n) : null;
    const card = el('article', { className: 'film', id: 'film-' + f.n }, [
      video(b.base + 'videos/' + f.key + '.mp4', b.base + 'posters/' + f.key + '.png', f.title),
      el('div', { className: 'film-body' }, [
        el('div', { className: 'film-meta' }, [
          el('span', { className: 'n', textContent: f.label || 'Film ' + f.n }),
          el('span', { className: 'topic', textContent: (b.topics || {})[f.topic] || f.topic }),
          el('span', { className: 'dur', textContent: clock(f.duration) }),
        ]),
        el('h3', { textContent: f.title }),
        el('p', { className: 'hook', textContent: f.hook }),
        el('p', { className: 'for' }, ['For: ', el('b', { textContent: f.audience })]),
        el('p', { className: 'shows', textContent: f.shows }),
        chapter ? (() => {
          const btn = el('button', { type: 'button', className: 'in-tour', textContent: 'Watch it inside the full tour (' + clock(chapter.t) + ')' });
          btn.addEventListener('click', () => playTourAt(chapter.t));
          return btn;
        })() : null,
      ]),
    ]);
    return card;
  }

  /* --------------------------------------------------- page behaviours */
  // one video at a time
  document.addEventListener('play', (e) => {
    document.querySelectorAll('video').forEach((v) => { if (v !== e.target && !v.paused) v.pause(); });
  }, true);

  // copy buttons
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy');
    if (!btn) return;
    const text = btn.dataset.copy || '';
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(btn.previousElementSibling);
      const sel = window.getSelection();
      sel.removeAllRanges(); sel.addRange(range);
      btn.textContent = 'Selected';
    }
    setTimeout(() => { btn.textContent = 'Copy'; }, 1600);
  });

  // #film-NN deep links
  function openHash() {
    const m = /^#film-(\w+)$/.exec(location.hash);
    if (!m) return;
    const owner = batches.find((b) => b.films.some((f) => f.n === m[1]));
    if (owner && (state.topics[owner.id] || 'all') !== 'all') { state.topics[owner.id] = 'all'; renderLibrary(); }
    const card = document.getElementById('film-' + m[1]);
    if (card) { card.scrollIntoView({ block: 'center' }); card.classList.add('flash'); setTimeout(() => card.classList.remove('flash'), 2200); }
  }
  window.addEventListener('hashchange', openHash);

  // highlight the section being read in the header (enhancement only)
  function trackSections() {
    if (!('IntersectionObserver' in window)) return;
    const links = new Map([...document.querySelectorAll('.nav a')].map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) links.forEach((a, id) => a.classList.toggle('on', id === en.target.id)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* --------------------------------------------------------------- boot */
  async function boot() {
    for (const id of window.ARGUS_BATCHES || []) {
      loading = id;
      try { await loadScript('batches/' + id + '/batch.js'); }
      catch (err) { console.warn('[ARGUS showcase]', err.message); }
    }
    loading = null;
    batches.sort((a, b) => (a.date < b.date ? 1 : -1));   // newest first
    renderTour();
    renderLibrary();
    trackSections();
    openHash();
  }
  boot();
})();
