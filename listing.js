/* Dolce Orso — working Filter / Price / Colour / On sale / Sort controls on the listing pages
   (Shop All, Denim, T-Shirts, Jackets, Hoodies).
   Works on the product cards the page already shows: matching cards stay, others are hidden; sorting uses CSS order.
   A sheet slides up from the bottom on phones and opens as a centred panel on larger screens. */
(function () {
  var D = window.DOLCE, S = window.DOLCE_SETTINGS || {};
  if (!D) return;

  var COLOURS = [
    ['Black', '#111', /\bblack|charcoal|noir\b/],
    ['White', '#fff', /\bwhite|ivory|off-white|cream\b/],
    ['Grey', '#9a9a9a', /\bgr[ae]y|silver|ash\b/],
    ['Blue', '#2f5fd0', /\bblue|denim blue|indigo|navy\b/],
    ['Pink', '#ef5fa7', /\bpink|magenta|bubblegum\b/],
    ['Red', '#c62828', /\bred|crimson|cherry\b/],
    ['Brown', '#8b5e3c', /\bbrown|khaki|sand|tan|camel\b/],
    ['Purple', '#7b4bd1', /\bpurple|violet|lilac\b/],
    ['Gold', '#c9a227', /\bgold|golden|gilded|sunflower|yellow\b/]
  ];
  var PRICES = [['Under ₹3,000', 0, 2999], ['₹3,000 – ₹5,000', 3000, 5000], ['Over ₹5,000', 5001, 1e9]];

  var st = { price: [], colour: [], sale: false, sort: 'new' };
  function price(p) { return p.sale ? D.salePrice(p) : p.price; }
  function text(p) { return (p.name + ' ' + (p.details || []).join(' ') + ' ' + (p.description || '')).toLowerCase(); }
  function colours(p) { var t = text(p); return COLOURS.filter(function (c) { return c[2].test(t); }).map(function (c) { return c[0]; }); }
  function slugOf(a) { var m = /[?&]p=([^&#]+)/.exec(a.getAttribute('href') || ''); return m ? decodeURIComponent(m[1]) : ''; }
  function bar() { return document.getElementById('products'); }
  function cards() {
    var b = bar(); if (!b) return [];
    // the product grid that follows the filter bar
    var all = [].slice.call(document.querySelectorAll('a[href^="product?p="]'));
    return all.filter(function (a) { return (b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_FOLLOWING) && a.parentElement && getComputedStyle(a.parentElement).display === 'grid'; });
  }
  function match(p) {
    if (!p) return true;
    if (st.sale && !p.sale) return false;
    if (st.price.length && !st.price.some(function (i) { var r = PRICES[i], v = price(p); return v >= r[1] && v <= r[2]; })) return false;
    if (st.colour.length) { var cs = colours(p); if (!st.colour.some(function (c) { return cs.indexOf(c) > -1; })) return false; }
    return true;
  }
  var loved = (S.mostLoved || []);
  function rank(p, i) {
    if (st.sort === 'low') return price(p);
    if (st.sort === 'high') return -price(p);
    if (st.sort === 'best') { var k = loved.indexOf(p.slug); return k > -1 ? k : 100 + (p.sale ? 0 : 50) + i; }
    return i;
  }
  var applying = false;
  function apply() {
    var list = cards(); if (!list.length) return;
    applying = true;
    var items = list.map(function (a, i) { var p = D.bySlug(slugOf(a)); return { a: a, p: p, i: +(a.dataset.lo0 || (a.dataset.lo0 = i)) }; });
    var shown = 0;
    items.slice().sort(function (x, y) { return x.p && y.p ? rank(x.p, x.i) - rank(y.p, y.i) : 0; }).forEach(function (it, k) {
      var on = match(it.p);
      if (on) shown++;
      if (it.a.style.order !== String(k)) it.a.style.order = k;
      it.a.classList.toggle('lf-hide', !on);
    });
    var grid = list[0].parentElement, emp = document.getElementById('lf-empty');
    if (!shown) {
      if (!emp) { emp = document.createElement('div'); emp.id = 'lf-empty'; emp.innerHTML = '<p>No pieces match these filters.</p><button type="button" class="lf-btn" data-lf="clear">Clear filters</button>'; grid.parentElement.insertBefore(emp, grid.nextSibling); }
    } else if (emp) emp.remove();
    paintBar(shown, list.length);
    applying = false;
    return shown;
  }
  function count() { return st.price.length + st.colour.length + (st.sale ? 1 : 0); }
  function btn(label) { var b = bar(); return b && [].filter.call(b.querySelectorAll('button'), function (x) { return x.textContent.trim().toLowerCase() === label; })[0]; }
  function paintBar(shown, total) {
    var f = btn('filter') || (bar() && bar().querySelector('[data-lf-filter]'));
    if (f) {
      f.setAttribute('data-lf-filter', '1');
      var n = count(), lab = f.querySelector('.lf-n');
      if (!lab) { lab = document.createElement('span'); lab.className = 'lf-n'; f.appendChild(lab); }
      var nt = n ? String(n) : ''; if (lab.textContent !== nt) lab.textContent = nt; lab.style.display = n ? 'inline-flex' : 'none';
    }
    var s = bar() && bar().querySelector('[data-lf-sale]');
    if (s) s.classList.toggle('lf-on', st.sale);
    [['price', st.price.length], ['color', st.colour.length]].forEach(function (x) { var b = btn(x[0]); if (b) b.classList.toggle('lf-on', !!x[1]); });
    var c = document.getElementById('lf-count');
    var ct = (count() ? shown + ' of ' + total : total) + ' pieces'; if (c && c.textContent !== ct) c.textContent = ct;
  }

  /* ---------- the sheet ---------- */
  var CSS = '.lf-hide{display:none!important}'
    + '.lf-on{background:#000!important;color:#fff!important;border-color:#000!important}'
    + '.lf-n{display:none;align-items:center;justify-content:center;min-width:18px;height:18px;margin-left:6px;padding:0 5px;border-radius:9px;background:#000;color:#fff;font-size:10px;box-sizing:border-box}'
    + '#lf-empty{display:flex;flex-direction:column;align-items:center;gap:14px;padding:56px 20px;text-align:center;color:#555;font-size:15px}#lf-empty p{margin:0}'
    + '#lf-count{display:block;width:100%;margin-top:4px;text-align:center;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#888}'
    + '.lf-scrim{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.42);opacity:0;transition:opacity .25s}.lf-scrim.in{opacity:1}'
    + '.lf-sheet{position:fixed;z-index:401;background:#fff;color:#000;display:flex;flex-direction:column;max-height:86vh;box-shadow:0 -10px 40px rgba(0,0,0,.18);font-family:Inter,sans-serif;transition:transform .32s cubic-bezier(.2,.8,.2,1),opacity .25s}'
    + '@media(max-width:767px){.lf-sheet{left:0;right:0;bottom:0;border-radius:24px 24px 0 0;transform:translateY(100%)}.lf-sheet.in{transform:none}}'
    + '@media(min-width:768px){.lf-sheet{left:50%;top:50%;width:min(520px,92vw);border-radius:24px;transform:translate(-50%,-46%);opacity:0}.lf-sheet.in{transform:translate(-50%,-50%);opacity:1}}'
    + '.lf-hd{display:flex;align-items:center;justify-content:space-between;padding:18px 20px 12px;border-bottom:1px solid #eee}.lf-hd h3{margin:0;font-size:18px;font-weight:500;letter-spacing:-.02em}'
    + '.lf-x{width:40px;height:40px;border:1px solid #e5e5e5;border-radius:50%;background:#fff;font-size:18px;line-height:1;cursor:pointer;color:#000}'
    + '.lf-grab{width:40px;height:4px;border-radius:2px;background:#ddd;margin:10px auto 0}@media(min-width:768px){.lf-grab{display:none}}'
    + '.lf-body{overflow-y:auto;padding:6px 20px 8px;-webkit-overflow-scrolling:touch}'
    + '.lf-sec{padding:16px 0;border-bottom:1px solid #f0f0f0}.lf-sec:last-child{border-bottom:0}.lf-sec h4{margin:0 0 12px;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#888}'
    + '.lf-chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.lf-chips.c3{grid-template-columns:repeat(3,minmax(0,1fr))}'
    + '.lf-chip{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid #e0e0e0;border-radius:999px;background:#fff;color:#000;font:500 13px Inter,sans-serif;cursor:pointer;transition:all .18s}.lf-chip:hover{border-color:#000}'
    + '.lf-chip.on{background:#000;color:#fff;border-color:#000}.lf-chip i{width:12px;height:12px;border-radius:50%;border:1px solid rgba(0,0,0,.18);flex-shrink:0}.lf-chip.on i{border-color:rgba(255,255,255,.6)}.lf-chip small{opacity:.55;font-size:11px}'
    + '.lf-tog{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px}.lf-sw{position:relative;width:48px;height:28px;border-radius:14px;background:#ddd;border:0;cursor:pointer;transition:background .2s;flex-shrink:0}.lf-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}.lf-sw.on{background:#000}.lf-sw.on::after{transform:translateX(20px)}'
    + '.lf-ft{display:grid;grid-template-columns:1fr 2fr;gap:10px;padding:14px 20px calc(14px + env(safe-area-inset-bottom));border-top:1px solid #eee}'
    + '.lf-btn{display:inline-flex;align-items:center;justify-content:center;height:50px;padding:0 20px;border-radius:999px;border:1.5px solid #000;background:#000;color:#fff;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.lf-btn.o{background:#fff;color:#000;border-color:#e0e0e0}';
  var css = document.createElement('style'); css.textContent = CSS; document.head.appendChild(css);

  var sheet = null, scrim = null, draft = null;
  function avail() {   // colours actually present on this page, with counts
    var ps = cards().map(function (a) { return D.bySlug(slugOf(a)); }).filter(Boolean);
    return COLOURS.map(function (c) { return [c, ps.filter(function (p) { return colours(p).indexOf(c[0]) > -1; }).length]; }).filter(function (x) { return x[1] > 0; });
  }
  function draftCount() {
    var keep = st; st = draft;
    var n = cards().filter(function (a) { return match(D.bySlug(slugOf(a))); }).length;
    st = keep; return n;
  }
  function body() {
    var h = '<div class="lf-sec" data-sec="price"><h4>Price</h4><div class="lf-chips">'
      + PRICES.map(function (r, i) { return '<button type="button" class="lf-chip' + (draft.price.indexOf(i) > -1 ? ' on' : '') + '" data-lp="' + i + '">' + r[0] + '</button>'; }).join('') + '</div></div>'
      + '<div class="lf-sec" data-sec="color"><h4>Colour</h4><div class="lf-chips c3">'
      + avail().map(function (x) { var c = x[0]; return '<button type="button" class="lf-chip' + (draft.colour.indexOf(c[0]) > -1 ? ' on' : '') + '" data-lc="' + c[0] + '"><i style="background:' + c[1] + '"></i>' + c[0] + ' <small>' + x[1] + '</small></button>'; }).join('') + '</div></div>'
      + '<div class="lf-sec"><div class="lf-tog"><span>On sale only</span><button type="button" class="lf-sw' + (draft.sale ? ' on' : '') + '" data-ls="1" aria-pressed="' + draft.sale + '" aria-label="On sale only"></button></div></div>'
      + '<div class="lf-sec"><h4>Sizes</h4><p style="margin:0;color:#666;font-size:14px;line-height:1.6">Every piece comes in XXXS to XXL. <a href="size-guide" style="color:#000">Find his size</a>.</p></div>';
    return h;
  }
  function render() {
    sheet.querySelector('.lf-body').innerHTML = body();
    var n = draftCount();
    sheet.querySelector('[data-lf="apply"]').textContent = n ? 'Show ' + n + (n === 1 ? ' piece' : ' pieces') : 'No matches';
  }
  function open(sec) {
    if (sheet) return;
    draft = { price: st.price.slice(), colour: st.colour.slice(), sale: st.sale, sort: st.sort };
    scrim = document.createElement('div'); scrim.className = 'lf-scrim';
    sheet = document.createElement('div'); sheet.className = 'lf-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'Filter');
    sheet.innerHTML = '<div class="lf-grab"></div><div class="lf-hd"><h3>Filter</h3><button type="button" class="lf-x" data-lf="close" aria-label="Close">×</button></div><div class="lf-body"></div>'
      + '<div class="lf-ft"><button type="button" class="lf-btn o" data-lf="reset">Clear</button><button type="button" class="lf-btn" data-lf="apply">Show</button></div>';
    document.body.appendChild(scrim); document.body.appendChild(sheet);
    document.documentElement.style.overflow = 'hidden';
    render();
    requestAnimationFrame(function () { scrim.classList.add('in'); sheet.classList.add('in'); });
    setTimeout(function () { scrim.classList.add('in'); sheet.classList.add('in'); }, 30);
    if (sec) { var t = sheet.querySelector('[data-sec="' + sec + '"]'); if (t) t.scrollIntoView({ block: 'start' }); }
    scrim.onclick = close;
    sheet.onclick = function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-lp')) { var i = +t.getAttribute('data-lp'), k = draft.price.indexOf(i); if (k > -1) draft.price.splice(k, 1); else draft.price.push(i); render(); }
      else if (t.hasAttribute('data-lc')) { var c = t.getAttribute('data-lc'), j = draft.colour.indexOf(c); if (j > -1) draft.colour.splice(j, 1); else draft.colour.push(c); render(); }
      else if (t.hasAttribute('data-ls')) { draft.sale = !draft.sale; render(); }
      else if (t.getAttribute('data-lf') === 'reset') { draft = { price: [], colour: [], sale: false, sort: st.sort }; render(); }
      else if (t.getAttribute('data-lf') === 'apply') { st = draft; apply(); close(); scrollToGrid(); }
      else if (t.getAttribute('data-lf') === 'close') close();
    };
    setTimeout(function () { var x = sheet && sheet.querySelector('.lf-x'); if (x) x.focus({ preventScroll: true }); }, 60);
  }
  function close() {
    if (!sheet) return;
    var s = sheet, c = scrim; sheet = scrim = null;
    s.classList.remove('in'); c.classList.remove('in');
    document.documentElement.style.overflow = '';
    setTimeout(function () { s.remove(); c.remove(); }, 320);
  }
  function scrollToGrid() { var b = bar(); if (b) { var y = b.getBoundingClientRect().top + scrollY - 90; if (Math.abs(scrollY - y) > 40) scrollTo({ top: y, behavior: 'smooth' }); } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* ---------- wire the bar (re-done whenever the page re-renders it) ---------- */
  function wire() {
    var b = bar(); if (!b || !cards().length) return;
    var sizeB = btn('size') || b.querySelector('[data-lf-sale]');
    if (sizeB && !sizeB.hasAttribute('data-lf-sale')) { sizeB.setAttribute('data-lf-sale', '1'); sizeB.textContent = 'On sale'; }
    var sel = b.querySelector('select');
    if (sel && !sel.dataset.lfw) {
      sel.dataset.lfw = '1';
      sel.setAttribute('aria-label', 'Sort');
      sel.addEventListener('change', function () { st.sort = ['new', 'low', 'high', 'best'][sel.selectedIndex] || 'new'; apply(); });
    }
    if (sel) { var want = ['new', 'low', 'high', 'best'].indexOf(st.sort); if (want > -1 && sel.selectedIndex !== want) sel.selectedIndex = want; }
    if (!document.getElementById('lf-count')) {
      var c = document.createElement('span'); c.id = 'lf-count'; b.appendChild(c);
      b.style.flexWrap = 'wrap';
    }
    apply();
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('#products button');
    if (t) {
      var l = t.textContent.trim().toLowerCase().replace(/\d+$/, '');
      if (t.hasAttribute('data-lf-sale')) { st.sale = !st.sale; apply(); return; }
      if (t.hasAttribute('data-lf-filter') || l === 'filter') { open(); return; }
      if (l === 'price') { open('price'); return; }
      if (l === 'color' || l === 'colour') { open('color'); return; }
    }
    var cl = e.target.closest && e.target.closest('#lf-empty [data-lf="clear"]');
    if (cl) { st = { price: [], colour: [], sale: false, sort: st.sort }; apply(); }
  });
  var q = 0;
  new MutationObserver(function () { if (applying || q) return; q = setTimeout(function () { q = 0; wire(); }, 80); })
    .observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
