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
    '.sg-blade{width:clamp(150px,16vw,240px);aspect-ratio:1/1.9;filter:drop-shadow(0 14px 22px rgba(0,0,0,.6));cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent}',
    '.sg-blade.grab{cursor:grabbing}',
    '@media (max-height:600px){.sg-blade{width:clamp(110px,22vh,170px)}}',
    '.sg-blade model-viewer{width:100%;height:100%;pointer-events:none;will-change:transform;background:transparent;--poster-color:transparent;--progress-bar-height:0px;--progress-mask:transparent;opacity:0;transition:opacity 1s ease}',
    '.sg-blade.ready model-viewer{opacity:1}',
    '.sg-line{margin:6px 0 0;font:500 11px/1.4 "JetBrains Mono",monospace;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);padding-left:.22em}',
    '.sg-btns{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;justify-content:center}',
    '.sg-b{position:relative;overflow:hidden;isolation:isolate;display:inline-flex;align-items:center;justify-content:center;gap:10px;height:44px;min-width:150px;padding:0 24px;border-radius:999px;cursor:pointer;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;-webkit-tap-highlight-color:transparent;transition:background .3s,color .3s,border-color .3s,transform .3s}',
    '.sg-on{background:#fff;color:#000;border:1px solid #fff}.sg-on:hover{background:#e6e6e6}',
    '.sg-off{background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.32)}.sg-off:hover{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.8)}',
    '.sg-b:focus-visible{outline:1px solid rgba(255,255,255,.45);outline-offset:3px}',
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
    // hero switch (home page): a quiet "Sound on / off" line where the Scroll cue was, centred under the buttons
    '.hs-hero .hs-scroll{display:none!important}',
    '.sg-h{position:relative;z-index:6;pointer-events:auto;display:inline-flex;align-items:center;gap:12px;padding:10px 18px 10px 15px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.22);-webkit-backdrop-filter:blur(14px) saturate(1.2);backdrop-filter:blur(14px) saturate(1.2);cursor:pointer;color:rgba(255,255,255,.7);font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;-webkit-tap-highlight-color:transparent;transition:color .3s,background .3s,border-color .3s,transform .3s}',
    '.sg-h .sg-eq{height:13px;gap:2.5px;padding-right:12px;border-right:1px solid rgba(255,255,255,.2);box-sizing:content-box}',
    '.sg-h .sg-eq i{width:2px}',
    '.sg-h:active{transform:scale(.97)}',
    '.sg-h:hover{color:#fff;background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.55)}.sg-h:focus{outline:0}.sg-h:focus-visible{outline:1px solid rgba(255,255,255,.6);outline-offset:3px}',
    '.sg-h b{font-weight:600;color:#fff}.sg-h.sg-mute{color:rgba(255,255,255,.5)}.sg-h.sg-mute b{color:rgba(255,255,255,.85)}',
    '.sg-t.sg-away{opacity:0!important;pointer-events:none}',
    '@media (prefers-reduced-motion:reduce){.sg-eq i,.sg-off::after{animation:none}.sg-rise{animation-duration:.01ms}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- audio (created on demand: nothing is downloaded before Sound On) ----------
  var audio = null, fadeT = null, wantOn = get('localStorage', KEY) === 'on';
  function track() {
    if (audio || !SRC) return audio;
    audio = new Audio(); audio.preload = 'none'; audio.loop = true; audio.src = SRC; audio.volume = 0;
    var prevT = 0, dipping = false;                     // auto-loop: fade out over the last 3s, fade back in from the top
    setInterval(function () {
      if (!audio || audio.paused || !wantOn || !audio.duration) return;
      var t = audio.currentTime, left = audio.duration - t;
      if (!dipping && left < 3.2) { dipping = true; fade(0, left * 1000 - 150); }
      if (t < prevT) { dipping = false; fade(VOL, 3500); }   // it wrapped round to the start
      prevT = t;
    }, 200);
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
      var e = k * k * (3 - 2 * k);                     // ease in-out: a soft start and a soft landing
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * e));
      if (k >= 1) { clearInterval(fadeT); if (done) done(); }
    }, 30);
  }
  var resumed = parseFloat(get('sessionStorage', POS)) > 0;
  function play() {
    var a = track(); if (!a) return Promise.resolve(false);
    var p = a.play();
    return (p && p.then ? p : Promise.resolve()).then(function () { fade(VOL, reduce ? 10 : (resumed ? 1200 : 3500)); resumed = false; return true; }, function () { return false; });
  }
  window.__doSound = function () { return audio ? { paused: audio.paused, time: +audio.currentTime.toFixed(1), volume: +audio.volume.toFixed(2) } : null; };   // for checking only
  function pause() { if (!audio) return; fade(0, 900, function () { audio.pause(); }); }
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
  function paintHero() {
    var h = document.querySelector('.sg-h'); if (!h) return;
    h.classList.toggle('sg-mute', !wantOn);
    h.setAttribute('aria-pressed', wantOn ? 'true' : 'false');
    h.lastChild.innerHTML = 'Sound <b>' + (wantOn ? 'On' : 'Off') + '</b>';
  }
  function heroSwitch() {                               // the home template can re-render the hero: re-add when missing
    var hero = document.querySelector('.hs-hero'); if (!hero) return;
    var ui = hero.querySelector('.hs-ui');
    if (ui && !ui.querySelector('.sg-h')) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sg-h';
      b.innerHTML = eq() + '<span></span>';
      b.addEventListener('click', function () { choose(!wantOn); });
      var sc = ui.querySelector('.hs-scroll');
      if (sc) sc.parentNode.insertBefore(b, sc); else ui.appendChild(b);   // takes the Scroll cue's place in the stack
    }
    paintHero();
    if (tog && 'IntersectionObserver' in window && hero !== heroSwitch.seen) {
      heroSwitch.seen = hero;
      new IntersectionObserver(function (en) { tog.classList.toggle('sg-away', en[0].isIntersecting); }, { threshold: .15 }).observe(hero);
    }
  }
  function paintToggle() {
    paintHero();
    if (!tog) return;
    tog.classList.toggle('sg-mute', !wantOn);
    tog.setAttribute('aria-pressed', wantOn ? 'true' : 'false');
    tog.setAttribute('aria-label', wantOn ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
  }
  function toggle() {
    if (!SRC) return;                                    // no music file yet: no corner button
    return;                                              // no floating corner button anywhere (Tejas, Nov 12); the home hero has the only switch
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
    g.className = 'sg'; g.setAttribute('role', 'dialog'); g.setAttribute('aria-modal', 'true'); g.setAttribute('aria-label', 'Dolce Orso. Sound on or off');
    g.innerHTML = '<div class="sg-in">' +
      '<div class="sg-blade sg-rise"><model-viewer src="assets/home-objects/blade.glb" alt="" camera-orbit="0deg 90deg 100%" field-of-view="30deg" exposure="1.5" shadow-intensity="0" environment-image="neutral" interaction-prompt="none" loading="eager" disable-zoom disable-pan disable-tap></model-viewer></div>' +
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
    // the blade: same model and turn as the footer (30deg/s, breathing, slight nod); needs the 3D library
    if (!customElements.get('model-viewer') && !document.querySelector('script[src*="model-viewer"]')) {
      var ms = document.createElement('script'); ms.type = 'module'; ms.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js'; document.head.appendChild(ms);
    }
    var bl = g.querySelector('.sg-blade'), bmv = bl.firstChild, th = 0, tt = 0, lastF = 0;
    // drag it anywhere: it turns with your hand; let go and it springs home with a small wobble (same feel as the hero chain)
    var x = 0, y = 0, vx = 0, vy = 0, tilt = 0, sp = 30, dr = null;
    bl.addEventListener('pointerdown', function (e) {
      e.preventDefault(); try { bl.setPointerCapture(e.pointerId); } catch (_) {}
      dr = { id: e.pointerId, px: e.clientX, py: e.clientY, sx: x, sy: y, tx: x, ty: y }; bl.classList.add('grab');
    });
    bl.addEventListener('pointermove', function (e) {
      if (!dr || e.pointerId !== dr.id) return;
      dr.tx = dr.sx + e.clientX - dr.px; dr.ty = dr.sy + e.clientY - dr.py;
    });
    function letGo(e) { if (!dr || e.pointerId !== dr.id) return; dr = null; bl.classList.remove('grab'); sp = Math.max(-900, Math.min(900, 30 + vx * .9)); }
    bl.addEventListener('pointerup', letGo); bl.addEventListener('pointercancel', letGo);
    (function spin(now) {
      if (!g.isConnected) return;
      var dt = lastF ? Math.min((now - lastF) / 1000, .05) : .016; lastF = now; tt += dt;
      var px = x;
      if (dr) {
        var f = 1 - Math.exp(-dt * 22); x += (dr.tx - x) * f; y += (dr.ty - y) * f;
        vx = (x - px) / dt; vy = 0; th += (x - px) * .9;
      } else {
        vx += (-62 * x - 6.5 * vx) * dt; vy += (-62 * y - 6.5 * vy) * dt; x += vx * dt; y += vy * dt;
        var idle = reduce ? 0 : 30 * (1 + .35 * Math.sin(tt * .5));
        sp = idle + (sp - idle) * Math.exp(-dt * 1.4); th += sp * dt;
      }
      tilt += (Math.max(-28, Math.min(28, vx * .02)) - tilt) * (1 - Math.exp(-dt * 10));
      bmv.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + tilt.toFixed(2) + 'deg)';
      if (bmv.loaded) { bl.classList.add('ready'); bmv.cameraOrbit = (th % 360).toFixed(1) + 'deg ' + (90 + (reduce ? 0 : Math.sin(tt * .9) * 5)).toFixed(1) + 'deg 100%'; }
      requestAnimationFrame(spin);
    })(0);
    function enter(withSound) {
      set('sessionStorage', ASKED, '1');
      choose(withSound);                                 // inside the click: browsers allow the music to start
      g.classList.add('out'); html.style.overflow = prev;
      setTimeout(function () { g.remove(); }, 1000);
      whenBody(toggle);
    }
    on.addEventListener('click', function () { enter(true); });
    off.addEventListener('click', function () { enter(false); });
    document.addEventListener('keydown', function k(e) {
      if (!g.isConnected || g.classList.contains('out')) return document.removeEventListener('keydown', k);
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
  whenBody(function () { heroSwitch(); setInterval(heroSwitch, 800); });
})();
