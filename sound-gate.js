/* =====================================================================
   DOLCE ORSO - SOUND GATE
   First page of a visit: a quiet black screen asks "Sound On / Sound Off" before the site opens.
   - Shown once per browser session (whichever page they land on).
   - The music file (settings.js -> music) is NOT downloaded until someone picks Sound On.
   - The choice is remembered; on later pages the music resumes where it left off
     (if the browser blocks autoplay, it starts on the visitor's first tap/scroll/key).
   - After entering, a tiny sound button (bottom-left) switches it on/off at any time.
   Styles follow the site: Germanica wordmark, JetBrains Mono caps, the hero's glass pills.
   ===================================================================== */
(function () {
  if (window.__soundGate) return; window.__soundGate = true;
  var S = window.DOLCE_SETTINGS || {};
  var SRC = S.music || '';
  var VOL = 0.55, KEY = 'do-sound', ASKED = 'do-sound-asked', POS = 'do-sound-pos';
  function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function set(store, k, v) { try { window[store].setItem(k, v); } catch (e) {} }
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    // gate
    '.sg{position:fixed;inset:0;z-index:2147483000;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;padding:24px;opacity:1;transition:opacity .9s cubic-bezier(.45,0,.2,1),visibility 0s .9s}',
    '.sg.out{opacity:0;visibility:hidden;pointer-events:none}',
    '.sg-in{display:flex;flex-direction:column;align-items:center;text-align:center;transition:transform .9s cubic-bezier(.45,0,.2,1),filter .9s}',
    '.sg.out .sg-in{transform:scale(1.04);filter:blur(4px)}',
    '.sg-mark{margin:0;font:400 clamp(46px,9vw,108px)/1 "Germanica","Inter",serif;letter-spacing:.04em;text-indent:.04em;word-spacing:-.25em;font-kerning:none;font-variant-ligatures:none;white-space:nowrap}',
    '.sg-line{margin:clamp(18px,2.6vw,28px) 0 0;font:500 11px/1.4 "JetBrains Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);padding-left:.22em}',
    '.sg-btns{display:flex;gap:10px;margin-top:clamp(28px,4vw,44px);flex-wrap:wrap;justify-content:center}',
    '.sg-b{position:relative;overflow:hidden;isolation:isolate;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:44px;min-width:150px;padding:0 24px;border-radius:999px;cursor:pointer;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;-webkit-tap-highlight-color:transparent;transition:background .3s,color .3s,border-color .3s,transform .3s}',
    '.sg-on{background:#fff;color:#000;border:1px solid #fff}.sg-on:hover{background:#e6e6e6}',
    '.sg-off{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.32)}.sg-off:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.8)}',
    '.sg-b:focus-visible{outline:1px solid #fff;outline-offset:3px}',
    '.sg-off::after{content:"";position:absolute;inset:-1px;pointer-events:none;border-radius:inherit;background:linear-gradient(110deg,transparent 0 34%,rgba(255,255,255,.36) 37%,transparent 40%,transparent 43%,rgba(255,255,255,.2) 45%,transparent 47%);transform:translateX(-120%);animation:sgShine 5.2s cubic-bezier(.45,0,.25,1) 1.8s infinite}',
    '@keyframes sgShine{0%{transform:translateX(-120%)}24%{transform:translateX(120%)}100%{transform:translateX(120%)}}',
    // little equaliser (inside Sound On + the corner button)
    '.sg-eq{display:inline-flex;align-items:flex-end;gap:2px;height:11px}',
    '.sg-eq i{display:block;width:2px;height:100%;background:currentColor;border-radius:1px;transform-origin:bottom;animation:sgEq 1.1s ease-in-out infinite}',
    '.sg-eq i:nth-child(2){animation-delay:-.35s}.sg-eq i:nth-child(3){animation-delay:-.7s}.sg-eq i:nth-child(4){animation-delay:-.2s}',
    '@keyframes sgEq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}',
    '.sg-mute .sg-eq i{animation:none;transform:scaleY(.25)}',
    // entrance
    '.sg-rise{opacity:0;transform:translateY(14px);animation:sgRise 1.1s cubic-bezier(.2,.75,.2,1) forwards}',
    '.sg-d1{animation-delay:.15s}.sg-d2{animation-delay:.35s}.sg-d3{animation-delay:.5s}',
    '@keyframes sgRise{to{opacity:1;transform:none}}',
    // corner toggle (after entering)
    '.sg-t{position:fixed;left:clamp(12px,1.6vw,22px);bottom:calc(clamp(12px,1.6vw,22px) + env(safe-area-inset-bottom));z-index:2147482000;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.28);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);-webkit-tap-highlight-color:transparent;opacity:0;transform:translateY(8px);transition:opacity .5s,transform .5s,bottom .3s,background .3s,border-color .3s}',
    '.sg-t.show{opacity:1;transform:none}.sg-t:hover{background:rgba(0,0,0,.8);border-color:rgba(255,255,255,.7)}',
    '.sg-t:focus-visible{outline:1px solid #fff;outline-offset:3px}',
    '@media (prefers-reduced-motion:reduce){.sg-eq i,.sg-off::after{animation:none}.sg-rise{animation-duration:.01ms}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- audio (created on demand: nothing is downloaded before Sound On) ----------
  var audio = null, fadeT = null, wantOn = get('localStorage', KEY) === 'on';
  function track() {
    if (audio || !SRC) return audio;
    audio = new Audio(); audio.preload = 'none'; audio.loop = true; audio.src = SRC; audio.volume = 0;
    var p = parseFloat(get('sessionStorage', POS));
    if (p > 0) audio.addEventListener('loadedmetadata', function () { try { audio.currentTime = p % (audio.duration || 1e9); } catch (e) {} }, { once: true });
    setInterval(function () { if (audio && !audio.paused) set('sessionStorage', POS, String(audio.currentTime)); }, 1000);
    addEventListener('pagehide', function () { if (audio) set('sessionStorage', POS, String(audio.currentTime)); });
    return audio;
  }
  function fade(to, ms, done) {
    clearInterval(fadeT); if (!audio) return;
    var from = audio.volume, t0 = performance.now();
    fadeT = setInterval(function () {
      var k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k >= 1) { clearInterval(fadeT); if (done) done(); }
    }, 30);
  }
  function play() {
    var a = track(); if (!a) return Promise.resolve(false);
    var p = a.play();
    return (p && p.then ? p : Promise.resolve()).then(function () { fade(VOL, reduce ? 10 : 1600); return true; }, function () { return false; });
  }
  function pause() { if (!audio) return; fade(0, 500, function () { audio.pause(); }); }
  function choose(on) {
    wantOn = on; set('localStorage', KEY, on ? 'on' : 'off');
    if (on) play(); else pause();
    paintToggle();
  }
  // tab hidden = pause, back = resume (only if the visitor chose sound)
  document.addEventListener('visibilitychange', function () {
    if (!audio) return;
    if (document.hidden) audio.pause(); else if (wantOn) play();
  });

  // ---------- corner toggle ----------
  var tog = null;
  function eq() { return '<span class="sg-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'; }
  function paintToggle() {
    if (!tog) return;
    tog.classList.toggle('sg-mute', !wantOn);
    tog.setAttribute('aria-pressed', wantOn ? 'true' : 'false');
    tog.setAttribute('aria-label', wantOn ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
  }
  function toggle() {
    if (!SRC) return;                                    // no music file yet: no corner button
    tog = document.createElement('button'); tog.type = 'button'; tog.className = 'sg-t'; tog.innerHTML = eq();
    tog.addEventListener('click', function () { choose(!wantOn); });
    document.body.appendChild(tog); paintToggle();
    requestAnimationFrame(function () { tog.classList.add('show'); });
    // keep it above anything pinned to the bottom of the screen (e.g. the product page's Add to Bag bar on phones)
    setInterval(function () {
      var base = Math.max(12, Math.min(22, innerWidth * .016)), lift = 0;
      tog.style.pointerEvents = 'none';
      var el = document.elementFromPoint(base + 21, innerHeight - base - 21);
      tog.style.pointerEvents = '';
      for (var n = el; n && n !== document.body; n = n.parentElement) {
        if (getComputedStyle(n).position === 'fixed') { lift = innerHeight - n.getBoundingClientRect().top; break; }
      }
      tog.style.bottom = lift > 0 && lift < innerHeight / 2 ? (lift + 10) + 'px' : '';
    }, 700);
  }

  // ---------- the gate ----------
  function gate() {
    var g = document.createElement('div');
    g.className = 'sg'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-label', 'Sound');
    g.innerHTML = '<div class="sg-in">' +
      '<p class="sg-mark sg-rise">Dolce Orso</p>' +
      '<p class="sg-line sg-rise sg-d1">Best experienced with sound</p>' +
      '<div class="sg-btns sg-rise sg-d2">' +
        '<button type="button" class="sg-b sg-on">' + eq() + 'Sound On</button>' +
        '<button type="button" class="sg-b sg-off">Sound Off</button>' +
      '</div></div>';
    var html = document.documentElement, prev = html.style.overflow;
    html.style.overflow = 'hidden';
    document.documentElement.appendChild(g);           // added before <body> exists, so the page never flashes behind it
    whenBody(function () { if (g.parentNode === document.documentElement) document.body.appendChild(g); });   // into <body> once it exists (screen readers, focus)
    var on = g.querySelector('.sg-on'), off = g.querySelector('.sg-off');
    setTimeout(function () { try { on.focus({ preventScroll: true }); } catch (e) {} }, 400);
    function enter(withSound) {
      set('sessionStorage', ASKED, '1');
      choose(withSound);                                 // inside the click: browsers allow the music to start
      g.classList.add('out'); html.style.overflow = prev;
      setTimeout(function () { g.remove(); }, 1000);
      whenBody(toggle);
    }
    on.addEventListener('click', function () { enter(true); });
    off.addEventListener('click', function () { enter(false); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') enter(false);
      if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === on ? off : on).focus(); }   // keep focus inside
    });
  }

  function whenBody(fn) { if (document.body) fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function start() {
    if (get('sessionStorage', ASKED)) {                  // already asked this visit: just carry the choice on
      whenBody(toggle);
      if (wantOn && SRC) play().then(function (ok) {
        if (ok) return;                                  // autoplay blocked: start on the first interaction
        var go = function () { removeEventListener('pointerdown', go, true); removeEventListener('keydown', go, true); removeEventListener('touchstart', go, true); if (wantOn) play(); };
        addEventListener('pointerdown', go, true); addEventListener('keydown', go, true); addEventListener('touchstart', go, true);
      });
      return;
    }
    gate();
  }
  start();
})();
