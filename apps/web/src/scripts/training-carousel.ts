const carousel = document.querySelector<HTMLElement>('.training-carousel');
if (carousel) {
  const track = carousel.querySelector<HTMLElement>('.course-track')!;
  const cards = [...track.querySelectorAll<HTMLElement>('.course-card')];
  const controls = carousel.querySelector<HTMLElement>('.carousel-controls')!;
  const previous = carousel.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = carousel.querySelector<HTMLButtonElement>('[data-next]')!;
  const status = carousel.querySelector<HTMLElement>('.carousel-status')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function update() {
    const maximum = track.scrollWidth - track.clientWidth;
    controls.hidden = cards.length < 2 || maximum <= 1;
    previous.setAttribute('aria-disabled', String(track.scrollLeft <= 1));
    next.setAttribute('aria-disabled', String(track.scrollLeft >= maximum - 1));
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      return Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left) >= rect.width / 2 ? index + 1 : 0;
    }).filter(Boolean);
    if (visible.length) {
      const first = visible[0];
      const last = visible[visible.length - 1];
      const text = first === last ? `Course ${first} of ${cards.length}` : `Courses ${first}–${last} of ${cards.length}`;
      if (status.textContent !== text) status.textContent = text;
    }
  }

  function move(direction: number) {
    const button = direction < 0 ? previous : next;
    if (button.getAttribute('aria-disabled') === 'true') return;
    const maximum = track.scrollWidth - track.clientWidth;
    const stops = cards.map(card => Math.min(card.offsetLeft - cards[0].offsetLeft, maximum));
    const target = direction < 0
      ? stops.findLast(stop => stop < track.scrollLeft - 1) ?? 0
      : stops.find(stop => stop > track.scrollLeft + 1) ?? maximum;
    track.scrollTo({ left: target, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  let timer: number;
  track.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = window.setTimeout(update, 120);
  }, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
}
