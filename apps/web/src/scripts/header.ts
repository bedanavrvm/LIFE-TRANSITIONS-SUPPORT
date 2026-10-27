const header = document.querySelector<HTMLElement>('.header-shell');

if (header) {
  const menu = header.querySelector<HTMLDetailsElement>('.mobile-nav');
  let previousY = Math.max(0, window.scrollY);
  let travel = 0;
  let scheduled = false;

  const setHidden = (hidden: boolean) => {
    header.dataset.hidden = String(hidden);
    document.documentElement.style.setProperty('--header-offset', hidden ? '0px' : `${header.offsetHeight}px`);
  };
  const show = () => {
    setHidden(false);
    travel = 0;
  };
  const measure = () => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    if (header.dataset.hidden !== 'true') setHidden(false);
  };
  const update = () => {
    scheduled = false;
    const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - innerHeight));
    const delta = y - previousY;
    previousY = y;
    if (y <= header.offsetHeight || menu?.open || header.querySelector(':focus-visible')) {
      show();
      return;
    }
    travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
    if (travel >= 24) setHidden(true);
    if (travel <= -12) show();
  };

  measure();
  new ResizeObserver(measure).observe(header);
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  header.addEventListener('focusin', show);
  menu?.addEventListener('toggle', () => { if (menu.open) show(); });
  if (menu) {
    const close = () => { menu.open = false; };
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.open) {
        event.preventDefault();
        close();
        menu.querySelector('summary')?.focus();
      }
    });
    menu.addEventListener('focusout', event => {
      if (!(event.relatedTarget instanceof Node) || !menu.contains(event.relatedTarget)) close();
    });
    document.addEventListener('pointerdown', event => {
      if (event.target instanceof Node && !menu.contains(event.target)) close();
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    window.matchMedia('(max-width: 1100px)').addEventListener('change', event => { if (!event.matches) close(); });
  }
  window.addEventListener('pageshow', () => {
    if (menu) menu.open = false;
    previousY = Math.max(0, window.scrollY);
    show();
  });
}
