/* Hero charm: a small 3D chrome chain floating on the hero.
   - Fixed size (never scales). Lives at a home spot.
   - Drag it anywhere inside the hero; it turns in 3D as you move it.
   - Let go: it springs back home with a small pendulum wobble and keeps the spin you flung it with,
     which slowly settles back to an idle turn.
   Markup lives in index.html (.hc); everything else is here. */
(function () {
  var css = [
    '.hs-hero{--hc-w:150px}',
    '.hc{position:absolute;z-index:1;left:0;top:0;width:var(--hc-w);height:calc(var(--hc-w) * 1.6);touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;opacity:0;transition:opacity 1.2s ease .8s;will-change:transform}',
    '.hs-hero.ready .hc{opacity:1}',
    '.hc.grab{cursor:grabbing}',
    '.hc-body{width:100%;height:100%;filter:drop-shadow(0 14px 20px rgba(0,0,0,.55))}',
    '.hc model-viewer{width:100%;height:100%;pointer-events:none;background:transparent;--poster-color:transparent;--progress-bar-height:0px;--progress-mask:transparent}',
    '@media (max-width:767px){.hs-hero{--hc-w:92px}}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IDLE = reduce ? 0 : 30;          // idle turn, deg/s (breathes faster/slower a little)
  var R = '100%';                      // camera distance: smaller = chain fills more of its box
  var PHI0 = 78;                       // resting camera pitch, deg
  var K = 62, C = 6.5;                 // spring stiffness / damping (underdamped = small wobble)

  var x = 0, y = 0, vx = 0, vy = 0;    // offset from home, px and px/s
  var theta = 0, phi = PHI0, spin = IDLE, tilt = 0, t = 0;
  var drag = null, last = 0, visible = true;

  function el() { return document.querySelector('.hc'); }

  // keep the charm inside the hero while dragging
  function limits(h) {
    var hero = h.closest('.hs-hero'); if (!hero) return null;
    var hr = hero.getBoundingClientRect(), r = h.getBoundingClientRect();
    var homeL = r.left - x - hr.left, homeT = r.top - y - hr.top;
    return { x0: -homeL, x1: hr.width - homeL - r.width, y0: -homeT + 64, y1: hr.height - homeT - r.height };
  }
  // home: a spot in the hero given as fractions of its width/height (centre of the charm)
  // gap = how far the box bottom sits below the headline top, as a share of the box height (the chain's ink ends above the box bottom)
  var HOME = { desk: { title: true, gap: -0.06, w: 150 }, phone: { title: true, gap: -0.24, w: 92 } };
  function place() {
    var h = el(); if (!h || drag) return;
    var hero = h.closest('.hs-hero'); if (!hero) return;
    var c = window.__hc || (innerWidth < 768 ? HOME.phone : HOME.desk);
    hero.style.setProperty('--hc-w', c.w + 'px');
    var W = hero.clientWidth, H = hero.clientHeight, w = h.offsetWidth, hh = h.offsetHeight, cx, top;
    var tt = c.title && document.querySelector('.hs-title');
    if (tt) {                                        // centred above the headline, like an emblem
      var tr = tt.getBoundingClientRect(), hr = hero.getBoundingClientRect();
      cx = tr.left + tr.width / 2 - hr.left; top = tr.top - hr.top - hh * (1 - c.gap);
    } else { cx = c.fx * W; top = c.fy * H - hh / 2; }
    h.style.left = Math.round(cx - w / 2) + 'px'; h.style.top = Math.round(top) + 'px';
  }
  setInterval(place, 400); addEventListener('resize', place);
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  document.addEventListener('pointerdown', function (e) {
    var h = e.target.closest && e.target.closest('.hc'); if (!h) return;
    e.preventDefault();
    try { h.setPointerCapture(e.pointerId); } catch (_) {}
    drag = { id: e.pointerId, px: e.clientX, py: e.clientY, sx: x, sy: y, tx: x, ty: y, lim: limits(h) };
    h.classList.add('grab');
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var l = drag.lim, tx = drag.sx + e.clientX - drag.px, ty = drag.sy + e.clientY - drag.py;
    if (l) { tx = clamp(tx, l.x0, l.x1); ty = clamp(ty, l.y0, l.y1); }
    drag.tx = tx; drag.ty = ty;
  });
  function release(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    drag = null;
    var h = el(); if (h) h.classList.remove('grab');
    spin = clamp(IDLE + vx * 0.9, -900, 900);      // a flick sends it spinning
  }
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);

  if ('IntersectionObserver' in window) {
    var io = null;
    setInterval(function () {                       // (re)attach if the hero is re-rendered
      var hero = document.querySelector('.hs-hero');
      if (!hero || (io && io.target === hero)) return;
      if (io) io.obs.disconnect();
      var o = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; });
      o.observe(hero); io = { obs: o, target: hero };
    }, 500);
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60; last = now;
    var h = el(); if (!h || !visible || document.hidden) return;
    t += dt;
    var px = x, py = y;
    if (drag) {
      var f = 1 - Math.exp(-dt * 22);               // a little weight behind the finger
      x += (drag.tx - x) * f; y += (drag.ty - y) * f;
      vx = (x - px) / dt; vy = (y - py) / dt;
      theta += (x - px) * 0.9;                      // moving it turns it, like rolling it in your hand
      phi += (clamp(PHI0 - vy * 0.05, 40, 120) - phi) * (1 - Math.exp(-dt * 8));
      spin = IDLE;
    } else {
      vx += (-K * x - C * vx) * dt; vy += (-K * y - C * vy) * dt;
      x += vx * dt; y += vy * dt;
      if (Math.abs(x) < 0.05 && Math.abs(vx) < 0.5) { x = 0; vx = 0; }
      if (Math.abs(y) < 0.05 && Math.abs(vy) < 0.5) { y = 0; vy = 0; }
      var idle = IDLE * (1 + 0.35 * Math.sin(t * 0.5));            // swirl: spin speed breathes
      spin = idle + (spin - idle) * Math.exp(-dt * 1.4);
      theta += spin * dt;
      var nod = reduce ? 0 : Math.sin(t * 0.9) * 12;                 // swirl: slow nod, like a hanging charm
      phi += (PHI0 + nod - phi) * (1 - Math.exp(-dt * 3));
    }
    var sway = (drag || reduce) ? 0 : Math.sin(t * 1.1) * 5;            // swirl: gentle side sway
    tilt += (clamp(vx * 0.02, -28, 28) + sway - tilt) * (1 - Math.exp(-dt * 10));   // swings with the motion
    var bob = (drag || reduce) ? 0 : Math.sin(t * 1.3) * 7;
    h.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (y + bob).toFixed(1) + 'px,0)';
    var b = h.firstElementChild; if (b) b.style.transform = 'rotate(' + tilt.toFixed(2) + 'deg)';
    var mv = h.querySelector('model-viewer');
    if (mv) mv.cameraOrbit = (theta % 360).toFixed(1) + 'deg ' + phi.toFixed(1) + 'deg ' + R;
  }
  requestAnimationFrame(frame);
})();
