// Atlas Investment Management — shared interactions

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll state
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = document.body.classList.toggle('nav-open');
      toggle.textContent = isOpen ? '✕' : '☰';
    });
  }
  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      toggle.textContent = '☰';
    });
  });

  // Join Us — click-to-toggle dropdown (more reliable than hover)
  document.querySelectorAll('.join-us').forEach((wrap) => {
    const trigger = wrap.querySelector('.join-us-link');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.join-us.open').forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });

  // Scroll reveal (exposed so dynamically-inserted content can opt in too)
  let revealIO;
  const observeReveals = (root) => {
    if (!revealIO) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    }
    (root || document).querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));
  };
  window.AtlasObserveReveals = observeReveals;
  observeReveals(document);

  // Count-up stats
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.count.includes('.') ? 1 : 0;
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        el.textContent = (decimals ? val.toFixed(1) : Math.round(val)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => countIO.observe(el));

  // Contact form (static prototype — prevent actual submit)
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message Sent';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
    });
  }

  // Newsletter form (static prototype — prevent actual submit)
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Subscribed';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; newsletterForm.reset(); }, 2600);
    });
  }
});
