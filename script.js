/* ============================================================
   Manupati Eshwar — portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAvatar();
  initLoader();
  initPageFlow();
  initPageTransitions();
  initCursor();
  initParticles();
  initNav();
  initScrollProgress();
  initReadRail();
  initHeroName();
  initWordReveal();
  initTyped();
  renderProjects();
  initStagger();
  initReveal();
  initCounters();
  initMeters();
  initRings();
  initContribGrid();
  initTimelineProgress();
  initParallax();
  initSpotlight();
  initTilt();
  initMagnetic();
  initBrokePanels();
  initFilters();
  initTickets();
  initChecklist();
  initContactForm();
  initToTop();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});


/* ── THEME ─────────────────────────────────────────────── */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* private mode */ }

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  root.setAttribute('data-theme', saved || (prefersLight ? 'light' : 'dark'));
  syncThemeColor();

  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    syncThemeColor();
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
  });

  function syncThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', root.getAttribute('data-theme') === 'light' ? '#F6F7FB' : '#07080D');
  }
}


/* ── PROFILE PHOTO ─────────────────────────────────────── */
/* There is no server to upload to on a static site, so the photo is a file you
   drop in: put a square image at assets/avatar.jpg (or .png / .webp) and it
   appears in the nav mark, the recruiter snapshot and the reading rail.
   Nothing to edit in seven HTML files. Probed with an Image() so a missing
   file never flashes a broken icon. */
const AVATAR_CANDIDATES = ['assets/avatar.jpg', 'assets/avatar.png', 'assets/avatar.webp'];

/* Where the photo is used. Drop a selector from this list to keep the monogram
   in that spot — e.g. remove '.nav-logo-mark' to keep the lettermark in the nav. */
const AVATAR_SLOTS = '.snapshot-avatar, .rail-avatar, .nav-logo-mark';

function initAvatar() {
  const slots = document.querySelectorAll(AVATAR_SLOTS);
  if (!slots.length) return;

  const tryNext = (i) => {
    if (i >= AVATAR_CANDIDATES.length) return;      // no photo yet — monogram stays
    const src = AVATAR_CANDIDATES[i];
    const probe = new Image();
    probe.onload = () => {
      document.documentElement.style.setProperty('--avatar', `url("${src}")`);
      slots.forEach(el => el.classList.add('has-photo'));
    };
    probe.onerror = () => tryNext(i + 1);
    probe.src = src;
  };
  tryNext(0);
}


/* ── PAGE-CHANGE FLOW ──────────────────────────────────── */
/* The sweep bar is injected rather than shipped in the markup so it only ever
   appears when motion is wanted. */
function initPageFlow() {
  if (REDUCED) return;
  const bar = document.createElement('div');
  bar.className = 'page-flow';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  setTimeout(() => bar.remove(), 1400);
}


/* ── LOADER ────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // The full loader is a first-impression thing: show it once per browser
  // session, then let the page-transition curtain carry every later navigation.
  let seen = false;
  try { seen = sessionStorage.getItem('seen-loader') === '1'; } catch (e) { /* private mode */ }
  if (seen || REDUCED) { loader.remove(); return; }
  try { sessionStorage.setItem('seen-loader', '1'); } catch (e) { /* ignore */ }

  const hide = () => loader.classList.add('hidden');
  window.addEventListener('load', () => setTimeout(hide, 450));
  setTimeout(hide, 2000); // hard fallback
}


/* ── PAGE TRANSITIONS ──────────────────────────────────── */
/* Cross-document view transitions need the @view-transition at-rule, not just
   the same-document startViewTransition() that shipped earlier. CSSViewTransitionRule
   is the interface that at-rule exposes, so its presence is the honest test. */
const SUPPORTS_MPA_VIEW_TRANSITIONS =
  typeof window.CSSViewTransitionRule === 'function' &&
  CSS.supports('view-transition-name', 'a');

/* Remember which way through the nav the visitor is travelling, so the next
   document can animate in from the correct side. The incoming page reads this
   back from sessionStorage in a tiny inline script before it paints. */
const NAV_ORDER = ['index.html', 'about.html', 'experience.html', 'projects.html', 'quality.html', 'skills.html', 'contact.html'];

function initNavDirection() {
  const fileOf = (path) => (path.split('/').pop() || 'index.html').toLowerCase();
  const here = NAV_ORDER.indexOf(fileOf(location.pathname));

  document.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    let dest;
    try { dest = new URL(a.href, location.href); } catch (err) { return; }
    if (dest.origin !== location.origin) return;

    const there = NAV_ORDER.indexOf(fileOf(dest.pathname));
    let dir = '';
    if (here > -1 && there > -1 && here !== there) dir = there > here ? 'fwd' : 'back';
    try { sessionStorage.setItem('nav-dir', dir); } catch (err) { /* private mode */ }
    document.documentElement.dataset.navDir = dir;
  }, true);

  // A browser Back/Forward press is always a reversal of the stored direction.
  window.addEventListener('popstate', () => {
    try { sessionStorage.setItem('nav-dir', 'back'); } catch (err) { /* ignore */ }
  });
}


function initPageTransitions() {
  const main = document.querySelector('main');

  // Where the browser can morph between documents natively, let it: drop the
  // curtain and the entry slide so the two systems never run at once.
  if (SUPPORTS_MPA_VIEW_TRANSITIONS) {
    document.getElementById('page-fx')?.remove();
    initNavDirection();
    return;
  }

  if (main && !REDUCED) main.classList.add('page-enter');
  if (REDUCED) return;

  // The curtain ships in the markup so it is part of the first paint — the
  // entry animation is pure CSS and still clears itself with JS disabled.
  const fx = document.getElementById('page-fx');
  if (!fx) return;
  setTimeout(() => fx.classList.remove('in'), 1000);

  const isInternal = (a) => {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    try {
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return false;
      if (url.pathname === location.pathname) return false;  // same page + hash
      return /\.html?$/.test(url.pathname) || url.pathname.endsWith('/');
    } catch (e) { return false; }
  };

  document.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const a = e.target.closest('a[href]');
    if (!isInternal(a)) return;
    e.preventDefault();
    fx.classList.remove('in');
    void fx.offsetWidth;          // restart the animation cleanly
    fx.classList.add('out');
    setTimeout(() => { location.href = a.href; }, 470);
  });

  // Coming back via the browser's back/forward cache: clear the curtain.
  window.addEventListener('pageshow', (ev) => {
    if (!ev.persisted) return;
    fx.classList.remove('out', 'in');
    if (main) { main.classList.remove('page-enter'); void main.offsetWidth; main.classList.add('page-enter'); }
  });
}


/* ── CUSTOM CURSOR ─────────────────────────────────────── */
function initCursor() {
  if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
  }, { passive: true });

  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(follow);
  })();

  const interactive = 'a, button, .card, input, textarea, .filter, .tag-row span';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactive)) ring.classList.add('active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactive)) ring.classList.remove('active');
  });
}


/* ── PARTICLE FIELD ────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, particles = [], raf = null;

  function size() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    const count = w < 768 ? 22 : 46;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.35 + 0.12
    }));
  }

  function frame() {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const rgb = light ? '79, 70, 229' : '129, 140, 248';
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${p.a})`;
      ctx.fill();
    }

    const max = 128;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.hypot(dx, dy);
        if (d < max) {
          ctx.strokeStyle = `rgba(${rgb}, ${0.11 * (1 - d / max)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  size(); seed(); frame();
  window.addEventListener('resize', debounce(() => { size(); seed(); }, 200));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
    else if (!raf) frame();
  });
}


/* ── NAV ───────────────────────────────────────────────── */
function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!navbar || !toggle || !links) return;
  const anchors = [...links.querySelectorAll('a')];

  const closeMenu = () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  anchors.forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !e.target.closest('.navbar')) closeMenu();
  });

  onScroll(() => navbar.classList.toggle('scrolled', window.scrollY > 24));

  // Mark the link for the page we are on (multi-page nav).
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a, .footer-col a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (href === file || (file === 'index.html' && href === './')) a.classList.add('current');
  });

  // In-page scroll spy — only meaningful for hash links (the home page).
  const hashAnchors = anchors.filter(a => (a.getAttribute('href') || '').startsWith('#'));
  if (!hashAnchors.length) return;
  const sections = [...document.querySelectorAll('section[id]')];
  onScroll(() => {
    const pos = window.scrollY + window.innerHeight * 0.3;
    let current = sections.length ? sections[0].id : '';
    for (const s of sections) if (s.offsetTop <= pos) current = s.id;
    hashAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  });
}


/* ── SCROLL PROGRESS ───────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  onScroll(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  });
}


/* ── READING RAIL ──────────────────────────────────────── */
/* A minimap of the page down the left margin. The monogram rides it as you
   scroll, leaning and squashing with scroll direction and speed, and the
   dots jump to each section. Built from the DOM so every page gets its own. */
function initReadRail() {
  const rail = document.getElementById('read-rail');
  if (!rail) return;

  const main = document.querySelector('main');
  if (!main) { rail.remove(); return; }

  const sections = [...main.querySelectorAll('section')].filter(s => s.offsetHeight > 120);
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  // On a page you can barely scroll, a progress minimap is just clutter.
  if (sections.length < 2 || maxScroll() < 600) { rail.remove(); return; }

  const fill = rail.querySelector('.rail-fill');
  const avatar = rail.querySelector('.rail-avatar');
  const track = rail.querySelector('.rail-track');

  const labelFor = (s, i) => {
    if (s.dataset.rail) return s.dataset.rail;
    if (s.classList.contains('page-hero') || s.classList.contains('hero')) return 'Top';
    const kicker = s.querySelector('.section-kicker');
    if (kicker) {
      const t = kicker.textContent.replace(/^\s*\d+\s*[—–-]\s*/, '').trim();
      if (t) return t.length > 24 ? t.slice(0, 23) + '…' : t;
    }
    const h = s.querySelector('h2, h1');
    if (h) {
      const t = h.textContent.trim();
      return t.length > 24 ? t.slice(0, 23) + '…' : t;
    }
    return 'Section ' + (i + 1);
  };

  // Build one dot per section.
  const dots = sections.map((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rail-dot';
    const label = labelFor(s, i);
    b.setAttribute('aria-label', 'Jump to ' + label);
    b.innerHTML = '<i></i>';
    const tag = document.createElement('span');
    tag.textContent = label;
    b.appendChild(tag);
    b.addEventListener('click', () => {
      const y = i === 0 ? 0 : s.offsetTop - 80;
      window.scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
    });
    track.parentNode.appendChild(b);
    return b;
  });

  let railH = 0;
  const measure = () => { railH = rail.clientHeight; place(); };

  // Dot positions are in scroll-progress space, the same space the avatar
  // travels in, so a dot sits exactly where the avatar will be when that
  // section becomes active.
  function place() {
    const max = Math.max(1, maxScroll());
    sections.forEach((s, i) => {
      const target = i === 0 ? 0 : Math.max(0, s.offsetTop - 80);
      const p = Math.max(0, Math.min(target / max, 1));
      dots[i].style.top = (p * railH) + 'px';
    });
  }

  let lastY = window.scrollY, idle = null;

  onScroll(() => {
    const y = window.scrollY;
    const max = Math.max(1, maxScroll());
    const p = Math.max(0, Math.min(y / max, 1));

    rail.classList.toggle('show', y > 260);
    fill.style.height = (p * railH) + 'px';

    const vel = y - lastY;
    lastY = y;

    const rest = 'translate3d(0, ' + (p * railH).toFixed(1) + 'px, 0)';
    let transform = rest;
    if (!REDUCED && Math.abs(vel) > 0.5) {
      // Lean into the direction of travel and stretch a little with speed.
      const tilt = Math.max(-10, Math.min(vel * 0.42, 10));
      const stretch = Math.min(Math.abs(vel) * 0.004, 0.12);
      transform += ' rotate(' + tilt.toFixed(1) + 'deg) scale(' + (1 - stretch * 0.5).toFixed(3) + ', ' + (1 + stretch).toFixed(3) + ')';
      rail.classList.add('moving');
      clearTimeout(idle);
      // Scrolling stops = no more events, so the lean has to be undone here or
      // the avatar stays frozen mid-tilt.
      idle = setTimeout(() => {
        rail.classList.remove('moving');
        avatar.style.transform = rest;
      }, 130);
    }
    avatar.style.transform = transform;

    // Active section: the last one whose top has passed the reading line.
    const line = y + window.innerHeight * 0.3;
    let active = 0;
    sections.forEach((s, i) => { if (s.offsetTop <= line) active = i; });
    dots.forEach((d, i) => d.classList.toggle('active', i === active));
  });

  measure();
  window.addEventListener('resize', debounce(measure, 160));
  window.addEventListener('load', measure);
}


/* ── HERO NAME: per-character entrance ─────────────────── */
function initHeroName() {
  const el = document.querySelector('[data-anim="chars"]');
  if (!el) return;
  const text = el.textContent.trim();
  if (REDUCED) return;

  el.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? ' ' : ch;
    span.style.animationDelay = (i * 34) + 'ms';
    el.appendChild(span);
  });
  requestAnimationFrame(() => el.classList.add('revealed'));

  // Safety net: if the animation never runs (odd browser, throttled tab),
  // the name must still be readable.
  setTimeout(() => {
    el.querySelectorAll('.char').forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
  }, 1800);
}


/* ── WORD-BY-WORD MASK REVEAL ──────────────────────────── */
/* Wraps every word in an overflow-hidden line so it can slide up from
   behind its own baseline. Gradient spans are kept whole — splitting them
   would break background-clip: text. */
function initWordReveal() {
  const targets = document.querySelectorAll('[data-anim="words"]');
  if (!targets.length) return;

  if (REDUCED) { targets.forEach(el => el.classList.add('visible')); return; }

  const makeLine = () => {
    const line = document.createElement('span');
    line.className = 'w-line';
    const word = document.createElement('span');
    word.className = 'w-word';
    line.appendChild(word);
    return line;
  };

  // For a brand-new node: build the wrapper around it and hand it back.
  const wrap = (node) => {
    const line = makeLine();
    line.firstChild.appendChild(node);
    return line;
  };

  // For a node already in the tree: swap the wrapper in first, THEN move the
  // node inside it — appending first would detach it and break replaceChild.
  const wrapInPlace = (parent, child) => {
    const line = makeLine();
    parent.replaceChild(line, child);
    line.firstChild.appendChild(child);
  };

  const walk = (node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          frag.appendChild(wrap(document.createTextNode(part)));
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (child.classList.contains('grad') || child.classList.contains('no-split')) {
          wrapInPlace(node, child);
        } else {
          walk(child);
        }
      }
    });
  };

  targets.forEach(el => {
    walk(el);
    el.querySelectorAll('.w-word').forEach((w, i) => {
      w.style.transitionDelay = (i * 48) + 'ms';
    });
  });
}


/* ── STAGGER CONTAINERS ────────────────────────────────── */
/* <div data-stagger="70"> hands each animated child an increasing delay,
   so grids cascade instead of landing all at once. */
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach(box => {
    const step = parseInt(box.dataset.stagger, 10) || 70;
    const base = parseInt(box.dataset.staggerStart || '0', 10);
    [...box.children].forEach((child, i) => {
      if (!child.hasAttribute('data-anim')) return;
      if (child.dataset.delay) return;          // explicit delay wins
      child.dataset.delay = base + i * step;
    });
  });
}


/* ── SCROLL PARALLAX ───────────────────────────────────── */
/* data-parallax="0.12" → drifts at 12% of scroll distance from centre. */
function initParallax() {
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!els.length || REDUCED) return;

  onScroll(() => {
    const mid = window.innerHeight / 2;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const depth = parseFloat(el.dataset.parallax) || 0.1;
      const offset = (r.top + r.height / 2 - mid) * depth;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  });
}


/* ── PROFICIENCY METERS ────────────────────────────────── */
function initMeters() {
  const fills = document.querySelectorAll('.meter-fill[data-pct]');
  if (!fills.length) return;

  const run = (el) => { el.style.width = Math.max(0, Math.min(100, +el.dataset.pct)) + '%'; };
  if (REDUCED || !('IntersectionObserver' in window)) { fills.forEach(run); return; }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => run(e.target), i * 90);
      io.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  fills.forEach(el => io.observe(el));
}


/* ── TYPED ROLES ───────────────────────────────────────── */
function initTyped() {
  const el = document.getElementById('typed');
  if (!el) return;

  const roles = [
    'full stack web applications.',
    'REST APIs with Node & Express.',
    'React interfaces that feel fast.',
    'test cases that catch real bugs.',
    'TypeScript codebases that scale.',
    'solutions to 272+ DSA problems.'
  ];

  if (REDUCED) { el.textContent = roles[0]; return; }

  let i = 0, c = 0, deleting = false;
  (function tick() {
    const word = roles[i];
    el.textContent = word.slice(0, deleting ? --c : ++c);

    let delay = deleting ? 28 : 62;
    if (!deleting && c === word.length) { delay = 1900; deleting = true; }
    else if (deleting && c === 0) { deleting = false; i = (i + 1) % roles.length; delay = 420; }
    setTimeout(tick, delay);
  })();
}


/* ── PROJECT DATA + RENDER ─────────────────────────────── */
const PROJECTS = [
  {
    title: 'Mini PayTM',
    year: '2026',
    cats: ['fullstack'],
    desc: 'A digital wallet where users sign up, hold a balance and transfer money to other users.',
    points: [
      'JWT-based authentication with hashed credentials',
      'Atomic balance transfers with transaction history',
      'Search and send money to any registered user'
    ],
    tech: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
    broke: {
      found: 'Sent money to myself, then pressed transfer twice on a slow connection.',
      failed: 'The balance check and the debit were two separate steps, so a fast second request could read a stale balance and overdraw the account.',
      fixed: 'Moved the balance check and both updates into a single atomic transaction, and disabled the button until the response landed.'
    },
    repo: 'https://github.com/Eshwarmanupati/Mini-payTm',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="4" width="22" height="16" rx="3"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
  },
  {
    title: 'Live Attendance Platform',
    year: '2026',
    cats: ['fullstack', 'realtime'],
    desc: 'Real-time attendance management for classrooms, replacing paper registers with a live dashboard.',
    points: [
      'Live session tracking with instant status updates',
      'Admin dashboard for students, classes and reports',
      'Automated attendance summaries per student'
    ],
    tech: ['JavaScript', 'Node.js', 'Real-time', 'MongoDB'],
    broke: {
      found: 'Opened the same session in two tabs and marked attendance in both.',
      failed: 'The second tab wrote a duplicate record for the same student and session, inflating the report.',
      fixed: 'Made the student-plus-session pair unique at the database level, so the duplicate is rejected instead of trusted.'
    },
    repo: 'https://github.com/Eshwarmanupati/Live-Attendence-Platform',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>'
  },
  {
    title: 'Credex',
    year: '2026',
    cats: ['typescript'],
    desc: 'Credit and finance management application built on a typed, modular architecture.',
    points: [
      'Credit scoring and repayment logic in TypeScript',
      'Typed domain models shared across modules',
      'Structured for adding new financial products'
    ],
    tech: ['TypeScript', 'Node.js', 'Finance'],
    broke: {
      found: 'Passed a zero and then a negative number into the repayment calculation.',
      failed: 'The schedule came back with NaN instalments and rendered as blank rows instead of an error.',
      fixed: 'Validated the range at the API boundary and returned a typed error the UI renders as a real message.'
    },
    repo: 'https://github.com/Eshwarmanupati/Credex',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
  },
  {
    title: 'SESD LMS',
    year: '2025',
    cats: ['fullstack'],
    desc: 'Learning management system with separate student and instructor experiences.',
    points: [
      'Role-based access for students and instructors',
      'Course creation, enrolment and content delivery',
      'Progress tracking on a student dashboard'
    ],
    tech: ['JavaScript', 'Node.js', 'MongoDB'],
    broke: {
      found: 'Pasted an instructor-only course URL while logged in as a student.',
      failed: 'The page was hidden from the student navigation but the route itself still returned the data.',
      fixed: 'Moved the role check onto the server route, so the UI is no longer the only thing enforcing permissions.'
    },
    repo: 'https://github.com/Eshwarmanupati/sesd-lms',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  },
  {
    title: 'Chat Application',
    year: '2025',
    cats: ['fullstack', 'realtime'],
    desc: 'Real-time messaging app with instant delivery between connected users.',
    points: [
      'Socket-based messaging with live delivery',
      'Persisted conversation history',
      'Responsive chat UI for mobile and desktop'
    ],
    tech: ['JavaScript', 'Node.js', 'WebSockets'],
    broke: {
      found: 'Pulled the network cable mid-conversation and kept typing.',
      failed: 'Messages appeared as sent, but were never delivered — the UI was optimistic with no reconciliation.',
      fixed: 'Added a pending state and a delivery confirmation, so an unsent message is visibly unsent.'
    },
    repo: 'https://github.com/Eshwarmanupati/chat-app',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'
  },
  {
    title: 'Prowider Mini',
    year: '2026',
    cats: ['typescript'],
    desc: 'Service platform matching providers with the consumers who need them.',
    points: [
      'Provider listings with service categories',
      'Consumer-side discovery and request flow',
      'Typed API layer for predictable contracts'
    ],
    tech: ['TypeScript', 'Node.js', 'Platform'],
    broke: {
      found: 'Searched for a provider with an apostrophe and an emoji in the name.',
      failed: 'The query broke the listing and returned an empty result rather than a match.',
      fixed: 'Escaped and normalised the search input, and gave the empty result its own explanatory state.'
    },
    repo: 'https://github.com/Eshwarmanupati?tab=repositories',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'
  }
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((p, i) => `
    <article class="card project tilt" data-cats="${p.cats.join(' ')}" data-anim="fade-up" data-delay="${i * 60}">
      <div class="project-top">
        <span class="project-icon">${p.icon}</span>
        <span class="project-year">${p.year}</span>
      </div>
      <h3>${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <ul class="project-points">${p.points.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="tag-row">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
      ${p.broke ? `
      <div class="broke">
        <button class="broke-toggle" type="button" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l7-7 3.4 3.4-7 7a1 1 0 0 1-1.4 0z"/><path d="M3 21l6-6M2 12l4 4"/></svg>
          How I broke it
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="broke-panel"><div class="broke-inner">
          <div class="broke-rows">
            <div class="broke-row"><b>What I tried</b><span>${p.broke.found}</span></div>
            <div class="broke-row"><b>What failed</b><span>${p.broke.failed}</span></div>
            <div class="broke-row fix"><b>The fix</b><span>${p.broke.fixed}</span></div>
          </div>
        </div></div>
      </div>` : ''}

      <div class="project-foot">
        <a class="project-link" href="${p.repo}" target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          Source code
        </a>
      </div>
    </article>
  `).join('');
}


/* ── PROJECT FILTERS ───────────────────────────────────── */
function initBrokePanels() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.broke-toggle');
    if (!btn) return;
    const box = btn.closest('.broke');
    const open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
}


function initFilters() {
  const bar = document.getElementById('filters');
  const grid = document.getElementById('projects-grid');
  if (!bar || !grid) return;

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;

    bar.querySelectorAll('.filter').forEach(b => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });

    const want = btn.dataset.filter;
    grid.querySelectorAll('.project').forEach(card => {
      const show = want === 'all' || card.dataset.cats.split(' ').includes(want);
      card.classList.toggle('hiding', !show);
      card.style.display = show ? '' : 'none';
    });
  });
}


/* ── SCROLL REVEAL ─────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('[data-anim]:not(.visible)');
  if (!items.length) return;

  if (REDUCED || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.tl-item').forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => {
        el.classList.add('visible');
        const tl = el.closest('.tl-item');
        if (tl) tl.classList.add('visible');
      }, delay);
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}


/* ── COUNTERS ──────────────────────────────────────────── */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;
    if (REDUCED) { el.textContent = target + suffix; return; }

    const dur = 1600, start = performance.now();
    (function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(step);
    })(start);
  };

  if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  els.forEach(el => io.observe(el));
}


/* ── DSA RINGS ─────────────────────────────────────────── */
function initRings() {
  const rings = document.querySelectorAll('.ring-fg');
  if (!rings.length) return;
  const CIRC = 2 * Math.PI * 50;

  const fill = (el) => {
    const pct = parseFloat(el.dataset.pct || '0');
    el.style.strokeDasharray = CIRC;
    el.style.strokeDashoffset = CIRC - (CIRC * pct) / 100;
  };

  if (REDUCED || !('IntersectionObserver' in window)) { rings.forEach(fill); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => fill(e.target), 220);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  rings.forEach(el => { el.style.strokeDasharray = CIRC; el.style.strokeDashoffset = CIRC; io.observe(el); });
}


/* ── CONTRIBUTION GRID ─────────────────────────────────── */
function initContribGrid() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;

  // Deterministic pattern: steadier on weekdays, denser in recent weeks.
  const frag = document.createDocumentFragment();
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const weekend = d === 0 || d === 6;
      const recency = w / 52;                    // 0 = oldest week
      const seed = (Math.sin((w * 7 + d) * 12.9898) * 43758.5453) % 1;
      const noise = Math.abs(seed);
      const score = noise * (weekend ? 0.55 : 1) * (0.55 + recency * 0.75);

      let level = 0;
      if (score > 0.22) level = 1;
      if (score > 0.42) level = 2;
      if (score > 0.62) level = 3;
      if (score > 0.82) level = 4;

      const cell = document.createElement('span');
      cell.className = 'gh-cell';
      cell.dataset.level = level;
      frag.appendChild(cell);
    }
  }
  grid.appendChild(frag);
  grid.scrollLeft = grid.scrollWidth;
}


/* ── TIMELINE PROGRESS LINE ────────────────────────────── */
function initTimelineProgress() {
  const tl = document.getElementById('timeline');
  if (!tl || REDUCED) return;
  onScroll(() => {
    const rect = tl.getBoundingClientRect();
    const start = window.innerHeight * 0.85;
    const pct = Math.max(0, Math.min(1, (start - rect.top) / (rect.height || 1)));
    tl.style.setProperty('--tl-progress', (pct * 100) + '%');
  });
}


/* ── CARD SPOTLIGHT ────────────────────────────────────── */
function initSpotlight() {
  if (REDUCED) return;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  }, { passive: true });
}


/* ── 3D TILT ───────────────────────────────────────────── */
function initTilt() {
  if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}


/* ── MAGNETIC BUTTONS ──────────────────────────────────── */
function initMagnetic() {
  if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}


/* ── DEFECT TICKETS (quality page) ─────────────────────── */
/* NOTE for Eshwar: these three are written from the kinds of defects this work
   turns up. Swap in real ones from your own Agiledigest tickets when you can —
   a specific true bug reads far better than a plausible one. */
const TICKETS = [
  {
    id: 'BUG-1042',
    title: 'Draft is silently discarded when the session expires mid-edit',
    sev: 'critical', sevLabel: 'Critical',
    summary: 'A user typing a long entry loses everything if their token expires before they submit. No warning, no recovery — the form posts, the API returns 401 and the page redirects to login with the content gone.',
    steps: [
      'Log in and open a form with a long text field.',
      'Leave the tab idle until the session token expires (~30 min).',
      'Return, finish typing and press Submit.'
    ],
    expected: 'The user is warned before the session lapses, or the draft survives re-authentication.',
    actual: 'Redirect to the login screen. All entered content is lost with no message.',
    impact: 'Data loss with no recovery path. Highest-severity class of defect — it destroys work the user already did.'
  },
  {
    id: 'BUG-0977',
    title: 'Double-submit creates duplicate records',
    sev: 'major', sevLabel: 'Major',
    summary: 'The submit button stays enabled while the request is in flight. An impatient second click on a slow connection fires the request twice and two records are written.',
    steps: [
      'Throttle the network to a slow connection.',
      'Fill the create form and press Submit.',
      'Press Submit again before the first response returns.'
    ],
    expected: 'The button disables on first press; the second click does nothing. One record is created.',
    actual: 'Two identical records are created, each with its own id.',
    impact: 'Corrupts the data set and any count built on it. Found by being impatient on purpose — the fastest way to surface a race.'
  },
  {
    id: 'BUG-0891',
    title: 'Empty list renders as a blank panel with no explanation',
    sev: 'minor', sevLabel: 'Minor',
    summary: 'A new user with no records sees an empty bordered box. Nothing tells them the list is empty rather than broken, and nothing points at how to add the first item.',
    steps: [
      'Create a fresh account with no records.',
      'Open the list view.'
    ],
    expected: 'An empty state explaining there is nothing yet, with the action to create the first record.',
    actual: 'A blank panel. Indistinguishable from a failed load.',
    impact: 'Low severity, high frequency — it is every user’s first impression of the product.'
  }
];

function initTickets() {
  const host = document.getElementById('ticket');
  const tabs = document.getElementById('ticket-tabs');
  if (!host || !tabs) return;

  const esc = (t) => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // The environment block is the point of the whole section: it is read off the
  // visitor's own browser, which is exactly the data a developer needs to repro.
  function environment() {
    const d = new Date();
    const rows = [
      ['Browser', browserName()],
      ['Platform', navigator.platform || 'unknown'],
      ['Viewport', window.innerWidth + ' × ' + window.innerHeight + ' px'],
      ['Screen', screen.width + ' × ' + screen.height + ' @ ' + (window.devicePixelRatio || 1) + 'x'],
      ['Theme', document.documentElement.getAttribute('data-theme')],
      ['Language', navigator.language || 'unknown'],
      ['Reduced motion', REDUCED ? 'on' : 'off'],
      ['Observed at', d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC']
    ];
    return rows.map(([k, v]) => `<div><b>${esc(k)}</b>${esc(v)}</div>`).join('');
  }

  function browserName() {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua)) return 'Edge ' + (ua.match(/Edg\/(\d+)/) || [])[1];
    if (/Firefox\//.test(ua)) return 'Firefox ' + (ua.match(/Firefox\/(\d+)/) || [])[1];
    if (/Chrome\//.test(ua)) return 'Chrome ' + (ua.match(/Chrome\/(\d+)/) || [])[1];
    if (/Safari\//.test(ua)) return 'Safari ' + (ua.match(/Version\/(\d+)/) || [])[1];
    return 'Unknown';
  }

  function render(i) {
    const t = TICKETS[i];
    host.innerHTML = `
      <div class="ticket-head">
        <span class="ticket-id">${esc(t.id)}</span>
        <span class="ticket-title">${esc(t.title)}</span>
        <span class="sev sev-${t.sev}">${esc(t.sevLabel)}</span>
        <span class="sev sev-fixed">Fixed &amp; retested</span>
      </div>
      <div class="ticket-body">
        <div class="ticket-field">
          <h4>Summary</h4>
          <p>${esc(t.summary)}</p>
        </div>
        <div class="ticket-field">
          <h4>Steps to reproduce</h4>
          <ol class="ticket-steps">${t.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        </div>
        <div class="ticket-cols">
          <div class="ticket-expect ticket-field">
            <h4>Expected result</h4>
            <p>${esc(t.expected)}</p>
          </div>
          <div class="ticket-actual ticket-field">
            <h4>Actual result</h4>
            <p>${esc(t.actual)}</p>
          </div>
        </div>
        <div class="ticket-field">
          <h4>Why the severity</h4>
          <p>${esc(t.impact)}</p>
        </div>
      </div>
      <div class="ticket-env">
        <span class="env-live"><span class="pulse-dot"></span>Environment — captured live from your browser</span>
        <div class="env-grid">${environment()}</div>
      </div>`;
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ticket]');
    if (!btn) return;
    tabs.querySelectorAll('[data-ticket]').forEach(b => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    render(+btn.dataset.ticket);
  });

  render(0);
  // Keep the viewport row honest if the window is resized while reading.
  window.addEventListener('resize', debounce(() => {
    const grid = host.querySelector('.env-grid');
    if (grid) grid.innerHTML = environment();
  }, 250));
}


/* ── PRE-SHIP CHECKLIST (quality page) ─────────────────── */
const CHECKS = [
  ['Empty state', 'Zero records, zero results, zero notifications — every list has a first day.'],
  ['Boundary values', 'One item, two thousand items, the longest name a real person could have.'],
  ['Double submit', 'Press it twice, fast, on a throttled connection. Does it write two rows?'],
  ['Network failure', 'Kill the request mid-flight. Does the user see a message or a frozen screen?'],
  ['Unauthorised access', 'Paste another role’s URL. Does the server say no, or only the UI?'],
  ['Input validation', 'Leading spaces, emoji, SQL-ish strings, a 500-character name.'],
  ['Back button', 'Navigate away mid-flow and return. Is the state still coherent?'],
  ['Small screen', 'Everything at 360px wide, with the keyboard open over the form.'],
  ['Keyboard only', 'Tab through the whole flow. Can it be completed without a mouse?'],
  ['Refresh mid-flow', 'Reload halfway through. Does it resume, restart, or corrupt?']
];

function initChecklist() {
  const host = document.getElementById('check-list');
  if (!host) return;
  const doneEl = document.getElementById('check-done');
  const totalEl = document.getElementById('check-total');
  const reset = document.getElementById('check-reset');

  host.innerHTML = CHECKS.map(([title, note], i) => `
    <div class="check-item" role="checkbox" tabindex="0" aria-checked="false" data-i="${i}">
      <span class="check-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <span class="check-text"><strong>${title}</strong><span>${note}</span></span>
    </div>`).join('');

  if (totalEl) totalEl.textContent = CHECKS.length;

  const count = () => {
    const n = host.querySelectorAll('.check-item.done').length;
    if (doneEl) doneEl.textContent = n;
  };

  const toggle = (item) => {
    const on = item.classList.toggle('done');
    item.setAttribute('aria-checked', String(on));
    count();
  };

  host.addEventListener('click', (e) => {
    const item = e.target.closest('.check-item');
    if (item) toggle(item);
  });
  host.addEventListener('keydown', (e) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    const item = e.target.closest('.check-item');
    if (!item) return;
    e.preventDefault();
    toggle(item);
  });

  reset?.addEventListener('click', () => {
    host.querySelectorAll('.check-item.done').forEach(i => {
      i.classList.remove('done');
      i.setAttribute('aria-checked', 'false');
    });
    count();
  });
}


/* ── CONTACT FORM (opens mail client) ──────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const company = form.company.value.trim();
    const message = form.message.value.trim();

    const invalid = [];
    if (!name) invalid.push(form.name);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid.push(form.email);
    if (!message) invalid.push(form.message);

    form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
    if (invalid.length) {
      invalid.forEach(el => el.closest('.field').classList.add('invalid'));
      if (status) { status.textContent = 'Please fill in your name, a valid email and a message.'; status.classList.add('error'); }
      invalid[0].focus();
      return;
    }

    const subject = `Portfolio enquiry from ${name}${company ? ' (' + company + ')' : ''}`;
    const body = `Hi Eshwar,\n\n${message}\n\n—\n${name}${company ? '\n' + company : ''}\n${email}`;
    window.location.href = `mailto:eshwarmanupati@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) { status.classList.remove('error'); status.textContent = 'Opening your mail app… if nothing happens, write to eshwarmanupati@gmail.com'; }
    form.reset();
  });
}


/* ── BACK TO TOP ───────────────────────────────────────── */
function initToTop() {
  const btn = document.getElementById('to-top');
  if (!btn) return;
  const ring = btn.querySelector('.ring-prog circle');
  const CIRC = 126;   // 2πr for r = 20

  onScroll(() => {
    btn.classList.toggle('visible', window.scrollY > 600);
    if (!ring) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    ring.style.strokeDashoffset = CIRC - CIRC * pct;
  });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
}


/* ── HELPERS ───────────────────────────────────────────── */
function onScroll(fn) {
  let ticking = false;
  const handler = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { fn(); ticking = false; });
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
