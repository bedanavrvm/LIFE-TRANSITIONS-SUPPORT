/* Gold Floral Decor Kit: drifting motion
   DecorFall(element, { kind: 'blossoms' | 'motes' | 'dandelion' | 'butterflies',
                        wind: 'calm' | 'breeze' | 'gusty', count: 22, color: '#B48A2F' })
   Draws on a canvas behind the element's content. One shared wind rises and falls over time,
   and each piece also sways, tumbles or flutters at its own pace.
   Pauses when off-screen or in a hidden tab. Shows a still scene if the visitor prefers reduced motion. */
(function (root) {
  var SPRITES = {"blossoms": [{"w": 3, "m": "<g transform=\"translate(0 0)\"><g transform=\"rotate(0)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(60)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(120)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(180)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(240)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(300)\"><path d=\"M0 0C-4.7 -3.2 -4.2 -10.4 0 -13C4.2 -10.4 4.7 -3.2 0 0Z\"/><path fill=\"none\" d=\"M0 -2.6L0 -8.8\"/></g><g transform=\"rotate(30)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><g transform=\"rotate(90)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><g transform=\"rotate(150)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><g transform=\"rotate(210)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><g transform=\"rotate(270)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><g transform=\"rotate(330)\"><path d=\"M0 0C-2.8 -1.9 -2.5 -6.2 0 -7.8C2.5 -6.2 2.8 -1.9 0 0Z\"/></g><circle r=\"1.3\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M1.7 0L3.2 0\"/><circle cx=\"3.2\" cy=\"0\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M0.8 1.5L1.6 2.8\"/><circle cx=\"1.6\" cy=\"2.8\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-0.8 1.5L-1.6 2.8\"/><circle cx=\"-1.6\" cy=\"2.8\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-1.7 0L-3.2 0\"/><circle cx=\"-3.2\" cy=\"0\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-0.8 -1.5L-1.6 -2.8\"/><circle cx=\"-1.6\" cy=\"-2.8\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M0.8 -1.5L1.6 -2.8\"/><circle cx=\"1.6\" cy=\"-2.8\" r=\"0.9\" fill-opacity=\".85\"/></g>"}, {"w": 3, "m": "<g transform=\"translate(0 0)\"><g transform=\"rotate(0)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(45)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(90)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(135)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(180)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(225)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(270)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(315)\"><path d=\"M0 0C-4.2 -3.5 -3.8 -11.2 0 -14C3.8 -11.2 4.2 -3.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2.8L0 -9.5\"/></g><g transform=\"rotate(22.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(67.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(112.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(157.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(202.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(247.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(292.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><g transform=\"rotate(337.5)\"><path d=\"M0 0C-2.5 -2.1 -2.3 -6.7 0 -8.4C2.3 -6.7 2.5 -2.1 0 0Z\"/></g><circle r=\"1.4\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M1.8 0L3.5 0\"/><circle cx=\"3.5\" cy=\"0\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M1.3 1.3L2.5 2.5\"/><circle cx=\"2.5\" cy=\"2.5\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M0 1.8L0 3.5\"/><circle cx=\"0\" cy=\"3.5\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-1.3 1.3L-2.5 2.5\"/><circle cx=\"-2.5\" cy=\"2.5\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-1.8 0L-3.5 0\"/><circle cx=\"-3.5\" cy=\"0\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-1.3 -1.3L-2.5 -2.5\"/><circle cx=\"-2.5\" cy=\"-2.5\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M-0 -1.8L-0 -3.5\"/><circle cx=\"-0\" cy=\"-3.5\" r=\"0.9\" fill-opacity=\".85\"/><path fill=\"none\" d=\"M1.3 -1.3L2.5 -2.5\"/><circle cx=\"2.5\" cy=\"-2.5\" r=\"0.9\" fill-opacity=\".85\"/></g>"}, {"w": 4, "m": "<g transform=\"translate(0 9)\"><path d=\"M0 0C-6.5 -4.5 -5.9 -14.4 0 -18C5.9 -14.4 6.5 -4.5 0 0Z\"/><path fill=\"none\" d=\"M0 -3L0 -13\"/></g>"}, {"w": 3, "m": "<g transform=\"translate(0 9) rotate(-10)\"><path d=\"M0 0C-5 -4.5 -4.5 -14.4 0 -18C4.5 -14.4 5 -4.5 0 0Z\"/><path fill=\"none\" d=\"M0 -2L0 -14\"/></g>"}, {"w": 2, "m": "<g transform=\"translate(-9 0) rotate(0)\"><path d=\"M0 0C4.5 -5 12.6 -5 18 0C12.6 5 4.5 5 0 0Z\"/><path fill=\"none\" d=\"M1.1 0L14.8 0M5.4 0l2 -3M5.4 0l2 3M9 0l2 -3M9 0l2 3M12.2 0l2 -3M12.2 0l2 3\"/></g>"}, {"w": 1, "m": "<g transform=\"translate(-10 0) rotate(0)\"><path d=\"M0 0C2 -6.8 14 -7.2 20 0C14 7.2 2 6.8 0 0Z\"/><path fill=\"none\" d=\"M2.4 0C8 -1.6 12 -1.6 18 0\"/><g transform=\"translate(0 0) rotate(34)\"><path d=\"M0 0C2.8 -2.8 7.7 -2.8 11 0C7.7 2.8 2.8 2.8 0 0Z\"/><path fill=\"none\" d=\"M0.7 0L9 0\"/></g><g transform=\"translate(0 0) rotate(-34)\"><path d=\"M0 0C2.8 -2.8 7.7 -2.8 11 0C7.7 2.8 2.8 2.8 0 0Z\"/><path fill=\"none\" d=\"M0.7 0L9 0\"/></g></g>"}], "dandelion": [{"w": 1, "m": "<ellipse cx=\"0\" cy=\"15\" rx=\"1.4\" ry=\"3.2\" fill-opacity=\".7\"/><path fill=\"none\" d=\"M0 12L0 3\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-13.9 1.5\"/><circle cx=\"-13.9\" cy=\"1.5\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-13.2 -1.8\"/><circle cx=\"-13.2\" cy=\"-1.8\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-11.6 -4.8\"/><circle cx=\"-11.6\" cy=\"-4.8\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-9.4 -7.4\"/><circle cx=\"-9.4\" cy=\"-7.4\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-6.6 -9.4\"/><circle cx=\"-6.6\" cy=\"-9.4\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L-3.4 -10.6\"/><circle cx=\"-3.4\" cy=\"-10.6\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L0 -11\"/><circle cx=\"0\" cy=\"-11\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L3.4 -10.6\"/><circle cx=\"3.4\" cy=\"-10.6\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L6.6 -9.4\"/><circle cx=\"6.6\" cy=\"-9.4\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L9.4 -7.4\"/><circle cx=\"9.4\" cy=\"-7.4\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L11.6 -4.8\"/><circle cx=\"11.6\" cy=\"-4.8\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L13.2 -1.8\"/><circle cx=\"13.2\" cy=\"-1.8\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".8\" d=\"M0 3L13.9 1.5\"/><circle cx=\"13.9\" cy=\"1.5\" r=\".9\" fill-opacity=\".8\"/><path fill=\"none\" stroke-width=\".7\" opacity=\".6\" d=\"M-12 -4Q0 -12 12 -4\"/>"}]};
  var MODES = { calm: { k: 0.3 }, breeze: { k: 0.65 }, gusty: { k: 1 } };
  var COUNTS = {
    blossoms: { calm: 14, breeze: 22, gusty: 30 },
    motes: { calm: 26, breeze: 36, gusty: 46 },
    dandelion: { calm: 8, breeze: 12, gusty: 16 },
    butterflies: { calm: 2, breeze: 3, gusty: 4 }
  };

  function wind(t) {
    // slow swings plus faster gusts, roughly -1..1
    return 0.55 * Math.sin(t * 0.33) + 0.3 * Math.sin(t * 0.86 + 1.7) + 0.15 * Math.sin(t * 2.1 + 0.4);
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  var instances = [], forced = false;
  function mqReduced() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  function DecorFall(host, opts) {
    opts = opts || {};
    var kind = COUNTS[opts.kind] ? opts.kind : 'blossoms';
    var mode = MODES[opts.wind] ? opts.wind : 'breeze';
    var count = opts.count || COUNTS[kind][mode];
    var cv = document.createElement('canvas');
    cv.className = 'decor-fall-canvas';
    cv.setAttribute('aria-hidden', 'true');
    host.appendChild(cv);
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, t = 0, last = 0, raf = 0, running = false, onscreen = true, dead = false;
    var parts = [], imgs = [], pool = [0], col = '#B48A2F';
    var reduce = mqReduced() && !forced && !opts.force;

    function colour() {
      return opts.color || (root.getComputedStyle(host).getPropertyValue('--decor-gold') || '').trim() || '#B48A2F';
    }
    function rgbOf(c) {
      var k = document.createElement('canvas'); k.width = k.height = 1;
      var x = k.getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, 1, 1);
      var d = x.getImageData(0, 0, 1, 1).data; return d[0] + ',' + d[1] + ',' + d[2];
    }
    function glow(c) {
      var s = 64, k = document.createElement('canvas'); k.width = k.height = s;
      var x = k.getContext('2d'), rgb = rgbOf(c);
      var g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(' + rgb + ',0.95)'); g.addColorStop(0.28, 'rgba(' + rgb + ',0.45)'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g; x.fillRect(0, 0, s, s); return k;
    }
    function buildSprites() {
      col = colour();
      if (kind === 'motes') { imgs = [glow(col)]; pool = [0]; return; }
      if (kind === 'butterflies') { imgs = []; pool = [0]; return; }
      var list = SPRITES[kind];
      pool = [];
      list.forEach(function (s, i) { for (var k = 0; k < s.w; k++) pool.push(i); });
      imgs = list.map(function (s) {
        var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 40 40" width="96" height="96" fill="' + col +
          '" fill-opacity=".2" stroke="' + col + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + s.m + '</svg>';
        var im = new Image();
        im.onload = function () { if (reduce) draw(); };
        im.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
        return im;
      });
    }
    function make(initial) {
      var depth = rand(0.55, 1), small = W < 520 ? 0.75 : 1, p = { depth: depth, ph: rand(0, 6.28), sf: rand(0.6, 1.5), fp: rand(0, 6.28), ff: rand(0.8, 2.2) };
      p.s = pool[Math.floor(Math.random() * pool.length)];
      if (kind === 'motes') {
        p.size = rand(9, 22) * depth * small; p.x = rand(0, W); p.y = initial ? rand(0, H) : H + p.size;
        p.vy = -rand(7, 18) * (0.5 + depth); p.sa = rand(6, 16); p.tw = rand(0.6, 1.8); p.alpha = 0.5 + 0.4 * depth;
      } else if (kind === 'dandelion') {
        p.size = rand(30, 50) * depth * small; p.x = rand(-p.size, W + p.size); p.y = initial ? rand(0, H) : rand(0.05, 0.95) * H;
        p.vy = rand(-5, 12); p.sa = rand(6, 14); p.alpha = 0.6 + 0.35 * depth;
      } else if (kind === 'butterflies') {
        p.size = rand(26, 38) * small; p.x = rand(0, W); p.y = rand(0.15, 0.85) * H; p.h = rand(0, 6.28);
        p.speed = rand(34, 56); p.alpha = 0.9; p.fl = rand(8, 12);
      } else {
        p.size = rand(34, 62) * depth * small; p.x = rand(-p.size, W + p.size); p.y = initial ? rand(-p.size, H) : -p.size - rand(0, 40);
        p.alpha = 0.55 + 0.4 * depth; p.vy = rand(26, 52) * (0.55 + 0.6 * depth);
        p.rot = rand(0, 6.28); p.vr = rand(-0.7, 0.7); p.sa = rand(10, 26);
      }
      return p;
    }
    function fit() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(2, root.devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    }
    function resizeParts() {
      while (parts.length < count) parts.push(make(true));
      if (parts.length > count) parts.length = count;
    }
    function step(dt) {
      var k = MODES[mode].k, w = wind(t) * k;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], vx;
        if (kind === 'motes') {
          vx = w * 30 * p.depth + Math.sin(p.ph + t * p.sf) * p.sa;
          p.x += vx * dt; p.y += p.vy * dt;
          if (p.y < -p.size) { parts[i] = make(false); continue; }
        } else if (kind === 'dandelion') {
          vx = w * 150 * p.depth + Math.sin(p.ph + t * p.sf) * p.sa;
          p.x += vx * dt; p.y += (p.vy * 0.5 + Math.sin(p.ph + t * 0.8) * 14) * dt;
          p.rot = Math.max(-0.7, Math.min(0.7, vx / 150)) * 0.7 + Math.sin(t * p.sf + p.ph) * 0.1;
          if (p.y > H + p.size) p.y = -p.size; else if (p.y < -p.size) p.y = H + p.size;
        } else if (kind === 'butterflies') {
          p.h += (Math.sin(t * 0.7 + p.ph) * 1.1 + Math.sin(t * 1.9 + p.ph * 2) * 0.8) * dt;
          var vxb = Math.cos(p.h) * p.speed + w * 36, vyb = Math.sin(p.h) * p.speed * 0.8;
          p.x += vxb * dt; p.y += vyb * dt; p.fp += p.fl * dt; p.rot = Math.atan2(vyb, vxb) + Math.PI / 2;
          if (p.x < -p.size) p.x = W + p.size; else if (p.x > W + p.size) p.x = -p.size;
          if (p.y < p.size * 0.6) p.h = Math.atan2(Math.abs(Math.sin(p.h)), Math.cos(p.h));
          else if (p.y > H - p.size * 0.6) p.h = Math.atan2(-Math.abs(Math.sin(p.h)), Math.cos(p.h));
          continue;
        } else {
          vx = w * 95 * p.depth + Math.sin(p.ph + t * p.sf) * p.sa * p.depth;
          p.x += vx * dt; p.y += (p.vy + Math.cos(p.ph + t * 1.3) * 8 * k) * dt;
          p.rot += (p.vr + vx * 0.012) * dt;
          if (p.y > H + p.size) { parts[i] = make(false); continue; }
        }
        if (p.x > W + p.size) p.x = -p.size; else if (p.x < -p.size) p.x = W + p.size;
      }
    }
    function wing(s) {
      ctx.beginPath(); ctx.moveTo(0, -2);
      ctx.bezierCurveTo(s * 0.35, -s * 0.6, s * 0.66, -s * 0.5, s * 0.5, -s * 0.1);
      ctx.bezierCurveTo(s * 0.45, 0, s * 0.18, 0.02 * s, 0, 0); ctx.closePath();
      var a = ctx.globalAlpha; ctx.globalAlpha = a * 0.22; ctx.fill(); ctx.globalAlpha = a; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 1);
      ctx.bezierCurveTo(s * 0.3, 0, s * 0.46, s * 0.2, s * 0.3, s * 0.34);
      ctx.bezierCurveTo(s * 0.14, s * 0.38, s * 0.04, s * 0.2, 0, s * 0.04); ctx.closePath();
      ctx.globalAlpha = a * 0.22; ctx.fill(); ctx.globalAlpha = a; ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.4, -s * 0.28, s * 0.035, 0, 6.3); ctx.globalAlpha = a * 0.8; ctx.fill(); ctx.globalAlpha = a;
    }
    function drawButterfly(p) {
      var flap = 0.22 + 0.78 * Math.abs(Math.sin(p.fp)), s = p.size;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0);
      ctx.globalAlpha = p.alpha; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.save(); ctx.scale(flap, 1); wing(s); ctx.scale(-1, 1); wing(s); ctx.restore();
      ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.lineTo(0, s * 0.26); ctx.stroke();
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.quadraticCurveTo(-s * 0.08, -s * 0.34, -s * 0.15, -s * 0.36);
      ctx.moveTo(0, -s * 0.2); ctx.quadraticCurveTo(s * 0.08, -s * 0.34, s * 0.15, -s * 0.36); ctx.stroke();
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (kind === 'butterflies') { drawButterfly(p); continue; }
        var im = imgs[p.s];
        if (!im || (im.complete === false) || im.naturalWidth === 0) continue;
        ctx.save();
        if (kind === 'motes') {
          ctx.globalAlpha = p.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * p.tw + p.ph)));
          ctx.drawImage(im, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0);
          if (kind === 'blossoms') {
            var c = Math.cos(p.fp + t * p.ff);
            ctx.scale((c < 0 ? -1 : 1) * Math.max(0.28, Math.abs(c)), 1);
          }
          ctx.drawImage(im, -p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }
    }
    function frame(ts) {
      if (!running) return;
      raf = root.requestAnimationFrame(frame);
      var dt = Math.min(0.05, (ts - last) / 1000); last = ts; t += dt;
      step(dt); draw();
    }
    function start() {
      if (running || reduce || dead || !onscreen || document.hidden) return;
      running = true; last = root.performance.now(); raf = root.requestAnimationFrame(frame);
    }
    function stop() { running = false; root.cancelAnimationFrame(raf); }

    buildSprites(); fit(); resizeParts();
    if (reduce) draw(); else start();

    var ro = root.ResizeObserver ? new root.ResizeObserver(fit) : null;
    if (ro) ro.observe(host);
    var io = root.IntersectionObserver ? new root.IntersectionObserver(function (e) {
      onscreen = e[0].isIntersecting; onscreen ? start() : stop();
    }) : null;
    if (io) io.observe(host);
    function vis() { document.hidden ? stop() : start(); }
    document.addEventListener('visibilitychange', vis);
    // recolour when the page switches between light and dark
    var mq = root.matchMedia ? root.matchMedia('(prefers-color-scheme: dark)') : null;
    function recolour() { if (!opts.color) buildSprites(); }
    if (mq && mq.addEventListener) mq.addEventListener('change', recolour);
    var mo = root.MutationObserver ? new root.MutationObserver(recolour) : null;
    if (mo) mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    var api = {
      recheck: function () {
        reduce = mqReduced() && !forced && !opts.force;
        if (reduce) { stop(); draw(); } else { start(); }
      },
      set: function (o) {
        var rebuild = false;
        if (o.kind && COUNTS[o.kind] && o.kind !== kind) { kind = o.kind; parts = []; rebuild = true; }
        if (o.wind && MODES[o.wind]) { mode = o.wind; if (!o.count) count = COUNTS[kind][mode]; }
        if (o.count) count = o.count; else if (rebuild) count = COUNTS[kind][mode];
        if (rebuild) buildSprites();
        resizeParts();
      },
      destroy: function () {
        dead = true; stop();
        if (ro) ro.disconnect(); if (io) io.disconnect(); if (mo) mo.disconnect();
        document.removeEventListener('visibilitychange', vis);
        if (mq && mq.removeEventListener) mq.removeEventListener('change', recolour);
        if (cv.parentNode) cv.parentNode.removeChild(cv);
        var ix = instances.indexOf(api); if (ix > -1) instances.splice(ix, 1);
      }
    };
    instances.push(api);
    return api;
  }
  // true when the visitor's device asks for reduced motion (and motion has not been forced on)
  DecorFall.reduced = function () { return mqReduced() && !forced; };
  // play motion even when the device asks for less, for example from a visible "Play anyway" button
  DecorFall.force = function (on) { forced = !!on; instances.slice().forEach(function (i) { i.recheck(); }); };
  root.DecorFall = DecorFall;
})(window);
