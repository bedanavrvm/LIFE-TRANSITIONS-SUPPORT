const header = document.querySelector<HTMLElement>('.header-shell');

if (header) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = header.querySelector<HTMLDetailsElement>('.mobile-nav');
  let previousY = Math.max(0, window.scrollY);
  let travel = 0;
  let scheduled = false;

  const show = () => {
    header.dataset.hidden = 'false';
    travel = 0;
  };
  const measure = () => {
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
  };
  const update = () => {
    scheduled = false;
    const y = Math.max(0, Math.min(window.scrollY, document.documentElement.scrollHeight - innerHeight));
    const delta = y - previousY;
    previousY = y;
    if (reducedMotion.matches || y <= header.offsetHeight || menu?.open || header.contains(document.activeElement)) {
      show();
      return;
    }
    travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
    if (travel >= 24) header.dataset.hidden = 'true';
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
  reducedMotion.addEventListener('change', show);
  window.addEventListener('pageshow', () => {
    previousY = Math.max(0, window.scrollY);
    show();
  });
}
