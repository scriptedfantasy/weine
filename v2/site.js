(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Cart counter (kept for the tab session) ----------
  const store = {
    get() { try { return +sessionStorage.getItem('uh-cart') || 0; } catch (e) { return 0; } },
    set(v) { try { sessionStorage.setItem('uh-cart', v); } catch (e) {} }
  };
  let cart = store.get();
  const paintCart = () => $$('.js-count').forEach(el => { el.textContent = cart; });
  paintCart();
  function addToCart() {
    cart += 1; store.set(cart); paintCart();
    $$('.hd__order').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }

  // ---------- Mobile menu ----------
  $('.hd__burger')?.addEventListener('click', () => document.body.classList.toggle('is-menu'));

  // ---------- Appear on scroll ----------
  const appearIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('did-appear'); appearIO.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.appear').forEach(el => appearIO.observe(el));

  // ---------- Home: slides + turning bottle ----------
  const slides = $('.slides');
  if (slides) {
    const list = $$('.slide', slides);
    const seal = $('.seal');
    const desktop = matchMedia('(min-width: 1000px)');
    let active = -1;

    function setActive(i) {
      if (i === active) return;
      active = i;
      list.forEach((s, j) => s.classList.toggle('is-in', j === i));
      seal?.style.setProperty('--rot', `${i * 90}deg`);
    }
    const slideIO = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) setActive(list.indexOf(e.target));
    }), { root: desktop.matches ? slides : null, threshold: .6 });
    list.forEach(s => slideIO.observe(s));
    setActive(0);

    seal?.addEventListener('click', () => {
      const link = list[active]?.querySelector('.slide__title a');
      if (link) location.href = link.href;
    });

    // Keyboard: arrows / space move one slide
    addEventListener('keydown', e => {
      if (!desktop.matches) return;
      const step = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = Math.max(0, Math.min(list.length - 1, active + step));
      slides.scrollTo({ top: next * slides.clientHeight, behavior: reduce ? 'auto' : 'smooth' });
    });

    // Background follows the mouse a little
    if (!reduce) slides.addEventListener('mousemove', e => {
      const s = list[active]; if (!s) return;
      s.style.setProperty('--mx', `${(e.clientX / innerWidth - .5) * -26}px`);
      s.style.setProperty('--my', `${(e.clientY / innerHeight - .5) * -26}px`);
    });
  }

  // ---------- Wines: lists, line-ups, sheet ----------
  const WINES = window.WINES;
  if (WINES) {
    const CF = 'https://d2uqzpf6d2kb73.cloudfront.net/';
    $$('[data-wines]').forEach(box => {
      const group = WINES.filter(w => w.group === box.dataset.wines);
      const isLineup = box.classList.contains('lineup');
      box.innerHTML = group.map(w => isLineup
        ? `<button type="button" data-wine="${w.id}" aria-label="${w.name} ansehen"><img src="${CF + w.img}" alt="Flasche ${w.name}" loading="lazy"></button>`
        : `<li><button type="button" data-wine="${w.id}">${w.name}</button><small>${w.vintage}</small></li>`
      ).join('');
    });

    const body = document.body;
    const sheet = $('.sheet');
    let lastFocus = null;

    function open(id) {
      const w = WINES.find(x => x.id === id); if (!w) return;
      $('.sheet__media img', sheet).src = CF + w.img;
      $('.sheet__media img', sheet).alt = `Flasche ${w.name}`;
      $('.sheet__meta', sheet).textContent = `${w.type} · ${w.vintage}`;
      $('h2', sheet).textContent = w.name;
      $('.sheet__meaning', sheet).textContent = w.meaning;
      $('.sheet__note', sheet).textContent = w.note;
      $('dl', sheet).innerHTML =
        `<dt>Rebsorten</dt><dd>${w.grapes}</dd><dt>Ausbau</dt><dd>${w.ageing}</dd>` +
        `<dt>Alkohol</dt><dd>${w.abv}</dd><dt>Passt zu</dt><dd>${w.pairs}</dd><dt>Inhalt</dt><dd>75 cl</dd>`;
      $('.price', sheet).textContent = w.price;
      $('.score', sheet).innerHTML = w.score || '';
      $('.js-add', sheet).textContent = 'In den Warenkorb';
      sheet.scrollTop = 0;
      lastFocus = document.activeElement;
      body.classList.add('is-sheet');
      sheet.setAttribute('aria-hidden', 'false');
      setTimeout(() => $('.sheet__close', sheet).focus({ preventScroll: true }), 50);
    }
    function close() {
      body.classList.remove('is-sheet');
      sheet.setAttribute('aria-hidden', 'true');
      lastFocus?.focus({ preventScroll: true });
    }

    document.addEventListener('click', e => {
      const t = e.target.closest('[data-wine]');
      if (t) open(t.dataset.wine);
    });
    $('.scrim').addEventListener('click', close);
    $('.sheet__close', sheet).addEventListener('click', close);
    addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('is-sheet')) close(); });
    $('.js-add', sheet).addEventListener('click', e => {
      addToCart();
      e.currentTarget.textContent = 'Hinzugefügt ✓';
    });
  }

  // ---------- Newsletter (mock) ----------
  $$('.signup').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    f.querySelector('button').textContent = 'Grazie ✓';
  }));
})();
