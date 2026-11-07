/* =====================================================================
   DOLCE ORSO - HOME PAGE HERO SLIDESHOW
   11 campaign photos (assets/hero/NN-name.webp) cross-fade one into the next in a loop,
   each with a slow "Ken Burns" drift (zooms in on one, out on the next).
   The order is set in index.html (#hero-media): no two duo shots, no same product
   and no similar background back to back. To change the order, move the <img> lines.
   --x on each <img> = where the model stands (left-right %), so phones crop to the model.
   HOLD = how long each photo stays, FADE = cross-fade length (ms).
   ===================================================================== */
(function () {
  var HOLD = 6000, FADE = 1800;
  var css = [
    '.hs-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--x,50%) 30%;opacity:0;z-index:0;transition:opacity ' + FADE + 'ms cubic-bezier(.45,0,.2,1);transform-origin:var(--x,50%) 40%;will-change:opacity,transform;user-select:none;-webkit-user-drag:none}',
    '.hs-slide.on{opacity:1;z-index:2}',
    '.hs-slide.was{opacity:1;z-index:1}',
    '.hs-slide.on,.hs-slide.was{animation:hsIn ' + (HOLD + FADE * 2) + 'ms linear forwards}',
    '.hs-slide.alt.on,.hs-slide.alt.was{animation-name:hsOut}',
    '@keyframes hsIn{from{transform:scale(1.02) translate3d(0,0,0)}to{transform:scale(1.12) translate3d(0,-1%,0)}}',
    '@keyframes hsOut{from{transform:scale(1.12) translate3d(0,-1%,0)}to{transform:scale(1.02) translate3d(0,0,0)}}',
    /* shade: heavy only where the text sits (bottom band + bottom-left behind the headline), light top edge, faces stay clear */
    '.hs-shade{position:absolute;inset:0;z-index:3;pointer-events:none;background:' +
      'linear-gradient(to top,rgba(0,0,0,.86) 0%,rgba(0,0,0,.62) 16%,rgba(0,0,0,.26) 36%,rgba(0,0,0,0) 55%),' +
      'radial-gradient(75% 65% at 0% 100%,rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 70%),' +
      'radial-gradient(60% 50% at 100% 100%,rgba(0,0,0,.28) 0%,rgba(0,0,0,0) 70%),' +
      'linear-gradient(to bottom,rgba(0,0,0,.32) 0%,rgba(0,0,0,0) 20%)}',
    '.hs-count{display:inline-flex;align-items:center;gap:12px;font-variant-numeric:tabular-nums}',
    '.hs-count b{font-weight:500;color:#fff}.hs-count b:last-child{color:rgba(255,255,255,.55)}',
    '.hs-count i{position:relative;display:block;width:clamp(40px,6vw,88px);height:1px;background:rgba(255,255,255,.28);overflow:hidden}',
    '.hs-count u{position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}',
    '.hs-count u.run{transform:scaleX(1);transition:transform ' + (HOLD + FADE) + 'ms linear}',
    '@media (max-width:767px){.hs-shade{background:' +
      'linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.72) 28%,rgba(0,0,0,.34) 50%,rgba(0,0,0,0) 68%),' +
      'linear-gradient(to bottom,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 18%)}}',
    '@media (prefers-reduced-motion:reduce){.hs-slide.on,.hs-slide.was{animation:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var idx = 0, timer = null;
  function slides() { return document.querySelectorAll('#hero-media .hs-slide'); }
  function load(img) {                       // start downloading a slide; resolves when it can be shown
    if (!img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise(function (res) { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); });
  }
  function counter(n, total) {
    var c = document.querySelector('.hs-count'); if (!c) return;
    c.firstElementChild.textContent = String(n + 1).padStart(2, '0');
    c.lastElementChild.textContent = String(total).padStart(2, '0');
    var u = c.querySelector('u'); u.classList.remove('run'); void u.offsetWidth; u.classList.add('run');
  }
  function show(next) {
    var s = slides(), n = s.length; if (!n) return;
    next = (next + n) % n;
    var cur = s[idx], inc = s[next];
    load(inc).then(function () {
      if (document.hidden) { schedule(); return; }        // tab in background: wait
      if (next % 2) inc.classList.add('alt');
      for (var i = 0; i < n; i++) if (s[i] !== cur && s[i] !== inc) s[i].classList.remove('was', 'on');
      if (cur && cur !== inc) { cur.classList.remove('on'); cur.classList.add('was'); }
      inc.classList.remove('was'); void inc.offsetWidth; inc.classList.add('on');
      setTimeout(function () { if (cur && cur !== inc) cur.classList.remove('was'); }, FADE + 60);
      idx = next; counter(idx, n);
      load(s[(idx + 1) % n]);                               // get the one after ready in the background
      schedule();
    });
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(function () { show(idx + 1); }, HOLD + FADE); }
  function start() {
    var s = slides(); if (!s.length) return;
    load(s[0]).then(function () { counter(0, s.length); load(s[1]); schedule(); });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) schedule(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
