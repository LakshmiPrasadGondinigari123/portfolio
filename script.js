(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Theme (persisted when storage is available)
  const root = document.documentElement;
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
  const roles = ['GenAI applications.', 'LLM-powered workflows.', 'computer vision systems.', 'FastAPI backends.', 'agentic AI.'];
  const el = $('#typed'); let ri = 0, ci = 0, del = false;
  (function tick() {
    const w = roles[ri];
    el.textContent = w.slice(0, ci += del ? -1 : 1);
    let d = del ? 35 : 75;
    if (!del && ci === w.length) { del = true; d = 1500; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; d = 350; }
    setTimeout(tick, d);
  })();

  // Reveal, skill bars, counters
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
    $$('[data-count]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach(n => io.observe(n));

  // Scroll progress, active link, back-to-top
  const links = $$('#menu a'), secs = links.map(a => $(a.getAttribute('href')));
  addEventListener('scroll', () => {
    const h = document.documentElement, y = h.scrollTop;
    $('#progress').style.width = (y / (h.scrollHeight - h.clientHeight) * 100) + '%';
    $('#top').classList.toggle('show', y > 600);
    let cur = -1; secs.forEach((s, i) => { if (s && s.offsetTop - 140 <= y) cur = i; });
    links.forEach((a, i) => a.classList.toggle('act', i === cur));
  }, { passive: true });
  $('#top').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  // Project filter
  $$('#filters button').forEach(b => b.onclick = () => {
    $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && !p.dataset.t.split(' ').includes(b.dataset.f)));
  });

  // Card tilt
  if (matchMedia('(hover:hover)').matches) $$('.tilt').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => c.style.transform = '');
  });

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

// ---- v2: certificate filter, lightbox, cursor spotlight ----
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $$('#cfilters button').forEach(b => b.onclick = () => {
    $$('#cfilters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.cg').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && !c.dataset.c.split(' ').includes(b.dataset.f)));
  });
  const lb = $('#lb'), li = $('#lbi'), lc = $('#lbc');
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  $$('button.cimg').forEach(b => b.onclick = () => {
    li.src = b.dataset.src; li.alt = b.dataset.cap; lc.textContent = b.dataset.cap;
    lb.hidden = false; document.body.style.overflow = 'hidden';
  });
  $('#lbx').onclick = close;
  lb.onclick = e => { if (e.target === lb) close(); };
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  if (matchMedia('(hover:hover)').matches) {
    const s = document.createElement('div'); s.className = 'spot'; document.body.appendChild(s);
    addEventListener('mousemove', e => { s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; }, { passive: true });
  }
})();

// ---- reliable email: if no mail app opens, copy the address and offer Gmail ----
(() => {
  const TO = 'gondinigarilakshmiprasad996@gmail.com';
  let box;
  const toast = (html) => {
    if (!box) { box = document.createElement('div'); box.className = 'mail-toast'; box.setAttribute('role', 'status'); document.body.appendChild(box); }
    box.innerHTML = html; box.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => box.classList.remove('show'), 9000);
  };
  const copy = (text) => {
    try { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => true, () => false); } catch (e) {}
    return Promise.resolve(false);
  };
  const gmail = (subject, body) => 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(TO) +
    (subject ? '&su=' + encodeURIComponent(subject) : '') + (body ? '&body=' + encodeURIComponent(body) : '');
  const fallback = (subject, body) => {
    // If a mail app took over, the page loses focus / becomes hidden. If not, offer alternatives.
    setTimeout(async () => {
      if (document.hidden || !document.hasFocus()) return;
      const ok = await copy(TO);
      toast('<b>' + (ok ? 'Email address copied ✓' : 'No mail app opened') + '</b><span>' + TO + '</span>' +
        '<a href="' + gmail(subject, body) + '" target="_blank" rel="noopener">Open in Gmail ↗</a>');
    }, 900);
  };
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!a) return;
    const q = new URLSearchParams((a.getAttribute('href').split('?')[1] || ''));
    fallback(q.get('subject') || '', q.get('body') || '');
  });
  const form = document.getElementById('form');
  if (form) form.addEventListener('submit', () => {
    const f = new FormData(form);
    fallback('Portfolio message from ' + f.get('name'), f.get('msg') + '\n\n— ' + f.get('name') + ' (' + f.get('email') + ')');
  });
})();
