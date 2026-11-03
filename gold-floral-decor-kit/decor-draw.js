/* DecorDraw(element, svgUrl): loads an SVG file, inlines it and draws its lines in as if by pen.
   Needs decor.css (the .decor-draw rules). element.replay() draws it again.
   Respects reduced motion through decor.css. */
(function (root) {
  root.DecorDraw = function (el, url) {
    return root.fetch(url).then(function (r) { return r.text(); }).then(function (text) {
      el.innerHTML = text.replace(/<path /g, '<path pathLength="1" ');
      var svg = el.querySelector('svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.classList.add('decor-draw');
      el.replay = function () { svg.classList.remove('decor-draw'); void svg.getBoundingClientRect(); svg.classList.add('decor-draw'); };
      return el;
    });
  };
})(window);
