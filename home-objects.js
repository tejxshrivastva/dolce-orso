/* =====================================================================
   DOLCE ORSO - HOME PAGE "SHOP BY CATEGORY" OBJECT CANVAS
   Four product cut-outs floating on white. Each one slowly spins on its own axis,
   showing its front and its back. Click one to open its category.

   Jeans, hoodie and jacket are flat photos (<category>-front.webp / -back.webp) turned in 3D space.
   The T-shirt is a real 3D model (assets/home-objects/t-shirts.glb) shown with Google's model-viewer;
   the flat photos stay as a fallback if the viewer can't load.
   Always turning at a constant speed; hover freezes it; drag turns it; let go and it spins on again.
   Spin speed: change SPEED below (the 6000 = milliseconds per full turn).
   ===================================================================== */
(function () {
  var css = [
    '.dco-section{margin:clamp(60px,10vw,120px) 0;padding:0 clamp(8px,1vw,16px)}',
    '.dco-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin-bottom:clamp(8px,2vw,24px)}',
    '.dco-eyebrow{display:block;margin-bottom:8px;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#888}',
    '.dco-title{margin:0;font-size:clamp(28px,3.5vw,48px);font-weight:500;letter-spacing:-.04em;line-height:1.05}',
    '.dco-all{font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#000;border-bottom:1px solid #000;padding-bottom:4px;white-space:nowrap;text-decoration:none}',
    '.dco-all:hover{color:#555;border-color:#555}',
    '.dco-stage{position:relative;width:100%;aspect-ratio:16/8.4;max-height:920px;background:#fff}',
    '.dco-item{position:absolute;left:var(--x);top:var(--y);width:var(--w);transform:translate(-50%,-50%);display:block;touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;text-decoration:none;color:#000;-webkit-tap-highlight-color:transparent;outline-offset:8px}',
    '.dco-float{position:relative;display:block;perspective:1400px;animation:dcoFloat 6.5s ease-in-out infinite;animation-delay:var(--d,0s)}',
    '.dco-spin{position:relative;display:block;width:100%;aspect-ratio:var(--ar);transform-style:preserve-3d;transition:scale .5s cubic-bezier(.22,1,.36,1)}',
    '.dco-item:hover .dco-spin,.dco-item:focus-visible .dco-spin{scale:1.07}',
    '.dco-face{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;backface-visibility:hidden;-webkit-backface-visibility:hidden;user-select:none;-webkit-user-drag:none}',
    '.dco-back{transform:rotateY(180deg)}',
    '.dco-3d model-viewer{position:absolute;inset:-14%;width:128%;height:128%;--poster-color:transparent;--progress-bar-color:transparent;--progress-bar-height:0px;background:transparent;pointer-events:none}',
    '.dco-shadow{position:absolute;left:12%;right:12%;bottom:-3%;height:7%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(0,0,0,.22),rgba(0,0,0,0) 70%);filter:blur(6px);pointer-events:none}',
    '.dco-label{position:absolute;left:50%;top:100%;transform:translate(-50%,10px);margin-top:10px;display:flex;flex-direction:column;align-items:center;gap:6px;white-space:nowrap;font:500 clamp(15px,1.5vw,22px)/1 "Inter",sans-serif;letter-spacing:-.02em}',
    '.dco-3d ~ .dco-label{margin-top:clamp(14px,2.4vw,34px)}',
    '.dco-label i{font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.1em;color:#888;font-style:normal}',
    '.dco-label b{font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;opacity:0;transition:opacity .35s ease}',
    '.dco-item:hover .dco-label b,.dco-item:focus-visible .dco-label b{opacity:1}',
    '.dco-hint{margin:clamp(40px,5vw,72px) 0 0;text-align:center;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#888}',
    '@keyframes dcoFloat{0%,100%{transform:translateY(0) rotate(var(--r0,-1.5deg))}50%{transform:translateY(-12px) rotate(var(--r1,1.5deg))}}',
    '@media (max-width:767px){',
    '.dco-stage{display:grid;grid-template-columns:1fr 1fr;gap:20px 8px;aspect-ratio:auto;max-height:none;padding:16px 4px 56px}',
    '.dco-item{position:relative;left:auto;top:auto;width:auto;transform:none;padding:0 6%}',
    '.dco-item:nth-child(even){margin-top:56px}',
    '.dco-label b{opacity:1}',
    '}',
    '@media (prefers-reduced-motion:reduce){.dco-float{animation:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- the spin ----
  // Every object turns on its vertical axis at one constant speed, no gaps.
  // Hover = it freezes where it is. Drag = it turns with your finger/mouse (with a little momentum).
  // Let go and move away = it carries on spinning from wherever it stopped.
  var SPEED = 360 / 6000;                  // degrees per ms  (360 / 6000 = one full turn every 6 seconds)
  var DRAG = 0.45;                         // degrees turned per pixel dragged
  var still = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var canHover = !!(window.matchMedia && matchMedia('(hover: hover)').matches);
  var states = new WeakMap(), drag = null, moved = false, last = performance.now();

  // if the 3D viewer script can't load (offline, blocked), fall back to the flat photos
  function fallback3d() {
    var v = document.querySelectorAll('.dco-3d');
    for (var i = 0; i < v.length; i++) {
      if (customElements.get('model-viewer') && v[i].firstElementChild.loaded !== false) continue;
      v[i].style.display = 'none'; var f = v[i].parentNode.querySelector('.dco-2d'); if (f) f.style.display = '';
    }
  }
  setTimeout(fallback3d, 9000);
  document.addEventListener('error', function (e) { if (e.target && e.target.tagName === 'MODEL-VIEWER') fallback3d(); }, true);

  function state(el) {
    var s = states.get(el);
    if (!s) { s = { a: 0, hov: false, vel: 0 }; states.set(el, s); }
    return s;
  }
  function spinOf(item) { return item && item.querySelector('.dco-spin:not([style*="display: none"])'); }
  function apply(el, a) {
    var mv = el.firstElementChild;
    if (mv && mv.tagName === 'MODEL-VIEWER') mv.cameraOrbit = (-a).toFixed(2) + 'deg 90deg 105%';
    else el.style.transform = 'rotateY(' + a.toFixed(2) + 'deg)';
  }
  function frame(now) {
    var dt = Math.min(now - last, 50); last = now;
    var spins = document.querySelectorAll('.dco-spin');
    for (var i = 0; i < spins.length; i++) {
      var el = spins[i], s = state(el);
      if (!(drag && drag.spin === el)) {
        if (!s.hov && !still) s.a += SPEED * dt;
        s.a += s.vel * dt;                       // momentum left over from a drag
        s.vel *= Math.exp(-dt / 300);
        if (Math.abs(s.vel) < 0.001) s.vel = 0;
      }
      apply(el, s.a);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if (canHover) {
    document.addEventListener('mouseover', function (e) {
      var item = e.target.closest && e.target.closest('.dco-item'), sp = spinOf(item); if (sp) state(sp).hov = true;
    });
    document.addEventListener('mouseout', function (e) {
      var item = e.target.closest && e.target.closest('.dco-item'); if (!item) return;
      var to = e.relatedTarget; if (to && to.closest && to.closest('.dco-item') === item) return;
      var sp = spinOf(item); if (sp) state(sp).hov = false;
    });
  }

  // drag to turn
  document.addEventListener('dragstart', function (e) { if (e.target.closest && e.target.closest('.dco-item')) e.preventDefault(); });
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var item = e.target.closest && e.target.closest('.dco-item'), sp = spinOf(item); if (!sp) return;
    drag = { item: item, spin: sp, id: e.pointerId, x: e.clientX, t: e.timeStamp, total: 0 };
    moved = false; state(sp).vel = 0;
    try { item.setPointerCapture(e.pointerId); } catch (err) {}
  });
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dtm = Math.max(e.timeStamp - drag.t, 1), s = state(drag.spin);
    drag.total += Math.abs(dx); if (drag.total > 5) moved = true;
    var da = dx * DRAG; s.a += da;
    s.vel = Math.max(-0.5, Math.min(0.5, s.vel * .6 + (da / dtm) * .4));
    drag.x = e.clientX; drag.t = e.timeStamp;
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var item = drag.item, s = state(drag.spin);
    if (e.timeStamp - drag.t > 80) s.vel = 0;     // held still before letting go: no throw
    if (canHover) s.hov = item.matches(':hover');
    drag = null;
  }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  // a drag must not count as a click on the category link
  document.addEventListener('click', function (e) {
    if (moved && e.target.closest && e.target.closest('.dco-item')) { e.preventDefault(); e.stopPropagation(); }
    moved = false;
  }, true);
})();
