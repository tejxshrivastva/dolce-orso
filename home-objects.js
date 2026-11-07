/* =====================================================================
   DOLCE ORSO - HOME PAGE "SHOP BY CATEGORY" OBJECT CANVAS
   Four product cut-outs floating on white. Click one to open its category.
   Hovering one flips it through its views (front, side, rear).

   To add the side and rear photos of an object, open index.html, find that object
   (class "dco-item") and list every photo in  data-views , separated by commas,
   front first:   data-views="assets/home-objects/denim-front.png,assets/home-objects/denim-side.png,assets/home-objects/denim-rear.png"
   Photos must be transparent PNGs, saved into assets/home-objects/.
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
    '.dco-item{position:absolute;left:var(--x);top:var(--y);width:var(--w);transform:translate(-50%,-50%);display:block;text-decoration:none;color:#000;-webkit-tap-highlight-color:transparent;outline-offset:8px}',
    '.dco-float{position:relative;display:block;animation:dcoFloat 6.5s ease-in-out infinite;animation-delay:var(--d,0s)}',
    '.dco-item:hover .dco-float,.dco-item:focus-visible .dco-float{animation-play-state:paused}',
    '.dco-img{display:block;width:100%;aspect-ratio:var(--ar);object-fit:contain;user-select:none;-webkit-user-drag:none;filter:drop-shadow(0 18px 16px rgba(0,0,0,.10));transition:transform .5s cubic-bezier(.22,1,.36,1),filter .5s ease}',
    '.dco-item:hover .dco-img,.dco-item:focus-visible .dco-img{transform:scale(1.08);filter:drop-shadow(0 30px 28px rgba(0,0,0,.20))}',
    '.dco-label{position:absolute;left:50%;top:100%;transform:translate(-50%,10px);margin-top:6px;display:flex;flex-direction:column;align-items:center;gap:6px;white-space:nowrap;font:500 clamp(15px,1.5vw,22px)/1 "Inter",sans-serif;letter-spacing:-.02em}',
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

  if (!(window.matchMedia && matchMedia('(hover: hover)').matches)) return;
  var STEP = 750, timer = null, cur = null;

  function views(item) { return (item.getAttribute('data-views') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean); }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    if (cur) { var v = views(cur.item); if (v[0]) cur.img.src = v[0]; cur = null; }
  }
  document.addEventListener('mouseover', function (e) {
    var item = e.target.closest && e.target.closest('.dco-item');
    if (!item || (cur && cur.item === item)) return;
    stop();
    var v = views(item), img = item.querySelector('.dco-img');
    if (!img || v.length < 2) return;
    v.forEach(function (s) { new Image().src = s; });
    var i = 0; cur = { item: item, img: img };
    timer = setInterval(function () { i = (i + 1) % v.length; img.src = v[i]; }, STEP);
  });
  document.addEventListener('mouseout', function (e) {
    if (!cur) return;
    var to = e.relatedTarget;
    if (!to || !to.closest || to.closest('.dco-item') !== cur.item) stop();
  });
})();
