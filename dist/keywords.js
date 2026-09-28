(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lang = () => (document.documentElement.lang === 'id' ? 'id' : 'en');
  const onLanguageChange = (callback) => {
    new MutationObserver(callback).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  };

  // ---------- 1. Hero search bar that types her specialities ----------
  const searches = {
    en: {
      rank: 'Top result',
      items: [
        ['keyword research', '500+ top-10 keywords', 'IDN Times'],
        ['technical seo audit', '1.5× more leads', 'Knitto'],
        ['content strategy', '464.75% traffic surge', 'FLIN'],
        ['seo website strategy', '30+ pages mapped', 'RR Express'],
        ['social media content', '6.1M post views', 'Personal Content Lab'],
        ['campaign copywriting', '1,058% revenue growth', 'IT’s Buah & TrueDetox']
      ]
    },
    id: {
      rank: 'Hasil teratas',
      items: [
        ['riset keyword', '500+ keyword di top 10', 'IDN Times'],
        ['audit seo teknis', '1.5× lebih banyak leads', 'Knitto'],
        ['strategi konten', 'Lonjakan traffic 464.75%', 'FLIN'],
        ['strategi website seo', '30+ halaman dipetakan', 'RR Express'],
        ['konten media sosial', '6.1M views postingan', 'Personal Content Lab'],
        ['copywriting kampanye', 'Pertumbuhan revenue 1,058%', 'IT’s Buah & TrueDetox']
      ]
    }
  };

  const search = document.querySelector('.hero-search');
  if (search) {
    const query = search.querySelector('.hero-search-query');
    const result = search.querySelector('.hero-search-result');
    const rank = search.querySelector('.hero-search-rank');
    const text = search.querySelector('.hero-search-text');
    let index = 0;
    let timer = 0;
    let running = false;
    let inView = true;
    const wait = (ms) => new Promise((resolve) => { timer = setTimeout(resolve, ms); });

    function showResult(item) {
      rank.textContent = searches[lang()].rank;
      text.textContent = `${item[1]} · ${item[2]}`;
      result.classList.add('is-shown');
    }

    function showStill() {
      const item = searches[lang()].items[0];
      query.textContent = item[0];
      showResult(item);
    }

    // Bumped on language change so a phrase half-typed in the old language stops.
    let generation = 0;

    async function run() {
      if (running) return;
      running = true;
      while (inView && !document.hidden && !reduceMotion.matches) {
        const gen = generation;
        const changed = () => gen !== generation;
        const items = searches[lang()].items;
        const item = items[index % items.length];
        while (query.textContent && !changed()) {
          query.textContent = query.textContent.slice(0, -1);
          await wait(22);
        }
        await wait(280);
        for (const char of item[0]) {
          if (changed()) break;
          query.textContent += char;
          await wait(55 + Math.random() * 45);
        }
        if (changed()) continue;
        await wait(380);
        if (changed()) continue;
        showResult(item);
        await wait(2600);
        result.classList.remove('is-shown');
        await wait(350);
        if (!changed()) index += 1;
      }
      running = false;
    }

    function start() {
      if (reduceMotion.matches) {
        clearTimeout(timer);
        showStill();
      } else {
        run();
      }
    }

    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
    }).observe(search);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && inView) start(); });
    reduceMotion.addEventListener('change', start);
    onLanguageChange(() => {
      // Restart the current phrase in the new language.
      generation += 1;
      query.textContent = '';
      result.classList.remove('is-shown');
      if (reduceMotion.matches) showStill();
    });
    start();
  }

  // ---------- 2. Capabilities list split into skill chips ----------
  // Order matches the capabilities list in both languages.
  const skillKeys = ['onoff', 'audit', 'strategy', 'seowriting', 'copy', 'keyword', 'marketing', 'social', 'analytics', 'design', 'camera'];
  const capabilityList = document.querySelector('[data-i18n="capabilitiesList"]');
  const toolList = document.querySelector('.capabilities > div:nth-child(2) p');
  const seen = new Set();
  let activeSkills = [];

  const splitList = (el) => (el ? el.textContent.split('·').map((part) => part.trim()).filter(Boolean) : []);

  function wrapCapabilities() {
    if (!capabilityList || capabilityList.querySelector('.skill')) return;
    const items = splitList(capabilityList);
    capabilityList.replaceChildren(...items.flatMap((label, i) => {
      const chip = document.createElement('span');
      chip.className = 'skill';
      chip.dataset.skill = skillKeys[i] || '';
      chip.textContent = label;
      return i ? [document.createTextNode(' · '), chip] : [chip];
    }));
    paintSkills();
  }

  function paintSkills() {
    capabilityList?.querySelectorAll('.skill').forEach((chip) => {
      chip.classList.toggle('is-active', activeSkills.includes(chip.dataset.skill));
      chip.classList.toggle('is-seen', seen.has(chip.dataset.skill));
    });
  }

  if (capabilityList) {
    wrapCapabilities();
    // script.js rewrites this paragraph when the language changes, so wrap it again.
    new MutationObserver(wrapCapabilities).observe(capabilityList, { childList: true });
  }

  // ---------- 3. Project tags light up, and matching capabilities glow ----------
  const projects = [...document.querySelectorAll('.project')];
  projects.forEach((project) => {
    project.querySelectorAll('.project-tags li').forEach((tag, i) => tag.style.setProperty('--i', i));
  });

  function activate(project) {
    projects.forEach((item) => item.classList.toggle('is-lit', item === project));
    activeSkills = project
      ? [...project.querySelectorAll('.project-tags li[data-skill]')].flatMap((tag) => tag.dataset.skill.split(' '))
      : [];
    activeSkills.forEach((key) => seen.add(key));
    paintSkills();
  }

  if (window.matchMedia('(hover: hover)').matches) {
    projects.forEach((project) => {
      project.addEventListener('pointerenter', () => activate(project));
      project.addEventListener('pointerleave', () => activate(null));
      project.addEventListener('focusin', () => activate(project));
    });
  } else {
    // On touch screens, the project in the middle of the screen counts as hovered.
    const middle = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activate(entry.target);
        else if (entry.target.classList.contains('is-lit')) activate(null);
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    projects.forEach((project) => middle.observe(project));
  }

  // ---------- 4. Keyword strip that drifts, and speeds up with scrolling ----------
  const strip = document.querySelector('.keyword-strip');
  if (!strip) return;
  const rows = [
    { el: strip.querySelector('.keyword-row-skills'), source: capabilityList, direction: -1, offset: 0, width: 0 },
    { el: strip.querySelector('.keyword-row-tools'), source: toolList, direction: 1, offset: 0, width: 0 }
  ];

  function fillRow(row) {
    const items = row.source === capabilityList
      ? [...capabilityList.querySelectorAll('.skill')].map((chip) => chip.textContent)
      : splitList(row.source);
    const group = document.createElement('div');
    group.className = 'keyword-group';
    items.forEach((label) => {
      const word = document.createElement('span');
      word.className = 'keyword';
      word.textContent = label;
      const mark = document.createElement('i');
      mark.className = 'keyword-mark';
      group.append(word, mark);
    });
    // Two copies side by side, so the loop has no visible seam.
    row.el.replaceChildren(group, group.cloneNode(true));
    row.width = group.getBoundingClientRect().width;
  }

  const fillRows = () => rows.forEach(fillRow);
  fillRows();
  onLanguageChange(() => requestAnimationFrame(fillRows));
  window.addEventListener('resize', fillRows);
  document.fonts?.ready.then(fillRows);

  let lastScroll = window.scrollY;
  let boost = 0;
  let scrollDirection = 1;
  let frame = 0;
  let last = 0;
  let stripVisible = false;

  function tick(now) {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    const scrollDelta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;
    if (scrollDelta) scrollDirection = Math.sign(scrollDelta);
    boost += (Math.min(Math.abs(scrollDelta) * 18, 900) - boost) * 0.08;
    const speed = (38 + boost) * scrollDirection;
    rows.forEach((row) => {
      if (!row.width) return;
      row.offset = (row.offset + speed * row.direction * dt) % row.width;
      if (row.offset > 0) row.offset -= row.width;
      row.el.style.transform = `translate3d(${row.offset}px, 0, 0)`;
    });
    frame = stripVisible && !reduceMotion.matches ? requestAnimationFrame(tick) : 0;
  }

  new IntersectionObserver(([entry]) => {
    stripVisible = entry.isIntersecting;
    if (stripVisible && !frame && !reduceMotion.matches) {
      last = 0;
      lastScroll = window.scrollY;
      frame = requestAnimationFrame(tick);
    }
  }).observe(strip);
})();
