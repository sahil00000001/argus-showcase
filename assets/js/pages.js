/* ============================================================================
   ARGUS site: page modules. Each runs only on its page (body[data-page]).
   ========================================================================== */
(() => {
  'use strict';
  const { $, $$, reduce, watchReveal } = window.ARGUS_SITE;
  const D = window.ARGUS_DATA || {};
  const page = document.body.dataset.page;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const jsonHTML = (txt) => esc(txt)
    .replace(/(\/\/.*)$/gm, '<span class="c">$1</span>')
    .replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="k">$1</span>$2')
    .replace(/:\s*(&quot;[^&]*?&quot;)/g, ': <span class="s">$1</span>')
    .replace(/:\s*(\d+)/g, ': <span class="n">$1</span>');

  /* ================================================================ HOME */
  if (page === 'home') {
    const why = $('[data-why]');
    if (why && D.why) {
      why.innerHTML = D.why.map((w, i) => `<article class="card" data-reveal style="--d:${i}"><b class="big ${w.cls}">${w.big}</b><p>${w.text}</p>` +
        `<span class="src">Source: <a href="${w.url}" rel="noopener" target="_blank">${w.src}</a></span></article>`).join('');
      watchReveal(why);
    }
  }

  /* ================================================================ PLATFORM */
  if (page === 'platform') {
    const svg = $('#arch');
    const wire = (id) => $('#' + id, svg);
    const routes = [
      { path: ['w1', 'w6', 'w9', 'w10', 'w11', 'w12'], gold: true, v: 2.2 },
      { path: ['w2', 'w6', 'w9', 'w10'], v: 2.6 }, { path: ['w3', 'w7', 'w9', 'w10', 'w11'], v: 2.4 },
      { path: ['w4', 'w8', 'w10', 'w11', 'w12'], v: 2.8 }, { path: ['w5'], v: 1.2, loop: true },
    ];
    const pk = routes.map((r, i) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', r.gold ? 6 : 4.5); c.setAttribute('class', 'pkt' + (r.gold ? ' gold' : ''));
      svg.appendChild(c);
      const segs = r.path.map(wire).filter(Boolean), lens = segs.map((s) => s.getTotalLength());
      return { c, segs, lens, total: lens.reduce((a, b) => a + b, 0), d: (i * 137) % 400, v: r.v };
    });
    const place = (p) => {
      let d = p.d % (p.total + 120), i = 0;
      if (d > p.total) { p.c.setAttribute('opacity', 0); return; }
      while (i < p.lens.length - 1 && d > p.lens[i]) { d -= p.lens[i]; i++; }
      const pt = p.segs[i].getPointAtLength(Math.min(d, p.lens[i]));
      p.c.setAttribute('cx', pt.x); p.c.setAttribute('cy', pt.y); p.c.setAttribute('opacity', 1);
    };
    if (reduce) pk.forEach((p) => { p.d = p.total * 0.4; place(p); });
    else (function loop() { pk.forEach((p) => { p.d += p.v; place(p); }); requestAnimationFrame(loop); })();

    // follow one event
    const STEPS = [
      { t: 'Copy', nodes: ['n-clip'], wires: ['w1'], say: 'Priya copies a card number out of a chat window. Nothing has left the laptop.',
        json: '// clipboard changed: 19 characters\n// the Argus user agent reads it once, in memory' },
      { t: 'Inspect', nodes: ['n-agent', 'n-insp'], wires: ['w5'], say: 'The local inspector checks the text on 127.0.0.1. Luhn passes, so it is a real card number. The text is discarded.',
        json: '{\n  "recognizer": "CREDIT_CARD",\n  "count": 1,\n  "engine": "presidio"\n}\n// the copied text is not kept' },
      { t: 'Write one event', nodes: ['n-agent', 'n-file'], wires: ['w6'], say: 'ARGUS writes one event to its local event file: type and count, never the text.',
        json: '{"argus":{\n  "category": "content_match",\n  "severity": "critical",\n  "policy_id": "dlp.pci.card-numbers",\n  "detail": {\n    "recognizer": "CREDIT_CARD",\n    "count": 1,\n    "where": "clipboard",\n    "engine": "presidio"\n  }\n}}' },
      { t: 'Ship', nodes: ['n-file', 'n-wagent'], wires: ['w9', 'w10'], say: 'The Wazuh agent ships the event file to your server over TLS on port 1514. No other path out exists.',
        json: '// Wazuh agent -> manager, TLS 1514/tcp\n{\n  "agent": { "name": "LAPTOP-0142" },\n  "location": "argus event file",\n  "data": { "argus": { "severity": "critical" } }\n}' },
      { t: 'Rule', nodes: ['n-mgr'], wires: ['w11'], say: 'One ARGUS rule in 110120–110129 matches. Critical maps to Wazuh level 15. One alert for one incident.',
        json: '{\n  "rule": {\n    "level": 15,\n    "groups": ["argus", "content_match"]\n  }\n}\n// supporting signals add context, not a second alert' },
      { t: 'Dashboard', nodes: ['n-idx', 'n-dash'], wires: ['w12'], say: 'The alert lands on the DLP Events dashboard, ready for an analyst, with the type and count only.',
        json: '// DLP Events dashboard\n// critical · Card numbers × 1 · clipboard · LAPTOP-0142' },
    ];
    const btns = $('[data-walk-steps]'), say = $('[data-walk-say]'), code = $('[data-walk-json]');
    let cur = 0;
    btns.innerHTML = STEPS.map((s, i) => `<button type="button" aria-pressed="${i === 0}">${i + 1} · ${s.t}</button>`).join('');
    const show = (i) => {
      cur = i;
      $$('button', btns).forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      $$('.node', svg).forEach((n) => n.classList.toggle('on', STEPS[i].nodes.includes(n.id)));
      $$('.wire', svg).forEach((w) => w.classList.toggle('on', STEPS[i].wires.includes(w.id)));
      say.textContent = STEPS[i].say;
      code.innerHTML = jsonHTML(STEPS[i].json);
    };
    $$('button', btns).forEach((b, i) => b.addEventListener('click', () => { show(i); stopAuto(); }));
    $('[data-walk-next]').addEventListener('click', () => { show((cur + 1) % STEPS.length); stopAuto(); });
    let auto = reduce ? 0 : setInterval(() => show((cur + 1) % STEPS.length), 4200);
    const stopAuto = () => { clearInterval(auto); auto = 0; };
    show(0);
  }

  /* ================================================================ DETECTIONS */
  if (page === 'detections') {
    const grid = $('[data-dgrid]'), drawer = $('[data-drawer]');
    const lvls = (l) => l.map((x) => `<span class="lvl l${x}">${x}</span>`).join(' ');
    grid.innerHTML = D.detections.map((d) => `<button class="card dcard" type="button" data-n="${d.n}" data-surface="${d.surface}" data-max="${Math.max(...d.levels)}" aria-expanded="false" aria-controls="drawer">` +
      `<span class="dn">#${d.n}</span><h3>${d.name}</h3><span class="surf">${D.surfaces[d.surface]}</span><span class="meta">${lvls(d.levels)}<span class="pill mono">${d.rules}</span></span></button>`).join('');
    const state = { surface: 'all', level: 'all' };
    const apply = () => $$('.dcard', grid).forEach((c) => {
      const ok = (state.surface === 'all' || c.dataset.surface === state.surface) && (state.level === 'all' || +c.dataset.max >= +state.level);
      c.classList.toggle('dim', !ok); c.tabIndex = ok ? 0 : -1;
    });
    const chips = (host, key, opts) => {
      host.innerHTML = `<span class="lab">${host.dataset.label}</span>` + opts.map(([v, l]) => `<button class="chip" type="button" data-v="${v}" aria-pressed="${v === 'all'}">${l}</button>`).join('');
      $$('.chip', host).forEach((b) => b.addEventListener('click', () => {
        state[key] = b.dataset.v; $$('.chip', host).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); apply();
      }));
    };
    chips($('[data-f-surface]'), 'surface', [['all', 'All'], ...Object.entries(D.surfaces).map(([k, v]) => [k, v + ` <span class="n">${D.detections.filter((d) => d.surface === k).length}</span>`])]);
    chips($('[data-f-level]'), 'level', [['all', 'Any level'], ['8', '8 and up'], ['12', '12 and up'], ['15', 'Critical (15)']]);
    const open = (n) => {
      const d = D.detections.find((x) => x.n === n);
      $$('.dcard', grid).forEach((c) => c.setAttribute('aria-expanded', String(+c.dataset.n === n)));
      drawer.hidden = false;
      drawer.innerHTML = `<div class="card"><p class="kicker">Detection #${d.n}</p><h3 style="font-size:1.6rem">${d.name}</h3><p style="margin-top:10px">${d.trigger}</p>` +
        `<ol class="story">${d.story.map((s, i) => `<li style="--i:${i}">${s}</li>`).join('')}</ol></div>` +
        `<div class="card"><dl class="kv"><dt>Level</dt><dd>${lvls(d.levels)}</dd><dt>Rules</dt><dd class="mono">${d.rules}</dd><dt>Signal from</dt><dd>${d.signal}</dd>` +
        `<dt>Recorded</dt><dd>${d.recorded}</dd><dt>Response</dt><dd>${d.response}</dd></dl>` +
        `<div class="cta-row" style="margin-top:20px"><a class="btn small" href="films.html#film-${d.film}">Watch the film <span class="arr">→</span></a>` +
        (d.n === 2 || d.n === 8 ? '<a class="btn small primary" href="demo.html">Try it live <span class="arr">→</span></a>' : '') + '</div></div>';
      drawer.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };
    grid.addEventListener('click', (e) => { const c = e.target.closest('.dcard'); if (c && !c.classList.contains('dim')) open(+c.dataset.n); });
    open(8);
    // levels chart (one series, count of detections by highest level)
    const bars = $('[data-bars]');
    const levels = [[15, 'Critical 15'], [12, 'High 12'], [8, 'Medium 8'], [5, 'Info 5'], [3, 'Info 3']];
    const counts = levels.map(([l]) => D.detections.filter((d) => Math.max(...d.levels) === l).length);
    bars.innerHTML = levels.map(([l, lab], i) => `<div class="bar"><span>${lab}</span><span><i style="background:var(--l${l})" data-w="${counts[i] / 4 * 100}"></i></span><b>${counts[i]}</b></div>`).join('');
    new IntersectionObserver(([en], o) => { if (en.isIntersecting) { $$('i', bars).forEach((b) => { b.style.width = b.dataset.w + '%'; }); o.disconnect(); } }).observe(bars);
  }

  /* ================================================================ TRY IT */
  if (page === 'demo') {
    const luhn = (s) => { let sum = 0, alt = false; for (let i = s.length - 1; i >= 0; i--) { let n = +s[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } sum += n; alt = !alt; } return sum % 10 === 0; };
    const Vd = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
    const Vp = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
    const verhoeff = (s) => { let c = 0; [...s].reverse().forEach((ch, i) => { c = Vd[c][Vp[i % 8][+ch]]; }); return c === 0; };
    // entity types and default severities as in ARGUS (Argus.Core PolicyBundle)
    const R = [
      { type: 'DB_CONNECTION_STRING', sev: 'critical', label: 'Connection string', re: /(?:Server|Data Source|Host)=[^;\n]+;[^\n]*?(?:Password|Pwd)=[^;\n]+;?|\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|sqlserver):\/\/[^\s:@]+:[^\s@]+@\S+/gi, check: 'host and password together' },
      { type: 'CREDENTIAL', sev: 'critical', label: 'Credential', re: /\bAKIA[0-9A-Z]{16}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:password|passwd|pwd|secret|api[_-]?key|token)\s*[:=]\s*\S{4,}/gi, check: 'key format' },
      { type: 'CREDIT_CARD', sev: 'critical', label: 'Card number', re: /\b(?:\d[ -]?){12,18}\d\b/g, test: (m) => { const d = m.replace(/\D/g, ''); return d.length >= 13 && d.length <= 19 && luhn(d); }, check: 'Luhn checksum' },
      { type: 'IN_AADHAAR', sev: 'critical', label: 'Aadhaar', re: /\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b/g, test: (m) => verhoeff(m.replace(/\D/g, '')), check: 'Verhoeff checksum' },
      { type: 'IN_PAN', sev: 'high', label: 'PAN', re: /\b[A-Z]{3}[PCHFATBLJG][A-Z]\d{4}[A-Z]\b/g, check: 'PAN structure' },
      { type: 'IN_IFSC', sev: 'medium', label: 'IFSC', re: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g, check: 'IFSC structure' },
      { type: 'ACCOUNT_NUMBER', sev: 'medium', label: 'Account number', re: /(?:account|a\/c|acct)\s*(?:no\.?|number|#)?\s*[:=]?\s*\d{9,18}/gi, check: 'context word + digits' },
      { type: 'EMAIL_ADDRESS', sev: 'low', label: 'Email', re: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, check: 'address format' },
      { type: 'PHONE_NUMBER', sev: 'low', label: 'Phone', re: /(?:\+91[ -]?)?\b[6-9]\d{4}[ -]?\d{5}\b/g, check: 'Indian mobile format' },
    ];
    const RANK = { critical: 4, high: 3, medium: 2, low: 1 }, LEVEL = { critical: 15, high: 12, medium: 8, low: 5 }, MARK = { critical: '', high: 'high', medium: 'med', low: 'low' };
    const scan = (text) => {
      const hits = [];
      R.forEach((r) => { r.re.lastIndex = 0; let m; while ((m = r.re.exec(text))) {
        const s = m.index, e = s + m[0].length;
        if ((!r.test || r.test(m[0])) && !hits.some((h) => s < h.e && e > h.s)) hits.push({ s, e, r });
      } });
      return hits.sort((a, b) => a.s - b.s);
    };
    const ta = $('#paste'), mirror = $('[data-mirror]'), table = $('[data-find]'), guard = $('[data-guard]'), ev = $('[data-event]');
    const st = { site: 'ai_chat', mode: 'block' };
    const SITES = { ai_chat: 'AI chat', webmail: 'Webmail', personal_cloud: 'Personal cloud', other: 'Any other site' };
    const SAY_SITE = { ai_chat: 'AI chat', webmail: 'webmail', personal_cloud: 'personal cloud' };
    const SAY = { CREDIT_CARD: 'card numbers', IN_AADHAAR: 'Aadhaar numbers', IN_PAN: 'PAN', DB_CONNECTION_STRING: 'connection strings', CREDENTIAL: 'credentials' };
    const seg = (host, key, opts) => {
      host.innerHTML = opts.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${st[key] === v}">${l}</button>`).join('');
      $$('button', host).forEach((b) => b.addEventListener('click', () => { st[key] = b.dataset.v; $$('button', host).forEach((x) => x.setAttribute('aria-pressed', String(x === b))); run(true); }));
    };
    seg($('[data-site]'), 'site', Object.entries(SITES));
    seg($('[data-mode]'), 'mode', [['detect', 'Detect'], ['warn', 'Warn'], ['block', 'Block']]);
    $('[data-samples]').innerHTML = Object.keys(D.samples).map((k) => `<button class="chip" type="button">${k}</button>`).join('');
    $$('[data-samples] .chip').forEach((b) => b.addEventListener('click', () => { ta.value = D.samples[b.textContent]; run(true); }));
    function run(pop) {
      const text = ta.value, hits = scan(text);
      // mirror with highlights
      let html = '', at = 0;
      hits.forEach((h) => { html += esc(text.slice(at, h.s)) + `<mark class="${MARK[h.r.sev]}" title="${h.r.type}">${esc(text.slice(h.s, h.e))}</mark>`; at = h.e; });
      mirror.innerHTML = (html + esc(text.slice(at))) || '<span class="faint">Your highlighted text appears here.</span>';
      // findings
      const by = {};
      hits.forEach((h) => { (by[h.r.type] = by[h.r.type] || { r: h.r, n: 0 }).n++; });
      const rows = Object.values(by).sort((a, b) => RANK[b.r.sev] - RANK[a.r.sev]);
      table.innerHTML = rows.length ? '<thead><tr><th>Type</th><th>Count</th><th>Severity</th><th>Check</th></tr></thead><tbody>' +
        rows.map((x) => `<tr><td>${x.r.type}</td><td class="mono">${x.n}</td><td><span class="lvl l${LEVEL[x.r.sev]}">${LEVEL[x.r.sev]}</span> ${x.r.sev}</td><td><span class="chk">✓</span> ${x.r.check}</td></tr>`).join('') + '</tbody>'
        : '<tbody><tr><td colspan="4" class="faint">No sensitive data found.</td></tr></tbody>';
      // decision
      const top = rows[0] ? rows[0].r.sev : null, guarded = st.site !== 'other', serious = top && RANK[top] >= 3;
      const names = rows.filter((x) => RANK[x.r.sev] >= 3).map((x) => SAY[x.r.type] || x.r.label);
      const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names.slice(-1) : names[0];
      let cls, icon, h, p, det, decision;
      if (!rows.length) { cls = 'ok'; icon = '✓'; h = 'Nothing sensitive found.'; p = 'The paste goes through. ARGUS records nothing.'; det = null; decision = 'allow'; }
      else if (!guarded) { cls = 'detect'; icon = '!'; h = 'Paste allowed. Alert raised.'; p = `No paste guard for this site class, so the paste goes through. The clipboard check (detection #2) still raises one alert with the types and counts.`; det = 2; decision = 'allow'; }
      else if (!serious) { cls = 'detect'; icon = '!'; h = 'Paste allowed. Recorded.'; p = 'Only lower-severity types were found, so the guard lets it through and records the types and counts.'; det = 8; decision = 'allow'; }
      else if (st.mode === 'block') { cls = 'block'; icon = '✕'; h = 'Paste blocked.'; p = `This looks like ${list}. Your company blocks pasting them into ${SAY_SITE[st.site]} sites. Checked on this laptop; the text itself isn't stored.`; det = 8; decision = 'block'; }
      else if (st.mode === 'warn') { cls = 'warn'; icon = '!'; h = 'Are you sure?'; p = `This looks like ${list}. The user sees why and decides. Either way, one alert records the types and counts.`; det = 8; decision = 'warn'; }
      else { cls = 'detect'; icon = '!'; h = 'Paste allowed. Alert raised.'; p = `Detect mode: the paste goes through and one alert records ${list}.`; det = 8; decision = 'allow'; }
      guard.className = 'guard ' + cls + (pop ? ' pop' : '');
      guard.innerHTML = `<h4><span class="gi" aria-hidden="true">${icon}</span>${h}</h4><p class="muted">${p}</p>` + (det ? `<p class="small">Detection #${det} · ${det === 8 ? 'rules 110340 · 110341' : 'rules 110120–110129'} · level ${LEVEL[top]}</p>` : '');
      if (pop) { guard.classList.remove('pop'); void guard.offsetWidth; guard.classList.add('pop'); }
      ev.innerHTML = rows.length ? jsonHTML(`// simplified event: types and counts, never the text\n{"argus":{\n  "category": "content_match",\n  "severity": "${top}",\n  "detection": ${det},\n  "detail": {\n    "where": "${guarded ? 'browser_paste' : 'clipboard'}",${guarded ? `\n    "site_class": "${st.site}",\n    "decision": "${decision}",` : ''}\n    "findings": [\n${rows.map((x) => `      { "recognizer": "${x.r.type}", "count": ${x.n} }`).join(',\n')}\n    ]\n  }\n}}`) : jsonHTML('// no event: nothing sensitive, nothing recorded');
    }
    let tmr; ta.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(() => run(false), 120); });
    ta.value = D.samples['Customer export']; run(false);
  }

  /* ================================================================ COMPARE */
  if (page === 'compare') {
    const table = $('.cmp');
    $$('.pt[data-col]').forEach((pt) => {
      const on = () => {
        $$('.pt').forEach((x) => x.classList.toggle('on', x === pt));
        const col = +pt.dataset.col;
        $$('tr', table).forEach((tr) => [...tr.children].forEach((c, i) => c.classList.toggle('hl', i === col && !c.classList.contains('us-col'))));
      };
      pt.addEventListener('mouseenter', on); pt.addEventListener('focus', on); pt.addEventListener('click', on);
    });
  }

  /* ================================================================ TRUST */
  if (page === 'trust') {
    const caps = $$('[data-cap]'), note = $('[data-profile-note]');
    const P = {
      default: { off: ['screens'], note: 'Minimization defaults: every optional capture is off. Screenshots stay off unless your organisation switches them on.' },
      'eu-strict': { off: ['screens', 'apps'], note: 'For staff covered by GDPR: application-usage tracking is off as well, and shorter retention is recommended.' },
      'in-dpdp': { off: ['screens'], note: 'For India\u2019s DPDP Act 2023: minimization defaults, and employees get prior notice before monitoring starts.' },
    };
    const set = (k) => {
      $$('[data-profile] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === k)));
      caps.forEach((c) => c.classList.toggle('on', !P[k].off.includes(c.dataset.cap)));
      note.textContent = P[k].note;
      $('[data-notice]').hidden = k !== 'in-dpdp';
    };
    $$('[data-profile] button').forEach((b) => b.addEventListener('click', () => set(b.dataset.v)));
    set('default');

    // tamper terminal
    const out = $('[data-term]');
    const A = {
      stop: { cmd: 'sc stop ArgusService', lines: [['e', '[SC] OpenService FAILED 5:'], ['e', 'Access is denied.'], ['a', 'ARGUS ▸ tamper attempt · rule 110910 · level 15 · sent to the SOC']] },
      kill: { cmd: 'taskkill /f /im Argus.Service.exe', lines: [['w', 'SUCCESS: The process was terminated.'], ['g', 'Windows Service Control Manager ▸ restarting ArgusService (recovery: restart)'], ['a', 'ARGUS ▸ killed and restarted · critical tamper alert · rule 110910']] },
      disable: { cmd: 'sc config ArgusService start= disabled', lines: [['e', '[SC] OpenService FAILED 5:'], ['e', 'Access is denied.'], ['g', 'Windows event log ▸ start-type change attempt recorded']] },
      policy: { cmd: 'copy unsigned-policy.json <ARGUS policy folder>', lines: [['w', '        1 file(s) copied.'], ['e', 'ARGUS ▸ policy rejected: signature does not verify'], ['g', 'ARGUS ▸ last good policy (version 1) stays in force'], ['a', 'ARGUS ▸ policy rejection raised as an alert']] },
      uninstall: { cmd: 'msiexec /x ArgusSetup.msi /quiet', lines: [['e', 'Removal refused: only the installer\u2019s managed uninstall (Intune or Group Policy) may remove ARGUS.'], ['g', 'Windows event log ▸ uninstall attempt recorded']] },
    };
    let busy = false;
    const type = async (k) => {
      if (busy) return; busy = true;
      const a = A[k], line = document.createElement('div');
      line.innerHTML = '<span class="p">PS C:\\Users\\admin&gt;</span> ';
      out.appendChild(line);
      for (const ch of a.cmd) { line.append(ch); out.scrollTop = out.scrollHeight; if (!reduce) await new Promise((r) => setTimeout(r, 22)); }
      for (const [c, t] of a.lines) { if (!reduce) await new Promise((r) => setTimeout(r, 380)); const d = document.createElement('div'); d.className = c; d.textContent = t; out.appendChild(d); out.scrollTop = out.scrollHeight; }
      out.appendChild(document.createElement('br'));
      busy = false;
    };
    $$('[data-attack]').forEach((b) => b.addEventListener('click', () => type(b.dataset.attack)));

    // signed policy, verified for real with ECDSA P-256 (WebCrypto)
    const pol = $('#policy'), seal = $('[data-seal]');
    const original = pol.value;
    const enc = (s) => new TextEncoder().encode(s.replace(/\r\n/g, '\n'));
    const hex = (b) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    (async () => {
      if (!(window.crypto && crypto.subtle)) { seal.innerHTML = '<h4>Signature check unavailable</h4><p class="muted">This browser blocks WebCrypto on this page. Open the site over https to try it.</p>'; return; }
      const keys = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
      const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, keys.privateKey, enc(original));
      const check = async () => {
        const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, keys.publicKey, sig, enc(pol.value));
        const dig = hex(await crypto.subtle.digest('SHA-256', enc(pol.value)));
        seal.className = 'seal ' + (ok ? 'good' : 'bad');
        seal.innerHTML = ok ? `<h4>✓ Signature valid</h4><p class="muted">The laptop accepts this policy.</p><span class="small">SHA-256</span><code>${dig}</code><span class="small">ECDSA P-256 signature</span><code>${hex(sig).slice(0, 64)}…</code>`
          : `<h4>✕ Rejected</h4><p class="muted">The policy changed after it was signed. The laptop keeps the last good policy and raises an alert.</p><span class="small">SHA-256 of what you edited</span><code>${dig}</code>`;
      };
      let t; pol.addEventListener('input', () => { clearTimeout(t); t = setTimeout(check, 150); });
      $('[data-restore]').addEventListener('click', () => { pol.value = original; check(); });
      check();
    })();
  }

  /* ================================================================ DEPLOY */
  if (page === 'deploy') {
    const tabs = $$('[role="tab"]');
    const pick = (t) => { tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $('#' + x.getAttribute('aria-controls')).hidden = !on; }); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; pick(n); n.focus(); } });
    });
    const host = $('#mgr'), out = $('[data-cmd]'), copyBtn = $('[data-cmd-copy]');
    const upd = () => { const v = (host.value || '').trim() || '<your server>'; const c = `ArgusSetup.exe /quiet /norestart WAZUH_MANAGER=${v}`; out.textContent = c; copyBtn.dataset.copy = c; };
    host.addEventListener('input', upd); upd();
    // pilot checklist (remembered in this browser only)
    const boxes = $$('.check input'), bar = $('[data-progress]'), lab = $('[data-progress-lab]');
    let saved = {}; try { saved = JSON.parse(localStorage.getItem('argus-pilot') || '{}'); } catch { saved = {}; }
    const paint = () => { const n = boxes.filter((b) => b.checked).length; bar.style.width = (n / boxes.length * 100) + '%'; lab.textContent = `${n} of ${boxes.length} ready`; };
    boxes.forEach((b) => { b.checked = !!saved[b.id]; b.addEventListener('change', () => { saved[b.id] = b.checked; try { localStorage.setItem('argus-pilot', JSON.stringify(saved)); } catch {} paint(); }); });
    paint();
  }
})();
