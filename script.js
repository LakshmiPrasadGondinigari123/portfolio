(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  // Theme
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
  $('#theme').onclick = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  };

  // Mobile menu
  const menu = $('#menu');
  $('#burger').onclick = () => menu.classList.toggle('open');
  $$('#menu a').forEach(a => a.onclick = () => menu.classList.remove('open'));

  // Typing effect
  const roles = [
    'evidence-backed AI governance platforms.',
    'LLM gateways that cite their sources.',
    'data-quality audits you can certify.',
    'FastAPI services and real-time pipelines.',
    'computer vision at 30+ FPS.'
  ];
  const el = $('#typed'); let ri = 0, ci = 0, del = false;
  (function tick() {
    const w = roles[ri];
    el.textContent = w.slice(0, ci += del ? -1 : 1);
    let d = del ? 28 : 55;
    if (!del && ci === w.length) { del = true; d = 1700; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 350; }
    setTimeout(tick, d);
  })();

  // Reveal, bars, counters
  const count = n => {
    const to = +n.dataset.count, dec = +(n.dataset.dec || 0), suf = n.dataset.suf || '', t0 = performance.now();
    (function f(t) {
      const p = Math.min((t - t0) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
      n.textContent = (to * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  };
  $$('.bar i').forEach(i => i.style.setProperty('--w', i.dataset.w));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('.bar', e.target).forEach(b => b.classList.add('go'));
    if (e.target.matches('[data-count]')) count(e.target);
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .12 });
  $$('.reveal').forEach(n => io.observe(n));

  // Scroll progress, active link, back-to-top
  const links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
  addEventListener('scroll', () => {
    const h = root, y = h.scrollTop;
    $('#progress').style.width = (y / (h.scrollHeight - h.clientHeight) * 100) + '%';
    $('#top').classList.toggle('show', y > 700);
    let cur = -1; secs.forEach((s, i) => { if (s && s.offsetTop - 160 <= y) cur = i; });
    links.forEach((a, i) => a.classList.toggle('act', i === cur));
  }, { passive: true });
  $('#top').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  // Case-study pipelines
  const DATA = {
    gov: [
      ['Repository intake', 'Secure clone with size and file-count limits and content hashing. Repository content is treated as untrusted data and never as instructions.'],
      ['Discovery', 'Python AST plus real Tree-sitter parsing for JavaScript and TypeScript to map files, languages, frameworks and call structure.'],
      ['AI detection', 'Signature and pattern detection for LLM providers, frameworks, vector stores, prompts, RAG pipelines, agents, tools and MCP servers.'],
      ['Scanners', 'Syft (SBOM and dependencies), Semgrep (code security), Gitleaks (secrets) and Presidio (PII/PHI), with unavailable tools reported honestly instead of faking a pass.'],
      ['Policy evaluation', 'OPA / Rego governance controls across sensitive data, secrets, code security, AI governance and supply chain, each linked to its evidence.'],
      ['Evidence graph', 'A persistent, queryable graph: 15 node types, evidence-backed edges only, 7 filtered views, BFS path explorer and upstream/downstream impact analysis.'],
      ['Documentation & export', 'Evidence pack, System Card, Model Card and Risk Register drafts via the LLM gateway, plus SARIF, CycloneDX, Jira and webhook exports.']
    ],
    dt: [
      ['Intake', 'Upload CSV, Excel, JSON, Parquet, XML, YAML or TXT. Duplicate detection by file hash, column structure, row count and filename with Cancel / Replace / Keep-both.'],
      ['Profiling', 'Enterprise profiling plus Column Intelligence: business meaning, semantics, PII detection and recommendations for every column.'],
      ['Quality review', 'Eight explained quality dimensions and business rules imported from PDF, DOCX, XLSX, CSV, TXT or JSON, with automatic rule extraction and an inline document viewer.'],
      ['QA & peer review', 'Structured quality-assurance and peer-review steps so findings are verified by people before anything is certified.'],
      ['Sampling', 'Statistical sampling workflows to audit large datasets efficiently without reading every row.'],
      ['Remediation', 'Tracked remediation of failed checks, so every fix is recorded against the finding that triggered it.'],
      ['Certification', 'Datasets are certified only after review, with a full audit trail, findings and export of certification evidence.'],
      ['Monitoring & RCA', 'Ongoing quality monitoring and root-cause analysis, rolled up into an executive dashboard whose KPIs are computed from real data, never hard-coded.']
    ]
  };
  $$('.pipe').forEach(p => {
    const k = p.dataset.pipe, t = $('#' + k + '-t'), d = $('#' + k + '-d');
    const show = i => {
      $$('.st', p).forEach(b => b.classList.toggle('on', +b.dataset.i === i));
      t.textContent = String(i + 1).padStart(2, '0') + ' · ' + DATA[k][i][0];
      d.textContent = DATA[k][i][1];
      const panel = $('.stage-panel', p); panel.style.animation = 'none'; panel.offsetWidth; panel.style.animation = '';
    };
    $$('.st', p).forEach(b => { b.onclick = () => show(+b.dataset.i); b.onmouseenter = () => { if (matchMedia('(hover:hover)').matches) show(+b.dataset.i); }; });
    show(0);
  });

  // Filters
  $$('#filters button').forEach(b => b.onclick = () => {
    $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && !p.dataset.t.split(' ').includes(b.dataset.f)));
  });
  $$('#cfilters button').forEach(b => b.onclick = () => {
    $$('#cfilters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.cg').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && !c.dataset.c.split(' ').includes(b.dataset.f)));
  });

  // Lightbox
  const lb = $('#lb'), li = $('#lbi'), lc = $('#lbc');
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  $$('button.cimg').forEach(b => b.onclick = () => {
    li.src = b.dataset.src; li.alt = b.dataset.cap; lc.textContent = b.dataset.cap;
    lb.hidden = false; document.body.style.overflow = 'hidden';
  });
  $('#lbx').onclick = close;
  lb.onclick = e => { if (e.target === lb) close(); };
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Card tilt + magnetic buttons + cursor spotlight (pointer devices only)
  if (matchMedia('(hover:hover)').matches) {
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
    $$('.magnet').forEach(m => {
      m.addEventListener('mousemove', e => {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
      });
      m.addEventListener('mouseleave', () => m.style.transform = '');
    });
    const s = document.createElement('div'); s.className = 'spot'; document.body.appendChild(s);
    addEventListener('mousemove', e => { s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; }, { passive: true });
  }

  // Contact form -> opens the visitor's mail client
  $('#form').onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get('msg')}\n\n— ${f.get('name')} (${f.get('email')})`;
    location.href = `mailto:gondinigarilakshmiprasad996@gmail.com?subject=${encodeURIComponent('Portfolio message from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
    $('#note').textContent = 'Opening your email app…';
  };
  $('#yr').textContent = new Date().getFullYear();

  // Particle network background
  const cv = $('#bg'), cx = cv.getContext('2d'); let W, H, pts = [], mx = -999, my = -999;
  const size = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(80, Math.floor(W * H / 16000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4
    }));
  };
  addEventListener('resize', size); size();
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function draw() {
    cx.clearRect(0, 0, W, H);
    const col = root.dataset.theme === 'light' ? '98,70,234' : '124,160,255';
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.fillStyle = `rgba(${col},.7)`; cx.beginPath(); cx.arc(p.x, p.y, 1.6, 0, 7); cx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) { cx.strokeStyle = `rgba(${col},${.18 * (1 - d / 120)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); }
      }
      const dm = Math.hypot(p.x - mx, p.y - my);
      if (dm < 150) { cx.strokeStyle = `rgba(${col},${.4 * (1 - dm / 150)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mx, my); cx.stroke(); }
    });
    requestAnimationFrame(draw);
  })();
})();
