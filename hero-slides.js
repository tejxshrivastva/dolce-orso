/* =====================================================================
   DOLCE ORSO - HOME PAGE HERO (photo slideshow)
   11 campaign photos (assets/hero/NN-name.webp) cross-fade in a loop with a gentle zoom.
   The order is set in index.html (#hero-media): no two duo shots, no same product and
   no similar background back to back. To change the order, move the <img> lines.
   --x on each <img> = where the model stands (left-right %), used to crop on phones.
   HOLD = how long a photo stays, FADE = cross-fade length (ms).
   Controls: progress segments (click to jump), prev/next arrows, swipe on phones.
   All hero styles live here; the markup is in index.html (.hs-hero).
   ===================================================================== */
(function () {
  var HOLD = 3800, FADE = 1100;
  var MONO = '500 11px/1 "JetBrains Mono",monospace';
  var GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  var css = [
    '.hs-hero{position:relative;height:100vh;height:100svh;min-height:560px;overflow:hidden;background:#000;color:#fff;touch-action:pan-y}',
    '@media (min-width:768px){.hs-hero{max-height:max(560px,56.25vw)}}',   // never taller than the 16:9 photo is wide = no side crop
    '#hero-media{inset:0}',
    // photos
    '.hs-slide{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--x,50%) 30%;opacity:0;z-index:0;transition:opacity ' + FADE + 'ms cubic-bezier(.45,0,.2,1);transform-origin:var(--x,50%) 35%;will-change:opacity,transform;user-select:none;-webkit-user-drag:none}',
    '.hs-slide.on{opacity:1;z-index:2}',
    '.hs-slide.was{opacity:1;z-index:1}',
    '.hs-hero:not(.ready) .hs-slide.on{opacity:0}',
    '.hs-slide.on,.hs-slide.was{animation:hsIn ' + (HOLD + FADE * 2) + 'ms linear forwards}',
    '.hs-slide.alt.on,.hs-slide.alt.was{animation-name:hsOut}',
    '@keyframes hsIn{from{transform:scale(1)}to{transform:scale(1.05)}}',
    '@keyframes hsOut{from{transform:scale(1.05)}to{transform:scale(1)}}',
    // shade: dark only where the text is (bottom band, bottom-left behind the title), soft top edge for the menu
    '.hs-shade{position:absolute;inset:0;z-index:3;pointer-events:none;background:' +
      'linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.6) 17%,rgba(0,0,0,.22) 38%,rgba(0,0,0,0) 56%),' +
      'radial-gradient(70% 62% at 0% 100%,rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 72%),' +
      'radial-gradient(55% 45% at 100% 100%,rgba(0,0,0,.3) 0%,rgba(0,0,0,0) 72%),' +
      'linear-gradient(to bottom,rgba(0,0,0,.36) 0%,rgba(0,0,0,0) 18%)}',
    '.hs-grain{position:absolute;inset:0;z-index:4;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:' + GRAIN + '}',
    // text layer
    '.hs-ui{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(88px,12vh,120px) clamp(16px,2.4vw,40px) clamp(18px,3.2vh,32px)}',
    '.hs-main{display:grid;grid-template-columns:1fr minmax(280px,420px);gap:clamp(24px,4vw,64px);align-items:end}',
    '.hs-left{display:flex;flex-direction:column;align-items:flex-start;gap:clamp(14px,2vh,22px)}',
    '.hs-eyebrow{display:inline-flex;align-items:center;gap:12px;font:' + MONO + ';letter-spacing:.55px;text-transform:uppercase;color:rgba(255,255,255,.85)}',
    '.hs-eyebrow s{position:relative;width:6px;height:6px;border-radius:50%;background:#fff}',
    '.hs-eyebrow s::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1px solid rgba(255,255,255,.6);animation:hsPulse 2.4s ease-out infinite}',
    '@keyframes hsPulse{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.6);opacity:0}}',
    '.hs-title{margin:0;font:500 clamp(40px,9vw,148px)/.92 "Inter",sans-serif;letter-spacing:-.045em}',
    '.hs-line{display:block;overflow:hidden;padding:0 .12em .08em 0;margin-bottom:-.08em}',
    '.hs-line>*{display:inline-block}',
    '.hs-title em{font:inherit;letter-spacing:inherit}',
    '.hs-right{display:flex;flex-direction:column;gap:22px}',
    '.hs-right p{margin:0;font-size:15px;line-height:1.6;color:rgba(255,255,255,.82);text-wrap:pretty}',
    '.hs-ctas{display:flex;gap:10px;flex-wrap:wrap}',
    '.hs-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;height:50px;padding:0 26px;border-radius:999px;font:' + MONO + ';letter-spacing:.55px;text-transform:uppercase;text-decoration:none;white-space:nowrap;transition:background .3s,color .3s,border-color .3s}',
    '.hs-btn svg{transition:transform .3s}.hs-btn:hover svg{transform:translateX(4px)}',
    '.hs-solid{background:#fff;color:#000}.hs-solid:hover{background:#e6e6e6;color:#000}',
    '.hs-glass{color:#fff;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}',
    '.hs-glass:hover{background:rgba(255,255,255,.18);border-color:rgba(255,255,255,.8);color:#fff}',
    // bottom bar: season | photo controls | scroll
    '.hs-bar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;margin-top:clamp(24px,4.5vh,44px);padding-top:14px;border-top:1px solid rgba(255,255,255,.18);font:' + MONO + ';letter-spacing:.55px;text-transform:uppercase;color:rgba(255,255,255,.7)}',
    '.hs-scroll{justify-self:end;display:inline-flex;align-items:center;gap:8px;color:rgba(255,255,255,.7);text-decoration:none;transition:color .3s}',
    '.hs-scroll:hover{color:#fff}.hs-scroll svg{animation:hsBob 1.8s ease-in-out infinite}',
    '@keyframes hsBob{0%,100%{transform:translateY(-2px)}50%{transform:translateY(2px)}}',
    '.hs-nav{display:flex;align-items:center;gap:14px}',
    '.hs-arrow{display:grid;place-items:center;width:34px;height:34px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.06);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;cursor:pointer;transition:background .3s,color .3s,border-color .3s}',
    '.hs-arrow:hover{background:#fff;color:#000;border-color:#fff}',
    '.hs-num{display:inline-flex;align-items:baseline;gap:6px;min-width:58px;justify-content:center;font-variant-numeric:tabular-nums}',
    '.hs-num b{font-weight:500;color:#fff}.hs-num i::before{content:"/";color:rgba(255,255,255,.35)}.hs-num em{font-style:normal;color:rgba(255,255,255,.5)}',
    '.hs-segs{display:flex;gap:5px;width:clamp(150px,17vw,260px)}',
    '.hs-segs button{position:relative;flex:1;height:16px;padding:0;border:0;background:none;cursor:pointer}',
    '.hs-segs button::before,.hs-segs u{content:"";position:absolute;left:0;right:0;top:7px;height:2px;border-radius:2px}',
    '.hs-segs button::before{background:rgba(255,255,255,.25);transition:background .3s}',
    '.hs-segs button:hover::before{background:rgba(255,255,255,.55)}',
    '.hs-segs u{background:#fff;transform:scaleX(0);transform-origin:left}',
    '.hs-segs .done u{transform:scaleX(1)}',
    '.hs-segs .cur u{animation:hsFill ' + (HOLD + FADE) + 'ms linear forwards}',
    '@keyframes hsFill{from{transform:scaleX(0)}to{transform:scaleX(1)}}',
    // entrance
    '.hs-rise{opacity:0;transform:translateY(22px)}',
    '.hs-line .hs-rise{opacity:1;transform:translateY(108%)}',
    '.hs-hero.ready .hs-rise{animation:hsRise 1.15s cubic-bezier(.2,.75,.2,1) forwards;animation-delay:calc(var(--i,0) * 90ms + 120ms)}',
    '@keyframes hsRise{to{opacity:1;transform:none}}',
    // phones: photo on top, text below it on black, so the photo is cropped far less
    '@media (max-width:767px){',
    '.hs-hero{min-height:640px}',
    '#hero-media{inset:0 0 auto 0;height:70%}',
    '.hs-shade{background:linear-gradient(to top,#000 0%,rgba(0,0,0,.78) 14%,rgba(0,0,0,.28) 34%,rgba(0,0,0,0) 52%),linear-gradient(to bottom,rgba(0,0,0,.38) 0%,rgba(0,0,0,0) 18%)}',
    '.hs-ui{padding:0 16px 16px}',
    '.hs-main{grid-template-columns:1fr;gap:18px}',
    '.hs-title{font-size:clamp(42px,13.5vw,66px)}',
    '.hs-right{gap:18px}.hs-right p{font-size:14px}',
    '.hs-ctas .hs-btn{flex:1;padding:0 14px;height:48px}',
    '.hs-bar{grid-template-columns:1fr auto;margin-top:22px}',
    '.hs-season,.hs-arrow{display:none}',
    '.hs-nav{gap:12px}.hs-segs{width:auto;flex:1;min-width:120px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.hs-slide.on,.hs-slide.was,.hs-eyebrow s::after,.hs-scroll svg{animation:none}.hs-hero.ready .hs-rise{animation-duration:.01ms}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var idx = 0, timer = null, ready = false;
  function hero() { return document.querySelector('.hs-hero'); }
  function slides() { return document.querySelectorAll('#hero-media .hs-slide'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function load(img) {
    if (!img) return Promise.resolve();
    if (!img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
    if (img.complete && img.naturalWidth) return Promise.resolve();
    return new Promise(function (res) { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); });
  }
  function buildSegs(n) {
    var box = document.querySelector('.hs-segs'); if (!box || box.children.length === n) return;
    var h = '';
    for (var i = 0; i < n; i++) h += '<button type="button" aria-label="Show photo ' + (i + 1) + '"><u></u></button>';
    box.innerHTML = h;
  }
  function paint(n) {                                  // counter + progress segments
    var num = document.querySelector('.hs-num');
    if (num) { num.firstElementChild.textContent = pad(idx + 1); num.lastElementChild.textContent = pad(n); }
    var segs = document.querySelectorAll('.hs-segs button');
    for (var i = 0; i < segs.length; i++) {
      segs[i].classList.remove('cur');
      segs[i].classList.toggle('done', i < idx);
    }
    if (segs[idx]) { void segs[idx].offsetWidth; segs[idx].classList.add('cur'); }
  }
  function show(next) {
    var s = slides(), n = s.length; if (!n) return;
    next = (next + n) % n;
    if (next === idx) return;
    var cur = s[idx], inc = s[next];
    clearTimeout(timer);
    load(inc).then(function () {
      if (next % 2) inc.classList.add('alt');
      for (var i = 0; i < n; i++) if (s[i] !== cur && s[i] !== inc) s[i].classList.remove('was', 'on');
      cur.classList.remove('on'); cur.classList.add('was');
      inc.classList.remove('was'); void inc.offsetWidth; inc.classList.add('on');
      setTimeout(function () { if (!cur.classList.contains('on')) cur.classList.remove('was'); }, FADE + 60);
      idx = next; paint(n);
      load(s[(idx + 1) % n]);
      schedule();
    });
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { if (document.hidden) schedule(); else show(idx + 1); }, HOLD + FADE);
  }
  function go() { ready = true; ensure(); }
  // the page's template engine can re-render the hero after load (fresh elements, no classes):
  // put back the current photo, the segments and the "ready" state whenever that happens
  function ensure() {
    var h = hero(), s = slides(); if (!h || !s.length) return;
    if (ready && !h.classList.contains('ready')) h.classList.add('ready');
    var seg = document.querySelector('.hs-segs');
    if (seg && !seg.children.length) { buildSegs(s.length); if (ready) paint(s.length); }
    if (!document.querySelector('#hero-media .hs-slide.on')) {
      for (var i = 0; i < s.length; i++) s[i].classList.toggle('alt', i % 2 === 1);
      load(s[idx]); s[idx].classList.add('on');
    }
  }
  setInterval(ensure, 300);
  function start() {
    var s = slides(); if (!s.length) return;
    buildSegs(s.length);
    setTimeout(go, 2500);                              // show the text even if the photo is slow
    load(s[0]).then(function () { go(); paint(s.length); load(s[1]); schedule(); });
  }

  // controls
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.hs-prev, .hs-next, .hs-segs button'); if (!t) return;
    if (t.classList.contains('hs-prev')) show(idx - 1);
    else if (t.classList.contains('hs-next')) show(idx + 1);
    else show([].indexOf.call(t.parentNode.children, t));
  });
  var sw = null;                                      // swipe left/right on the photo (phones)
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' || !e.target.closest || !e.target.closest('.hs-hero') || e.target.closest('a,button')) return;
    sw = { x: e.clientX, y: e.clientY };
  });
  document.addEventListener('pointerup', function (e) {
    if (!sw) return;
    var dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) show(dx < 0 ? idx + 1 : idx - 1);
  });
  document.addEventListener('pointercancel', function () { sw = null; });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && ready) { paint(slides().length); schedule(); } });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
