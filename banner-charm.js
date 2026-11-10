/* Banner charm: the chrome starburst floating above the title on each category banner (home page).
   Same behaviour as the hero chain: turns on its own, drag it and it turns with your hand,
   let go and it springs home with a small wobble. A drag never opens the category; a plain tap does.
   Injected from here (not the page template) so re-renders can't reload it. */
(function () {
  if (window.__bannerCharm) return; window.__bannerCharm = true;

  var css = [
    '.bc-pos{position:absolute;left:0;right:6.5%;bottom:calc(clamp(18px,3vw,40px) + clamp(40px,6.6vw,104px) * .46);height:60%;display:flex;justify-content:center;pointer-events:none;z-index:1}',
    'section[id] > a[href] > div:has(> h2){position:absolute;z-index:2;pointer-events:none}',
    '@media (max-width:767px){.bc-pos{height:52%}}',
    '.br{position:absolute;pointer-events:none;opacity:0;transition:opacity .9s ease;will-change:transform}',
    '.br.ready{opacity:1}',
    '.br-back{z-index:1}.br-front{z-index:3}',
    '.br model-viewer{width:100%;height:100%;pointer-events:none;background:transparent;--poster-color:transparent;--progress-bar-height:0px;--progress-mask:transparent}',
    '.bc{height:100%;aspect-ratio:1;pointer-events:auto;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;opacity:0;transition:opacity .9s ease;will-change:transform}',
    '.bc.ready{opacity:1}',
    '.bc.grab{cursor:grabbing}',
    '.bc-body{width:100%;height:100%;filter:drop-shadow(0 10px 16px rgba(0,0,0,.55))}',
    '.bc model-viewer{width:100%;height:100%;pointer-events:none;background:transparent;--poster-color:transparent;--progress-bar-height:0px;--progress-mask:transparent}'
  ].join('');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IDLE = reduce ? 0 : 60, PHI0 = 90, R = '112%', K = 62, C = 6.5;   // 60deg/s = the wardrobe models' turn
  // one model per banner, keyed by the section id; a banner with no entry gets no charm
  // at = where the charm's centre sits along the title, 0 = its left end, 1 = its right end (omit = the CSS default)
  // anim = the model's own baked animation (the controller's keys and sticks), played on loop
  var MODELS = {
    denim:   { src: 'assets/home-objects/starburst.glb' },
    hoodies: { src: 'assets/home-objects/controller.glb', at: 0.19, anim: true },
    // ring: a thorn ring worn by the title. It slides along the text, one half drawn behind the letters, one half in front
    't-shirts': { src: 'assets/home-objects/ring.glb', ring: true }
  };
  var items = [], suppressUntil = 0;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function build(banner, cfg) {
    var SRC = cfg.src;
    var pos = document.createElement('div'); pos.className = 'bc-pos'; pos.setAttribute('aria-hidden', 'true');
    pos.innerHTML = '<div class="bc"><div class="bc-body"><model-viewer src="' + SRC + '" alt="" camera-orbit="0deg ' + PHI0 + 'deg ' + R + '" orientation="0deg 0deg 0deg"' + (cfg.anim ? ' autoplay animation-name="keys"' : '') + ' field-of-view="30deg" exposure="1.25" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="lazy" interpolation-decay="20" disable-zoom disable-pan disable-tap></model-viewer></div></div>';
    banner.appendChild(pos);
    var el = pos.firstChild, mv = el.querySelector('model-viewer');
    var s = { at: cfg.at, banner: banner, el: el, mv: mv, x: 0, y: 0, vx: 0, vy: 0, theta: Math.random() * 360, phi: PHI0, spin: IDLE, tilt: 0, t: Math.random() * 6, drag: null, moved: false, visible: true };
    mv.addEventListener('load', function () { el.classList.add('ready'); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { s.visible = en[0].isIntersecting; }).observe(banner);
    }
    return s;
  }

  var rings = [];
  var RING_THETA = 56;     // camera swings round so the ring is seen as a narrow ellipse: near arc on one side, far arc on the other
  function buildRing(banner, cfg) {
    function layer(cls, clip) {
      var d = document.createElement('div'); d.className = 'br ' + cls; d.setAttribute('aria-hidden', 'true');
      d.style.clipPath = clip;
      d.innerHTML = '<model-viewer src="' + cfg.src + '" alt="" camera-orbit="' + RING_THETA + 'deg 90deg 100%" field-of-view="30deg" exposure="1.25" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="lazy" interpolation-decay="20" animation-name="spin" disable-zoom disable-pan disable-tap></model-viewer>';
      banner.appendChild(d); return d;
    }
    var back = layer('br-back', 'inset(0 0 0 50%)'), front = layer('br-front', 'inset(0 50% 0 0)');
    var r = { banner: banner, els: [back, front], mvs: [back.firstChild, front.firstChild], t: Math.random() * 10, visible: true, shown: false };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { r.visible = en[0].isIntersecting; }).observe(banner);
    return r;
  }
  function tickRings(dt) {
    rings.forEach(function (r) {
      if (!r.visible) return;
      r.t += dt;
      var h = r.banner.querySelector('h2'); if (!h) return;
      var b = r.banner.getBoundingClientRect(), t = h.getBoundingClientRect(); if (!b.width) return;
      var fs = parseFloat(getComputedStyle(h).fontSize) || 60, L = fs * 1.85;          // box side
      var span = t.width + fs * 0.9;                                                      // sweep a little past both ends
      var u = (reduce ? 0.5 : (r.t / 9) % 2); u = u > 1 ? 2 - u : u;                      // constant speed there and back
      u = u + 0.16 * (u * u * (3 - 2 * u) - u);                                           // soften only the turnarounds
      var cx = t.left - b.left + t.width / 2 - span / 2 + u * span, cy = t.top - b.top + t.height / 2 - fs * 0.34;
      r.els.forEach(function (el, i) {
        el.style.width = el.style.height = L.toFixed(1) + 'px';
        el.style.left = (cx - L / 2).toFixed(1) + 'px'; el.style.top = (cy - L / 2).toFixed(1) + 'px';
        var mv = r.mvs[i];
        mv.style.width = mv.style.height = L.toFixed(1) + 'px';   // explicit px: both halves must render at exactly the same size
        if (!r.shown && r.mvs[0].loaded && r.mvs[1].loaded) { r.shown = true; r.els.forEach(function (e) { e.classList.add('ready'); }); try { r.mvs.forEach(function (m) { m.play(); m.pause(); }); } catch (_) {} }
        if (r.shown) { try { mv.currentTime = reduce ? 0 : (r.t % 6); } catch (_) {} }
      });
    });
  }

  // (re)attach to every category banner, in case the page re-renders them
  function attach() {
    var banners = document.querySelectorAll('section[id] > a[href]');
    items = items.filter(function (s) { return document.body.contains(s.el); });
    rings = rings.filter(function (r) { return document.body.contains(r.els[0]); });
    Array.prototype.forEach.call(banners, function (b) {
      var sec = b.closest('section[id]'), src = sec && MODELS[sec.id]; if (!src) return;
      var h2 = b.querySelector('h2'); if (!h2) return;
      if (h2.parentElement) { h2.parentElement.style.zIndex = '2'; h2.parentElement.style.pointerEvents = 'none'; }
      if (src.ring) { if (!b.querySelector('.br')) { var r = buildRing(b, src); rings.push(r); } return; }
      if (!b.querySelector('.bc-pos')) items.push(build(b, src));
    });
  }
  function place() {   // centre the charm over a chosen point of the title
    items.forEach(function (s) {
      if (s.at == null) return;
      var h = s.banner.querySelector('h2'), pos = s.el.parentNode; if (!h || !pos) return;
      var b = s.banner.getBoundingClientRect(), t = h.getBoundingClientRect(); if (!b.width) return;
      var cx = t.left - b.left + t.width * s.at;
      pos.style.right = Math.max(0, b.width - 2 * cx) + 'px';
    });
  }
  setInterval(function () { attach(); place(); }, 600); attach(); place(); addEventListener('resize', place);

  function find(e) {
    var c = e.target.closest && e.target.closest('.bc'); if (!c) return null;
    for (var i = 0; i < items.length; i++) if (items[i].el === c) return items[i];
    return null;
  }
  document.addEventListener('pointerdown', function (e) {
    var s = find(e); if (!s) return;
    e.preventDefault();
    try { s.el.setPointerCapture(e.pointerId); } catch (_) {}
    var b = s.banner.getBoundingClientRect(), r = s.el.getBoundingClientRect();
    s.drag = { id: e.pointerId, px: e.clientX, py: e.clientY, sx: s.x, sy: s.y, tx: s.x, ty: s.y,
      x0: b.left - (r.left - s.x), x1: b.right - (r.right - s.x), y0: b.top - (r.top - s.y), y1: b.bottom - (r.bottom - s.y) };
    s.moved = false; s.el.classList.add('grab');
  });
  document.addEventListener('pointermove', function (e) {
    for (var i = 0; i < items.length; i++) {
      var s = items[i], d = s.drag; if (!d || e.pointerId !== d.id) continue;
      var dx = e.clientX - d.px, dy = e.clientY - d.py;
      if (Math.abs(dx) + Math.abs(dy) > 6) s.moved = true;
      d.tx = clamp(d.sx + dx, d.x0, d.x1); d.ty = clamp(d.sy + dy, d.y0, d.y1);
    }
  });
  function release(e) {
    items.forEach(function (s) {
      if (!s.drag || e.pointerId !== s.drag.id) return;
      s.drag = null; s.el.classList.remove('grab');
      s.spin = clamp(IDLE + s.vx * 0.9, -900, 900);       // a flick sends it spinning
      if (s.moved) suppressUntil = performance.now() + 400;
    });
  }
  document.addEventListener('pointerup', release);
  document.addEventListener('pointercancel', release);
  document.addEventListener('click', function (e) {       // a drag must not open the category
    if (performance.now() < suppressUntil && e.target.closest && e.target.closest('.bc')) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  var last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60; last = now;
    if (document.hidden) return;
    tickRings(dt);
    items.forEach(function (s) {
      if (!s.visible) return;
      if (!s.shown && s.mv.loaded) { s.shown = true; s.el.classList.add('ready'); }
      s.t += dt;
      var px = s.x, py = s.y, d = s.drag;
      if (d) {
        var f = 1 - Math.exp(-dt * 22);
        s.x += (d.tx - s.x) * f; s.y += (d.ty - s.y) * f;
        s.vx = (s.x - px) / dt; s.vy = (s.y - py) / dt;
        s.theta += (s.x - px) * 0.9;                      // moving it turns it
        s.phi += (clamp(PHI0 - s.vy * 0.05, 40, 120) - s.phi) * (1 - Math.exp(-dt * 8));
        s.spin = IDLE;
      } else {
        s.vx += (-K * s.x - C * s.vx) * dt; s.vy += (-K * s.y - C * s.vy) * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (Math.abs(s.x) < 0.05 && Math.abs(s.vx) < 0.5) { s.x = 0; s.vx = 0; }
        if (Math.abs(s.y) < 0.05 && Math.abs(s.vy) < 0.5) { s.y = 0; s.vy = 0; }
        var idle = IDLE * (1 + 0.35 * Math.sin(s.t * 0.5));
        s.spin = idle + (s.spin - idle) * Math.exp(-dt * 1.4);
        s.theta += s.spin * dt;
        s.phi += (PHI0 - s.phi) * (1 - Math.exp(-dt * 3));
      }
      s.tilt += (clamp(s.vx * 0.02, -28, 28) - s.tilt) * (1 - Math.exp(-dt * 10));
      s.el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,0)';
      var body = s.el.firstElementChild; if (body) body.style.transform = 'rotate(' + s.tilt.toFixed(2) + 'deg)';
      if (s.mv) {
        s.mv.cameraOrbit = (s.theta % 360).toFixed(1) + 'deg ' + s.phi.toFixed(1) + 'deg ' + R;
        // tumble: pitch and roll swing on their own slow, unrelated beats, so the spin never repeats the same pose
        var rx = reduce ? 0 : Math.sin(s.t * 0.9) * 34 + Math.sin(s.t * 0.37 + 1.3) * 14;
        var rz = reduce ? 0 : Math.sin(s.t * 0.62 + 2.1) * 28 + Math.sin(s.t * 1.15) * 8;
        s.mv.orientation = rx.toFixed(1) + 'deg 0deg ' + rz.toFixed(1) + 'deg';
      }
    });
  }
  requestAnimationFrame(frame);
})();
