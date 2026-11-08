/* =====================================================================
   DOLCE ORSO - HOME PAGE "SHOP BY CATEGORY" OBJECT CANVAS
   Four product cut-outs floating on white. Each one slowly spins on its own axis,
   showing its front and its back. Click one to open its category.

   Jeans, hoodie and jacket are flat photos (<category>-front.webp / -back.webp) turned in 3D space.
   The T-shirt is a real 3D model (assets/home-objects/t-shirts.glb) shown with Google's model-viewer;
   the flat photos stay as a fallback if the viewer can't load.
   Always turning at a constant speed (hover does NOT stop it); drag turns it; let go and it spins on again.
   Spin speed: change SPEED below (the 6000 = milliseconds per full turn).
   ===================================================================== */
(function () {
  var css = [
    '.dco-section{position:relative;overflow:hidden;border-radius:clamp(22px,3vw,44px);margin:clamp(40px,6vw,80px) 0 0;padding:clamp(56px,7vw,104px) 0 clamp(44px,5vw,80px);background:radial-gradient(120% 90% at 50% 0%,#1a1a1a 0%,#0b0b0b 55%,#000 100%)}',
    '.dco-section::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.022) 0 1px,transparent 1px 4px);pointer-events:none}',
    '.dco-mark{position:absolute;left:0;right:0;top:50%;transform:translateY(-46%);text-align:center;white-space:nowrap;padding-right:.06em;font:600 clamp(40px,15.4vw,420px)/1 "Inter",sans-serif;letter-spacing:-.06em;color:transparent;background:linear-gradient(180deg,rgba(255,255,255,.13) 0%,rgba(255,255,255,.02) 85%);-webkit-background-clip:text;background-clip:text;pointer-events:none;user-select:none}',
    '.dco-head{position:relative;display:flex;align-items:flex-end;justify-content:center;text-align:center;gap:24px;flex-wrap:wrap;padding:0 clamp(16px,3vw,48px);margin-bottom:clamp(8px,2vw,28px)}',
    '.dco-eyebrow{display:flex;align-items:center;gap:10px;margin-bottom:12px;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#8d8d8d}',
    '.dco-eyebrow s{display:block;width:7px;height:7px;border-radius:50%;background:#000}',
    '.dco-title{margin:0;white-space:nowrap;font-size:clamp(14px,4.7vw,52px);font-weight:500;letter-spacing:-.04em;line-height:1.05;color:#fff}',
    '.dco-all{font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#fff;background:#0d0d0d;padding:14px 20px;border-radius:99px;white-space:nowrap;text-decoration:none;transition:background .3s,transform .3s}',
    '.dco-all u{text-decoration:none;display:inline-block;transition:transform .3s}',
    '.dco-all:hover{background:#333}.dco-all:hover u{transform:translateX(4px)}',
    '.dco-stage{position:relative;display:grid;grid-template-columns:repeat(4,1fr);width:100%;margin-top:clamp(8px,2vw,24px)}',
    '.dco-item{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:clamp(12px,2vw,28px) 0 clamp(18px,2vw,30px);touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:grab;text-decoration:none;color:#fff;-webkit-tap-highlight-color:transparent;outline-offset:-6px}',
    '.dco-item+.dco-item{border-left:1px solid rgba(255,255,255,.14)}',
    '.dco-spot{position:absolute;left:50%;top:clamp(12px,2vw,28px);width:92%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.30),rgba(255,255,255,.11) 55%,rgba(255,255,255,0));opacity:.9;transition:opacity .5s,transform .6s cubic-bezier(.22,1,.36,1);pointer-events:none}',
    '.dco-item:hover .dco-spot,.dco-item:focus-visible .dco-spot{opacity:1;transform:translateX(-50%) scale(1.08)}',
    '.dco-float{position:relative;display:block;width:92%;aspect-ratio:1;animation:dcoFloat 6.5s ease-in-out infinite;animation-delay:var(--d,0s)}',
    '.dco-spin{position:absolute;inset:0;display:block;perspective:1400px;transform-style:preserve-3d;transition:scale .5s cubic-bezier(.22,1,.36,1)}',
    '.dco-item:hover .dco-spin,.dco-item:focus-visible .dco-spin{scale:1.05}',
    '.dco-face{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;backface-visibility:hidden;-webkit-backface-visibility:hidden;user-select:none;-webkit-user-drag:none}',
    '.dco-back{transform:rotateY(180deg)}',
    '.dco-3d{perspective:none}',
    '#denim>a::before,#t-shirts>a::before{content:"";position:absolute;inset:0;z-index:-1;background-size:cover;background-position:53% 40%;background-repeat:no-repeat;transition:transform 1.4s cubic-bezier(.22,1,.36,1)}',
    '#denim>a::before{background-image:url(assets/thumbs/denim.webp)}',
    '#t-shirts>a::before{background-image:url(assets/thumbs/t-shirts-2.webp)}',
    '#denim>a,#t-shirts>a{aspect-ratio:3/1 !important}',
    '#denim>a:hover::before,#t-shirts>a:hover::before{transform:scale(1.045)}',
    '#denim>a>div:first-child,#t-shirts>a>div:first-child,#jackets>a>div:first-child,#hoodies>a>div:first-child{background:linear-gradient(180deg,rgba(0,0,0,.34) 0%,rgba(0,0,0,0) 24%,rgba(0,0,0,0) 46%,rgba(0,0,0,.86) 100%),radial-gradient(70% 62% at 50% 100%,rgba(0,0,0,.72) 0%,rgba(0,0,0,.3) 55%,rgba(0,0,0,0) 100%),radial-gradient(120% 120% at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%) !important}',
    '#denim>a>div:last-child,#t-shirts>a>div:last-child,#jackets>a>div:last-child,#hoodies>a>div:last-child{align-items:center !important;text-align:center !important;padding:clamp(20px,3.4vw,60px) !important;gap:clamp(12px,1.6vw,22px) !important}',
    '#denim>a>div:last-child h2,#t-shirts>a>div:last-child h2,#jackets>a>div:last-child h2,#hoodies>a>div:last-child h2{font-size:clamp(34px,6vw,104px) !important;font-weight:800 !important;text-transform:uppercase !important;line-height:.92 !important;letter-spacing:-.03em !important;text-shadow:0 2px 30px rgba(0,0,0,.45) !important}',
    '@media (max-width:767px){#denim>a,#t-shirts>a{aspect-ratio:4/5 !important}#denim>a::before,#t-shirts>a::before{background-position:54% 30%}}',
    '.dco-3d model-viewer{position:absolute;left:50%;top:50%;width:calc(128% * var(--s,1));height:calc(128% * var(--s,1));transform:translate(-50%,-50%);--poster-color:transparent;--progress-bar-color:transparent;--progress-bar-height:0px;background:transparent;pointer-events:none}',
    '.dco-shadow{display:block;width:46%;height:clamp(8px,1.1vw,16px);margin-top:clamp(4px,.8vw,12px);border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.22),rgba(255,255,255,0) 70%);filter:blur(5px)}',
    '.dco-item{transition:background .4s ease}',
    '.dco-item:hover,.dco-item:focus-visible{background:rgba(255,255,255,.05)}',
    '.dco-label{align-self:stretch;display:grid;grid-template-columns:1fr auto;column-gap:12px;row-gap:7px;align-items:center;text-align:left;margin:clamp(14px,2vw,28px) clamp(14px,2.4vw,40px) 0;padding-top:clamp(12px,1.4vw,18px);border-top:1px solid rgba(255,255,255,.28)}',
    '.dco-label i{grid-column:1;font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.14em;color:#8d8d8d;font-style:normal}',
    '.dco-label em{grid-column:1;font:800 clamp(20px,2.9vw,46px)/.95 "Inter",sans-serif;letter-spacing:-.03em;text-transform:uppercase;font-style:normal;color:#fff}',
    '.dco-label small{grid-column:1;font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#8d8d8d}',
    '.dco-label b{grid-column:2;grid-row:1;display:grid;place-items:center;width:clamp(36px,3.6vw,54px);aspect-ratio:1;border:1.5px solid #fff;border-radius:50%;font:500 clamp(15px,1.5vw,22px)/1 "Inter",sans-serif;color:#fff;transition:background .35s,color .35s,transform .45s cubic-bezier(.22,1,.36,1)}',
    '.dco-item:hover .dco-label b,.dco-item:focus-visible .dco-label b{background:#fff;color:#000;transform:rotate(-45deg)}',
    '.dco-hint{position:relative;margin:clamp(8px,1.5vw,20px) 0 0;text-align:center;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#8d8d8d}',
    '@keyframes dcoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
    '@media (max-width:767px){',
    '.dco-stage{grid-template-columns:1fr 1fr}',
    '.dco-item{padding-top:16px}',
    '.dco-label{margin-left:12px;margin-right:12px}',
    '.dco-item:nth-child(3){border-left:0}',
    '.dco-item:nth-child(n+3){border-top:1px solid rgba(255,255,255,.14)}',
    '.dco-float{width:96%}',
    '.dco-spot{width:96%;top:16px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.dco-float{animation:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- the spin ----
  // Every object turns on its vertical axis at one constant speed, no gaps.
  // Hover changes nothing. Drag = it turns with your finger/mouse (with a little momentum).
  // Let go = it carries on spinning from wherever it stopped.
  var SPEED = 360 / 6000;                  // degrees per ms  (360 / 6000 = one full turn every 6 seconds)
  var DRAG = 0.45;                         // degrees turned per pixel dragged
  var still = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
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
    if (!s) { s = { a: 0, vel: 0 }; states.set(el, s); }
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
        if (!still) s.a += SPEED * dt;
        s.a += s.vel * dt;                       // momentum left over from a drag
        s.vel *= Math.exp(-dt / 300);
        if (Math.abs(s.vel) < 0.001) s.vel = 0;
      }
      apply(el, s.a);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

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
    var s = state(drag.spin);
    if (e.timeStamp - drag.t > 80) s.vel = 0;     // held still before letting go: no throw
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
