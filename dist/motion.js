(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Content and final numbers remain readable without animation support or JS.
  if (preference.matches || !('IntersectionObserver' in window)) return;

  const activeCounters = new Map();
  const counters = new Map();
  let frame = 0;
  let stopped = false;

  function finishCounter(element, state) {
    state.visual.textContent = state.final;
    activeCounters.delete(element);
  }

  function tick(now) {
    activeCounters.forEach((state, element) => {
      const progress = Math.min(1, Math.max(0, (now - state.start) / 1200));
      if (progress === 1) {
        finishCounter(element, state);
      } else {
        const eased = 1 - Math.pow(1 - progress, 3);
        state.visual.textContent = state.format.format(state.value * eased) + state.suffix;
      }
    });
    frame = activeCounters.size ? requestAnimationFrame(tick) : 0;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      target.classList.add('visible');
      const state = counters.get(target);
      if (state && !stopped) {
        state.visual.textContent = state.format.format(0) + state.suffix;
        state.start = performance.now();
        activeCounters.set(target, state);
        if (!frame) frame = requestAnimationFrame(tick);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -32px 0px' });

  // Reveal individual gallery items instead of moving an entire tall case study.
  document.querySelectorAll('.project.reveal').forEach((el) => el.classList.remove('reveal'));
  document.querySelectorAll('.hero-copy, .impact-grid, .asset-grid').forEach((group) => {
    [...group.children].forEach((el, index) => {
      el.style.setProperty('--motion-delay', `${Math.min(index, 3) * 65}ms`);
    });
  });

  document.querySelectorAll('.reveal, .project-body, .asset-card').forEach((el) => {
    el.classList.add('motion-item');
    observer.observe(el);
  });

  document.querySelectorAll('.project, .timeline-item').forEach((el) => {
    el.classList.add('draw-divider');
    observer.observe(el);
  });
  document.querySelectorAll('.section-label, .result-row > span').forEach((el) => {
    el.classList.add('draw-accent');
    observer.observe(el);
  });

  document.querySelectorAll('.impact strong, .result-row strong').forEach((el) => {
    const final = el.textContent.trim();
    const match = final.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return;
    const value = Number(match[1].replaceAll(',', ''));
    const decimals = (match[1].split('.')[1] || '').length;
    const places = value < 10 ? Math.max(decimals, 1) : decimals;
    const format = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: places, maximumFractionDigits: places
    });
    const label = document.createElement('span');
    label.className = 'counter-label';
    label.textContent = final;
    const visual = document.createElement('span');
    visual.className = 'counter-visual';
    visual.setAttribute('aria-hidden', 'true');
    visual.dataset.final = final;
    const digits = document.createElement('span');
    digits.textContent = final;
    visual.append(digits);
    el.replaceChildren(label, visual);
    // Only the hidden-from-AT digits change; the accessible value stays final.
    counters.set(el, { final, value, suffix: match[2], format, visual: digits });
    observer.observe(el);
  });

  document.addEventListener('focusin', (event) => {
    let el = event.target;
    while (el instanceof Element) {
      if (el.classList.contains('motion-item')) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
      el = el.parentElement;
    }
  });

  preference.addEventListener('change', () => {
    if (!preference.matches) return;
    stopped = true;
    observer.disconnect();
    cancelAnimationFrame(frame);
    frame = 0;
    counters.forEach((state, el) => finishCounter(el, state));
    document.querySelectorAll('.motion-item, .draw-divider, .draw-accent').forEach((el) => {
      el.classList.add('visible');
    });
  });
})();
