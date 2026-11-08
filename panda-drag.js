/* Footer object (was the panda, then a rose, now a 3D silver tribal blade) on the big "Dolce Orso" wordmark.
   - Drag it anywhere; let go and it springs back.
   - Turns on its own axis at the hero chain's speed; a flick spins it faster, then it settles back.
   - Hover gives a gentle sway.
   Markup: [data-slot="footer-panda"] wrapper with a <model-viewer> inside (every page's footer). */
(function () {
  if (window.__pandaDrag) return; window.__pandaDrag = true;

  var css =
    '.do-rose{--rw:clamp(120px,20vw,330px);--rh:1.9;--tx:clamp(52px,15.2vw,276px);width:var(--rw);height:calc(var(--rw) * var(--rh));margin-bottom:calc(-1 * (var(--tx) + var(--rw) * var(--rh) * .05));left:clamp(14px,3vw,52px);top:calc(var(--rw) * var(--rh) * -.1);' +
    'position:relative;z-index:1;user-select:none;-webkit-user-select:none;touch-action:none;cursor:grab;-webkit-tap-highlight-color:transparent;' +
    'filter:drop-shadow(0 18px 30px rgba(0,0,0,.5))}' +
    '.do-rose model-viewer{width:100%;height:100%;pointer-events:none;background:transparent;--poster-color:transparent;--progress-bar-height:0px;--progress-mask:transparent}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var el = null, sx = 0, sy = 0, dx = 0, dy = 0, lastX = 0, vx = 0;
  var SPRING = 'transform 0.9s cubic-bezier(.34,1.56,.64,1)';
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest && e.target.closest('[data-slot="footer-panda"]');
    if (!t) return;
    e.preventDefault();
    el = t; sx = e.clientX; sy = e.clientY; lastX = e.clientX; vx = 0;
    el.style.transition = 'transform 0.12s ease';
    el.style.cursor = 'grabbing';
    el.style.transform = 'scale(1.04) rotate(-3deg)';
  });
  window.addEventListener('pointermove', function (e) {
    if (!el) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    var step = e.clientX - lastX;
    vx = vx * 0.7 + step * 0.3; lastX = e.clientX;
    theta += step * 0.8;                                   // moving it turns it
    var rot = Math.max(-18, Math.min(18, vx * 1.2));
    el.style.transition = 'none';
    el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(1.04)';
  });
  function end() {
    if (!el) return;
    var t = el; el = null;
    spin = Math.max(-900, Math.min(900, IDLE + vx * 40));   // a flick sends it spinning
    t.style.transition = SPRING;
    t.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
    t.style.cursor = 'grab';
  }
  var hov = null, jig = null;
  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest && e.target.closest('[data-slot="footer-panda"]');
    if (!t || t === hov || el) return;
    hov = t;
    if (jig) jig.cancel();
    t.style.transformOrigin = '50% 100%';
    jig = t.animate([
      { translate: '0 0', scale: '1 1', rotate: '0deg' },
      { translate: '0 -3px', scale: '1.012 1.012', rotate: '-1.2deg', offset: 0.25 },
      { translate: '0 0', scale: '1 1', rotate: '0deg', offset: 0.5 },
      { translate: '0 -3px', scale: '1.012 1.012', rotate: '1.2deg', offset: 0.75 },
      { translate: '0 0', scale: '1 1', rotate: '0deg' }
    ], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' });
  });
  document.addEventListener('pointerout', function (e) {
    if (!hov) return;
    var to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-slot="footer-panda"]');
    if (to !== hov) { var t = hov; hov = null; if (jig) { var cs = getComputedStyle(t); var from = { translate: cs.translate, scale: cs.scale, rotate: cs.rotate }; jig.cancel(); jig = t.animate([from, { translate: '0 0', scale: '1 1', rotate: '0deg' }], { duration: 700, easing: 'ease-out' }); } }
  });
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);

  // slow turn, only while the footer is on screen
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IDLE = reduce ? 0 : 30, theta = 0, spin = IDLE, last = 0, t0 = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016; last = now;
    var w = document.querySelector('[data-slot="footer-panda"]'); if (!w || document.hidden) return;
    var r = w.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    t0 += dt;
    var idle = IDLE * (1 + 0.35 * Math.sin(t0 * 0.5));          // same turn as the hero chain (30deg/s, breathing)
    spin = idle + (spin - idle) * Math.exp(-dt * 1.4);
    if (!el) theta += spin * dt;
    var mv = w.querySelector('model-viewer');
    var nod = reduce ? 0 : Math.sin(t0 * 0.9) * 5;
    if (mv) mv.cameraOrbit = (theta % 360).toFixed(1) + 'deg ' + (90 + nod).toFixed(1) + 'deg 100%';
  }
  requestAnimationFrame(frame);
})();
