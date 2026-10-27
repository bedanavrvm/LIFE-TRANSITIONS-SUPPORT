const breadcrumb = document.querySelector<HTMLElement>('.breadcrumb-bar');
const toc = document.querySelector<HTMLElement>('.section-nav');
const mobile = window.matchMedia('(max-width: 1100px)');
const sections = [...(toc?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]') ?? [])].flatMap(link => {
  const heading = document.getElementById(link.hash.slice(1));
  return heading ? [{ link, heading }] : [];
});
let scheduled = false;
let active: HTMLAnchorElement | undefined;

const measure = () => {
  document.documentElement.style.setProperty('--breadcrumb-height', `${breadcrumb?.offsetHeight ?? 0}px`);
  document.documentElement.style.setProperty('--toc-height', `${mobile.matches ? toc?.offsetHeight ?? 0 : 0}px`);
};
const update = () => {
  scheduled = false;
  if (!sections.length) return;
  const threshold = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 4;
  let current = sections[0];
  for (const section of sections) if (section.heading.getBoundingClientRect().top <= threshold) current = section;
  if (scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
  if (active === current.link) return;
  active = current.link;
  for (const section of sections) {
    if (section.link === active) section.link.setAttribute('aria-current', 'location');
    else section.link.removeAttribute('aria-current');
  }
  const strip = toc?.querySelector<HTMLElement>('.section-nav-links');
  if (mobile.matches && strip) {
    const item = active.getBoundingClientRect();
    const viewport = strip.getBoundingClientRect();
    if (item.left < viewport.left) strip.scrollLeft += item.left - viewport.left - 8;
    else if (item.right > viewport.right) strip.scrollLeft += item.right - viewport.right + 8;
  }
};
const schedule = () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
};
const observer = new ResizeObserver(() => { measure(); schedule(); });
if (breadcrumb) observer.observe(breadcrumb);
if (toc) observer.observe(toc);
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', () => { active = undefined; measure(); schedule(); });
window.addEventListener('hashchange', schedule);
window.addEventListener('pageshow', () => { active = undefined; measure(); schedule(); });
measure();
schedule();
