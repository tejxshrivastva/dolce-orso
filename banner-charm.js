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
    '.bc-pos.bc-crown{height:40%;bottom:calc(clamp(20px,3.4vw,60px) + clamp(40px,6.6vw,104px) * .98)}',
    '.bc-pos.bc-king{height:64%;bottom:calc(clamp(20px,3.4vw,60px) + clamp(40px,6.6vw,104px) * .5 - 6%)}',
    '@media (max-width:767px){.bc-pos.bc-king{height:52%}}',
    '@media (max-width:767px){.bc-pos.bc-crown{height:30%;bottom:calc(clamp(20px,3.4vw,60px) + clamp(40px,6.6vw,104px) * .74)}}',
    '.br{position:absolute;pointer-events:none;opacity:0;transition:opacity .9s ease;will-change:transform}',
    '.br.ready{opacity:1}',
    '.br{z-index:3}',
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
    // crown: sits centred on the title like it is wearing it, turns on the vertical axis only
    // king: stands behind the title, floats, turns slowly, and every 7s does a quick 'checkmate' pirouette with a little rise
    jackets: { src: 'assets/home-objects/king.glb', at: 0.5, spinOnly: true, phi: 84, cls: 'bc-king', before: true, motion: 'king', idle: 36 },
    hoodies: { src: 'assets/home-objects/crown.glb', at: 0.5, spinOnly: true, phi: 76, cls: 'bc-crown', before: true },
    // ring: a thorn ring worn by the title. It slides along the text, one half drawn behind the letters, one half in front
    't-shirts': { src: 'assets/home-objects/ring.glb', ring: true }
  };
  var items = [], suppressUntil = 0;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function build(banner, cfg) {
    var SRC = cfg.src;
    var pos = document.createElement('div'); pos.className = 'bc-pos' + (cfg.cls ? ' ' + cfg.cls : ''); pos.setAttribute('aria-hidden', 'true');
    pos.innerHTML = '<div class="bc"><div class="bc-body"><model-viewer src="' + SRC + '" alt="" camera-orbit="0deg ' + (cfg.phi || PHI0) + 'deg ' + R + '" orientation="0deg 0deg 0deg"' + (cfg.anim ? ' autoplay animation-name="keys"' : '') + ' field-of-view="30deg" exposure="1.25" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="lazy" interpolation-decay="20" disable-zoom disable-pan disable-tap></model-viewer></div></div>';
    // before = keep the real title the banner's last child (the page's banner rules style div:last-child;
    // appending makes those rules pad and centre the charm box instead). Denim keeps its approved, appended layout.
    var tb = title(banner) && title(banner).parentElement;
    if (cfg.before && tb) banner.insertBefore(pos, tb); else banner.appendChild(pos);
    var el = pos.firstChild, mv = el.querySelector('model-viewer');
    var s = { motion: cfg.motion, idle0: cfg.idle, at: cfg.at, spinOnly: cfg.spinOnly, phi0: cfg.phi || PHI0, banner: banner, el: el, mv: mv, x: 0, y: 0, vx: 0, vy: 0, theta: Math.random() * 360, phi: cfg.phi || PHI0, spin: cfg.idle || IDLE, tilt: 0, t: Math.random() * 6, drag: null, moved: false, visible: true };
    mv.addEventListener('load', function () { el.classList.add('ready'); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { s.visible = en[0].isIntersecting; }).observe(banner);
    }
    return s;
  }

  var rings = [];
  var RING_THETA = 56;     // camera swings round so the ring is seen as an open ellipse: near arc on the left, far arc on the right
  // the real title (the ring adds a copy of it, marked data-ghost)
  function title(b) { return b.querySelector('h2:not([data-ghost])'); }
  /* One ring, drawn ABOVE the title. A copy of the title is laid over it, cut to the ring's right half,
     so the far arc disappears behind the letters while the near arc stays in front.
     (One renderer only: two half-rings from two viewers never matched exactly.) */
  function buildRing(banner, cfg) {
    var h = title(banner), box = h.parentElement;
    var el = document.createElement('div'); el.className = 'br'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<model-viewer src="' + cfg.src + '" alt="" camera-orbit="' + RING_THETA + 'deg 90deg 100%" field-of-view="30deg" exposure="1.25" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="lazy" autoplay animation-name="spin" disable-zoom disable-pan disable-tap></model-viewer>';
    var ghost = box.cloneNode(true); ghost.setAttribute('aria-hidden', 'true'); ghost.classList.add('br-ghost');
    var gh = ghost.querySelector('h2'); gh.setAttribute('data-ghost', ''); gh.style.setProperty('text-shadow', 'none', 'important');
    ghost.style.zIndex = '4'; ghost.style.pointerEvents = 'none'; ghost.style.clipPath = 'inset(0 0 100% 0)';
    banner.insertBefore(el, box); banner.insertBefore(ghost, box);   // the real title stays the banner's last child
    var r = { banner: banner, el: el, mv: el.firstChild, ghost: ghost, t: Math.random() * 10, visible: true };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { r.visible = en[0].isIntersecting; }).observe(banner);
    return r;
  }
  // the copy is not the banner's last child, so the page's banner rules miss it: copy the real title's live layout onto it
  function syncGhost(r) {
    var h = title(r.banner); if (!h) return;
    var cb = getComputedStyle(h.parentElement), ch = getComputedStyle(h), gh = r.ghost.querySelector('h2');
    ['padding', 'gap', 'align-items', 'justify-content', 'text-align'].forEach(function (p) { r.ghost.style.setProperty(p, cb.getPropertyValue(p), 'important'); });
    ['font-size', 'font-weight', 'letter-spacing', 'word-spacing', 'line-height', 'text-transform', 'text-indent', 'font-family'].forEach(function (p) { gh.style.setProperty(p, ch.getPropertyValue(p), 'important'); });
  }
  function tickRings(dt) {
    rings.forEach(function (r) {
      if (!r.visible) return;
      r.t += dt;
      var now = performance.now();
      if (!r.geo || now - r.geoAt > 500) {                // layout reads are expensive: cache them
        var h = title(r.banner); if (!h) return;
        var bb = r.banner.getBoundingClientRect(), tb = h.getBoundingClientRect(), gb = r.ghost.getBoundingClientRect(); if (!bb.width) return;
        r.geo = { b: { left: 0, top: 0 }, t: { left: tb.left - bb.left, top: tb.top - bb.top, width: tb.width, height: tb.height },
                  g: { left: gb.left - bb.left, top: gb.top - bb.top, width: gb.width, height: gb.height }, fs: parseFloat(getComputedStyle(h).fontSize) || 60 };
        r.geoAt = now;
      }
      var b = r.geo.b, t = r.geo.t;
      var fs = r.geo.fs, L = fs * 2.25;          // box side
      var span = t.width + fs * 0.9;                                                      // sweep a little past both ends
      var u = (reduce ? 0.5 : (r.t / 9) % 2); u = u > 1 ? 2 - u : u;                      // constant speed there and back
      u = u + 0.16 * (u * u * (3 - 2 * u) - u);                                           // soften only the turnarounds
      var cx = t.left - b.left + t.width / 2 - span / 2 + u * span, cy = t.top - b.top + t.height / 2 - fs * 0.34;
      if (r.L !== L) {                                    // size: only when it changes (avoids a layout pass every frame)
        var Lp = L.toFixed(1) + 'px'; r.L = L;
        r.el.style.width = r.el.style.height = Lp; r.mv.style.width = r.mv.style.height = Lp; r.el.style.left = r.el.style.top = '0px';
      }
      r.el.style.transform = 'translate3d(' + (cx - L / 2).toFixed(1) + 'px,' + (cy - L / 2).toFixed(1) + 'px,0)';   // move on the GPU
      // the copied title shows only over the ring's right (far) half
      var g = r.geo.g, gx = cx - g.left, gy = cy - g.top;
      r.ghost.style.clipPath = 'inset(' + Math.max(0, gy - L / 2).toFixed(1) + 'px ' + Math.max(0, g.width - gx - L / 2).toFixed(1) + 'px ' +
        Math.max(0, g.height - gy - L / 2).toFixed(1) + 'px ' + Math.max(0, gx).toFixed(1) + 'px)';
      if (!r.shown && r.mv.loaded) { r.shown = true; r.el.classList.add('ready'); }
    });
  }

  // (re)attach to every category banner, in case the page re-renders them
  function attach() {
    var banners = document.querySelectorAll('section[id] > a[href]');
    items = items.filter(function (s) { return document.body.contains(s.el); });
    rings = rings.filter(function (r) {
      if (document.body.contains(r.el) && document.body.contains(r.ghost)) return true;
      if (r.el.parentNode) r.el.remove(); if (r.ghost.parentNode) r.ghost.remove(); return false;
    });
    Array.prototype.forEach.call(banners, function (b) {
      var sec = b.closest('section[id]'), src = sec && MODELS[sec.id]; if (!src) return;
      var h2 = title(b); if (!h2) return;
      if (h2.parentElement) { h2.parentElement.style.zIndex = '2'; h2.parentElement.style.pointerEvents = 'none'; }
      if (src.ring) { if (!b.querySelector('.br')) { var r = buildRing(b, src); rings.push(r); } rings.forEach(syncGhost); return; }
      if (!b.querySelector('.bc-pos')) items.push(build(b, src));
    });
  }
  function place() {   // centre the charm over a chosen point of the title
    items.forEach(function (s) {
      if (s.at == null) return;
      var h = title(s.banner), pos = s.el.parentNode; if (!h || !pos) return;
      var b = s.banner.getBoundingClientRect(), t = h.getBoundingClientRect(); if (!b.width) return;
      var cx = t.left - b.left + t.width * s.at;
      s.bh = s.el.offsetHeight;
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

  // while the page is scrolling, 3D objects hold still: no re-render per frame, so scrolling stays smooth
  var lastScroll = 0; addEventListener('scroll', function () { lastScroll = performance.now(); }, { passive: true });
  function scrolling() { return performance.now() - lastScroll < 220; }
  var last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60; last = now;
    if (document.hidden) return;
    var anyDrag = items.some(function (s) { return s.drag; });
    if (scrolling() && !anyDrag) { rings.forEach(function (r) { if (r.mv && !r.mv.paused) { r.mv.pause(); r.held = true; } }); return; }
    rings.forEach(function (r) { if (r.held) { r.held = false; try { r.mv.play(); } catch (e) {} } });
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
        s.phi += (clamp(s.phi0 - s.vy * 0.05, 40, 120) - s.phi) * (1 - Math.exp(-dt * 8));
        s.spin = reduce ? 0 : (s.idle0 || IDLE);
      } else {
        s.vx += (-K * s.x - C * s.vx) * dt; s.vy += (-K * s.y - C * s.vy) * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (Math.abs(s.x) < 0.05 && Math.abs(s.vx) < 0.5) { s.x = 0; s.vx = 0; }
        if (Math.abs(s.y) < 0.05 && Math.abs(s.vy) < 0.5) { s.y = 0; s.vy = 0; }
        var idle = (reduce ? 0 : (s.idle0 || IDLE)) * (1 + 0.35 * Math.sin(s.t * 0.5));
        s.spin = idle + (s.spin - idle) * Math.exp(-dt * 1.4);
        s.theta += s.spin * dt;
        s.phi += (s.phi0 - s.phi) * (1 - Math.exp(-dt * 3));
      }
      s.tilt += (clamp(s.vx * 0.02, -28, 28) - s.tilt) * (1 - Math.exp(-dt * 10));
      // king: levitate + sway, and a 1.2s pirouette with a small rise every 7s
      var fl = 0, lift = 0, sway = 0, lean = 0;
      if (s.motion === 'king' && !reduce) {
        var bh = s.bh || 200, u = s.t % 7, p = clamp((u - 5.6) / 1.2, 0, 1);
        var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;          // ease in-out
        fl = 360 * e;                                                              // the pirouette
        lift = -bh * (0.045 * Math.sin(s.t * 2.2) + 0.07 * Math.sin(Math.PI * p));  // float + rise during the spin
        sway = 3.5 * Math.sin(s.t * 1.15);
        lean = -10 * Math.sin(Math.PI * p);
      }
      s.el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + (s.y + lift).toFixed(1) + 'px,0)';
      var body = s.el.firstElementChild; if (body) body.style.transform = 'rotate(' + (s.tilt + sway).toFixed(2) + 'deg)';
      if (s.mv) {
        s.mv.cameraOrbit = ((s.theta + fl) % 360).toFixed(1) + 'deg ' + (s.phi + lean).toFixed(1) + 'deg ' + R;
        // tumble: pitch and roll swing on their own slow, unrelated beats, so the spin never repeats the same pose
        var rx = (reduce || s.spinOnly) ? 0 : Math.sin(s.t * 0.9) * 34 + Math.sin(s.t * 0.37 + 1.3) * 14;
        var rz = (reduce || s.spinOnly) ? 0 : Math.sin(s.t * 0.62 + 2.1) * 28 + Math.sin(s.t * 1.15) * 8;
        s.mv.orientation = rx.toFixed(1) + 'deg 0deg ' + rz.toFixed(1) + 'deg';
      }
    });
  }
  requestAnimationFrame(frame);
})();
