document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  setTimeout(() => loader.classList.add('hidden'), 2200);

  initParticles();
  initNavbar();
  initTypedText();
  initScrollReveal();
  initCounters();
  renderProjects();
  renderRepos();
  initLeetCodeBars();
  initBackToTop();
  initContactForm();
  initCardGlow();
  initContribGrid();
});


function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = window.innerWidth < 768 ? 18 : 35;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = (Math.random() - 0.5) * 0.15;
      this.opacity = Math.random() * 0.2 + 0.05;
      this.hue = Math.random() > 0.5 ? 263 : 239;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + this.hue + ', 58%, 65%, ' + this.opacity + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function connectParticles() {
    const maxDist = 120;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.strokeStyle = 'hsla(263, 58%, 65%, ' + (0.04 * (1 - dist / maxDist)) + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}


function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const navAnchors = links.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  const sections = document.querySelectorAll('.section, .hero');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      const top = s.offsetTop - 120;
      if (scrollY >= top) current = s.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
}


function initTypedText() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const strings = [
    'Full Stack Developer',
    'MERN Stack Developer',
    'Problem Solver',
    'Cloud Enthusiast',
    'AI Learner',
    '272+ LeetCode Solved'
  ];
  let stringIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const current = strings[stringIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 35 : 70;
    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      delay = 500;
    }
    setTimeout(type, delay);
  }
  type();
}


function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!reveals.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
}


function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (!isNaN(target)) animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCount(el, target) {
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  }
  requestAnimationFrame(step);
}




function initLeetCodeBars() {
  const bars = document.querySelectorAll('.lc-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 300);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
}


const projectsData = [
  {
    title: 'Mini PayTM',
    desc: 'Digital wallet platform with secure authentication, real-time balance management and transaction history.',
    highlights: ['User Authentication', 'Transaction Management', 'Secure Database Integration', 'Responsive UI'],
    tech: ['JavaScript', 'Node.js', 'MongoDB', 'Express'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    github: 'https://github.com/Eshwarmanupati/Mini-payTm'
  },
  {
    title: 'Live Attendance',
    desc: 'Real-time attendance management system for educational institutions with live tracking and reporting.',
    highlights: ['Real-time Tracking', 'Admin Dashboard', 'Student Management', 'Automated Reports'],
    tech: ['JavaScript', 'Full Stack', 'Real-time'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    github: 'https://github.com/Eshwarmanupati/Live-Attendence-Platform'
  },
  {
    title: 'Credex',
    desc: 'Credit management and finance application with TypeScript-based architecture for enterprise scalability.',
    highlights: ['Credit Scoring Logic', 'TypeScript Architecture', 'Financial Calculations', 'Scalable Design'],
    tech: ['TypeScript', 'Finance', 'Business Logic'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    github: 'https://github.com/Eshwarmanupati/Credex'
  },
  {
    title: 'Prowider Mini',
    desc: 'Service provider platform connecting providers with consumers using scalable architecture and clean UI.',
    highlights: ['Provider-Consumer Flow', 'Service Matching', 'Scalable Backend'],
    tech: ['TypeScript', 'Platform'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    github: 'https://github.com/Eshwarmanupati'
  },
  {
    title: 'LMS Platform',
    desc: 'Learning Management System with dashboards, role-based access, course management and progress tracking.',
    highlights: ['Role-based Access', 'Course Management', 'Progress Tracking', 'Student Dashboard'],
    tech: ['JavaScript', 'Full Stack', 'LMS'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    github: 'https://github.com/Eshwarmanupati/sesd-lms'
  }
];

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projectsData.map((p, i) => `
    <div class="glass-card project-card reveal" style="transition-delay:${i * 0.06}s">
      <div class="project-card-image">
        <span class="project-icon" style="position:relative;z-index:2">${p.icon}</span>
      </div>
      <div class="project-card-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-highlights">
          ${p.highlights.map(h => '<div class="project-highlight-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' + h + '</div>').join('')}
        </div>
        <div class="project-tech-inline">
          ${p.tech.map(t => '<span>' + t + '</span>').join('')}
        </div>
        <div class="project-card-actions">
          <a href="${p.github}" class="project-link github" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            View Source Code
          </a>
        </div>
      </div>
    </div>
  `).join('');

  initScrollReveal();
}


const reposData = [
  { name: 'Mahayudh', desc: 'Job & opportunity platform — hackathon project', lang: 'TypeScript', color: '#3178c6', type: 'Hackathon' },
  { name: 'Mini-payTm', desc: 'Digital wallet with auth and transactions', lang: 'JavaScript', color: '#f1e05a', type: 'Full Stack' },
  { name: 'Credex', desc: 'Credit management & finance app', lang: 'TypeScript', color: '#3178c6', type: 'Finance' },
  { name: 'Live-Attendence-Platform', desc: 'Real-time attendance management', lang: 'JavaScript', color: '#f1e05a', type: 'Full Stack' },
  { name: 'sesd-lms', desc: 'Learning Management System', lang: 'JavaScript', color: '#f1e05a', type: 'LMS' },
  { name: 'Food-App', desc: 'Food ordering application', lang: 'JavaScript', color: '#f1e05a', type: 'Full Stack' },
  { name: 'chat-app', desc: 'Real-time chat application', lang: 'JavaScript', color: '#f1e05a', type: 'Full Stack' },
];

function renderRepos() {
  const grid = document.getElementById('repo-grid');
  if (!grid) return;

  grid.innerHTML = reposData.map((r, i) => `
    <a href="https://github.com/Eshwarmanupati/${r.name}" class="glass-card repo-card reveal" style="transition-delay:${i * 0.05}s" target="_blank" rel="noopener noreferrer">
      <h4>${r.name} <span class="repo-type">${r.type}</span></h4>
      <p>${r.desc}</p>
      <div class="repo-lang"><span class="dot" style="background:${r.color}"></span>${r.lang}</div>
    </a>
  `).join('');

  initScrollReveal();
}


function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Sent';
    btn.style.background = '#10B981';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.style.color = '';
      form.reset();
    }, 3000);
  });
}


function initCardGlow() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.glass-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });
}


function initContribGrid() {
  const grid = document.getElementById('gh-contrib-grid');
  if (!grid) return;
  const weeks = 52;
  const days = 7;
  let html = '';
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.7) level = 1;
      if (rand > 0.82) level = 2;
      if (rand > 0.9) level = 3;
      if (rand > 0.96) level = 4;
      html += '<span class="gh-cell" data-level="' + level + '"></span>';
    }
  }
  grid.innerHTML = html;
}
