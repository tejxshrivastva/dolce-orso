/* Dolce Orso — shared shop behaviour: bag, wishlist, WhatsApp ordering, search
   and the content pages (bag, wishlist, concierge ... one tiny file each, generated from page.html). Content text lives in pages.js. */
(function () {
  var D = window.DOLCE, S = window.DOLCE_SETTINGS || {};
  if (!D) return;

  /* ---------- storage ---------- */
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var bag = load('dolce-bag', []), wish = load('dolce-wish', []);
  // drop pieces that no longer exist (old slugs), so counts and WhatsApp orders stay right
  (function () {
    if (!Array.isArray(bag)) bag = [];
    if (!Array.isArray(wish)) wish = [];
    var b = bag.filter(function (i) { return i && D.bySlug(i.slug) && i.qty > 0; });
    var w = wish.filter(function (s) { return D.bySlug(s); });
    if (b.length !== bag.length) { bag = b; save('dolce-bag', bag); }
    if (w.length !== wish.length) { wish = w; save('dolce-wish', wish); }
  })();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function PAGE(p) { return p; }
  D.pageHref = PAGE;

  /* ---------- WhatsApp ---------- */
  function wa(text) {
    var n = String(S.whatsapp || '').replace(/\D/g, '');
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(text || '');
  }
  D.waLink = wa;

  /* ---------- bag ---------- */
  function bagCount() { return bag.reduce(function (n, i) { return n + i.qty; }, 0); }
  function unit(p) { return p.sale ? D.salePrice(p) : p.price; }
  function bagTotal() { return bag.reduce(function (t, i) { var p = D.bySlug(i.slug); return t + (p ? unit(p) * i.qty : 0); }, 0); }
  function addToBag(slug, size, qty) {
    size = size || 'M'; qty = qty || 1;
    for (var i = 0; i < bag.length; i++) if (bag[i].slug === slug && bag[i].size === size) { bag[i].qty += qty; save('dolce-bag', bag); paint(); return; }
    bag.push({ slug: slug, size: size, qty: qty }); save('dolce-bag', bag); paint();
  }
  function toggleWish(slug) {
    var i = wish.indexOf(slug);
    if (i > -1) wish.splice(i, 1); else wish.push(slug);
    save('dolce-wish', wish); paint();
    return i === -1;
  }
  D.bag = { add: addToBag, count: bagCount, total: bagTotal };

  /* ---------- toast + paint (counters, wishlist hearts) ---------- */
  var toastEl, toastT;
  function toast(msg, href) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#000;color:#fff;border-radius:999px;padding:12px 22px;font:500 12px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;z-index:9999;opacity:0;pointer-events:none;transition:opacity .25s;white-space:nowrap';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg; toastEl.style.opacity = 1;
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.style.opacity = 0; }, 2200);
  }
  function paint() {
    var n = bagCount();
    [].forEach.call(document.querySelectorAll('[data-bagcount]'), function (el) {
      el.textContent = n; el.style.display = n ? 'flex' : 'none';
    });
    [].forEach.call(document.querySelectorAll('[data-wish]'), function (el) {
      var on = wish.indexOf(el.getAttribute('data-wish')) > -1;
      var path = el.querySelector('path');
      if (path && path.getAttribute('fill') !== (on ? '#000' : 'none')) path.setAttribute('fill', on ? '#000' : 'none');
    });
  }

  /* ---------- sign-in gate: bag, wishlist and buying need a signed-in customer ---------- */
  var PENDING = 'dolce-pending', pendingDone = false;
  function needLogin(action) {
    if (session()) return false;
    save(PENDING, action ? { t: action.t, slug: action.slug || '', size: action.size || 'M', at: Date.now() } : null);
    var here = decodeURIComponent(location.pathname.split('/').pop()) + location.search;
    location.href = PAGE('login') + '?next=' + encodeURIComponent(here);
    return true;
  }
  function applyPending() {
    var p = load(PENDING, null);
    if (!p || !session()) return;
    try { localStorage.removeItem(PENDING); } catch (e) {}
    if (Date.now() - (p.at || 0) > 30 * 60 * 1000) return;
    if (p.t === 'add' && p.slug) { addToBag(p.slug, p.size, 1); toast('Added to bag'); }
    else if (p.t === 'buy' && p.slug) { addToBag(p.slug, p.size, 1); location.href = PAGE('bag'); }
    else if (p.t === 'wish' && p.slug) { if (wish.indexOf(p.slug) < 0) { toggleWish(p.slug); toast('Saved to wishlist'); } }
    else if (p.t === 'order') { if (current !== 'bag') location.href = PAGE('bag'); }
  }

  /* ---------- click handling (works on every page) ---------- */
  document.addEventListener('click', function (e) {
    var w = e.target.closest && e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault(); e.stopPropagation();
      if (needLogin({ t: 'wish', slug: w.getAttribute('data-wish') })) return;
      var on = toggleWish(w.getAttribute('data-wish'));
      toast(on ? 'Saved to wishlist' : 'Removed from wishlist');
      if (document.getElementById('dolce-main') && current === 'wishlist') render();
      return;
    }
    var a = e.target.closest && e.target.closest('[data-act]');
    if (!a) return;
    var act = a.getAttribute('data-act'), p = D.current();
    var size = window.DOLCE_SIZE || '';
    if ((act === 'add' || act === 'buy') && !size) {             // a size must be chosen first
      e.preventDefault(); e.stopPropagation();
      toast('Please choose a size');
      var first = [].filter.call(document.querySelectorAll('button,div,span'), function (b) { return b.textContent.trim() === 'XXXS' && !b.children.length; })[0];
      var grp = first && first.parentElement;
      if (grp) {
        grp.scrollIntoView({ behavior: 'smooth', block: 'center' });
        grp.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 420, delay: 250 });
      }
      return;
    }
    if ((act === 'add' || act === 'buy') && needLogin({ t: act, slug: p.slug, size: size })) { e.preventDefault(); return; }
    if (act === 'add') { addToBag(p.slug, size, 1); toast('Added to bag'); }
    else if (act === 'buy') { addToBag(p.slug, size, 1); location.href = PAGE('bag'); }
    else if (act === 'wa') {
      window.open(wa('Hello Dolce Orso, I would like help with: ' + p.name + ' (' + (size ? 'size ' + size : 'size not chosen yet') + ', ' + D.inr(unit(p)) + ').'), '_blank');
    }
  }, true);

  /* header search: Enter goes to the search results page */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target;
    if (t && t.tagName === 'INPUT' && t.type === 'search' && t.value.trim()) location.href = PAGE('search') + '?q=' + encodeURIComponent(t.value.trim());
  }, true);

  /* ---------- shared HTML pieces ---------- */
  var MONO = "font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.055em";
  var CSS = '.do-in{padding:0 clamp(8px,1vw,16px)}'
    + '.do-card{display:flex;flex-direction:column;gap:14px;color:#000;text-decoration:none}.do-card:hover{opacity:.92}'
    + '.do-ph{position:relative;aspect-ratio:4/5;border-radius:15px;background:#f1f1f1;overflow:hidden;border:1px solid #ddd}'
    + '.do-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}'
    + '.do-ph img.h{object-position:center center;opacity:0;transition:opacity .35s ease}.do-card:hover .do-ph img.h{opacity:1}'
    + '.do-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(6px,.8vw,10px)}@media(min-width:768px){.do-grid{grid-template-columns:repeat(3,1fr)}}@media(min-width:1024px){.do-grid{grid-template-columns:repeat(4,1fr)}}'
    + '.do-btn{display:inline-flex;align-items:center;justify-content:center;height:48px;padding:0 32px;border-radius:999px;border:1.5px solid #000;background:#000;color:#fff;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-decoration:none}.do-btn:hover{background:#222}'
    + '.do-btn.o{background:#fff;color:#000;border-color:#e0e0e0}.do-btn.o:hover{border-color:#000;background:#fff}'
    + '.do-lbl{margin:0 0 10px;font:500 11px "JetBrains Mono",monospace;letter-spacing:.055em;text-transform:uppercase;color:#000}'
    + '.do-txt{margin:0 0 14px;line-height:1.75;color:#555;font-size:15px}'
    + '.do-input{width:100%;height:48px;padding:0 18px;border:1px solid #ddd;border-radius:999px;font:400 15px Inter,sans-serif;outline:none;background:#fff;color:#000;box-sizing:border-box}.do-input:focus{border-color:#000}'
    + 'textarea.do-input{height:120px;padding:14px 18px;border-radius:20px;resize:vertical}'
    + '.do-box{border:1px solid #e0e0e0;border-radius:20px;padding:clamp(18px,2.4vw,28px)}'
    + 'details.do-q{border-bottom:1px solid #eee;padding:18px 4px}details.do-q summary{cursor:pointer;font-weight:500;font-size:16px;list-style:none;display:flex;justify-content:space-between;gap:12px}details.do-q summary::after{content:"+";font-size:20px;line-height:1}details.do-q[open] summary::after{content:"\\2212"}'
    + '.do-row{display:flex;gap:16px;padding:18px 0;border-bottom:1px solid #eee;align-items:center}'
    + '.do-qty{display:inline-flex;align-items:center;border:1px solid #ddd;border-radius:999px;height:36px}.do-qty button{width:34px;height:34px;border:0;background:none;font-size:16px;cursor:pointer}.do-qty span{min-width:22px;text-align:center;font-size:13px}';
  var st = document.createElement('style'); st.textContent = CSS; (document.head || document.documentElement).appendChild(st);

  var BM = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.5"><path d="M5 3h14v18l-7-4-7 4V3z"></path></svg>';
  function cardHTML(p) {
    var c = D.card(p);
    return '<a class="do-card" href="' + c.href + '"><div class="do-ph"><img loading="lazy" decoding="async" src="' + c.img + '" alt=""><img class="h" data-hover="' + c.hoverImg + '" alt="">'
      + (p.sale ? '<div style="position:absolute;top:8px;left:8px;background:#333;color:#fff;font-size:11px;font-weight:500;padding:3px 8px;border-radius:3px;font-family:\'JetBrains Mono\',monospace">-20%</div>' : '')
      + '<div data-wish="' + p.slug + '" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,.88);border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + BM + '</div></div>'
      + '<div style="display:flex;flex-direction:column;gap:3px;padding:0 2px"><p style="margin:0;font-size:clamp(13px,1.1vw,15px);font-weight:500;line-height:1.3">' + esc(p.name) + '</p>'
      + '<p style="margin:0;font-size:10px;color:#999;font-family:\'JetBrains Mono\',monospace">XXXS – XXL</p>'
      + '<div style="display:flex;gap:6px;align-items:center;margin-top:2px">' + (p.sale
        ? '<span style="font-size:12px;color:#aaa;text-decoration:line-through">' + D.inr(p.price) + '</span><span style="font-size:13px;font-weight:600;color:#333">' + D.inr(D.salePrice(p)) + '</span>'
        : '<span style="font-size:13px;font-weight:500">' + D.inr(p.price) + '</span>') + '</div></div></a>';
  }
  function gridHTML(list) { return '<div class="do-grid">' + list.map(cardHTML).join('') + '</div>'; }
  function head(title, lead, crumb) {
    return '<section class="do-in" style="padding-top:clamp(16px,2.4vw,32px);padding-bottom:clamp(12px,2vw,24px);display:flex;flex-direction:column;gap:12px">'
      + '<nav style="display:flex;gap:8px;font-size:11px;color:#888;' + MONO + '"><a href="./" style="color:#888;text-decoration:none">Home</a><span>/</span><span style="color:#000">' + esc(crumb || title) + '</span></nav>'
      + '<h1 style="margin:0;font-size:clamp(34px,5.2vw,72px);font-weight:500;letter-spacing:-.045em;line-height:1">' + esc(title) + '</h1>'
      + (lead ? '<p style="margin:0;max-width:640px;color:#666;font-size:clamp(15px,1.3vw,17px);line-height:1.6">' + lead + '</p>' : '') + '</section>';
  }
  function wrap(inner, narrow) {
    return '<section class="do-in" style="padding-bottom:clamp(48px,6vw,80px);' + (narrow ? 'max-width:880px' : '') + '">' + inner + '</section>';
  }
  function empty(msg, btn, href) {
    return '<div class="do-box" style="text-align:center;padding:clamp(32px,6vw,72px) 20px"><p class="do-txt" style="margin:0 0 20px">' + msg + '</p><a class="do-btn" href="' + href + '">' + btn + '</a></div>';
  }
  function formRows(fields) {
    return fields.map(function (f) {
      return '<label style="display:block;margin-bottom:12px"><span class="do-lbl" style="display:block;color:#666">' + f.l + '</span>'
        + (f.t === 'area' ? '<textarea class="do-input" name="' + f.n + '"></textarea>' : '<input class="do-input" name="' + f.n + '" type="text" placeholder="' + (f.ph || '') + '">') + '</label>';
    }).join('');
  }
  function formVals(form) { var o = {}; [].forEach.call(form.elements, function (el) { if (el.name) o[el.name] = el.value.trim(); }); return o; }

  /* ---------- special pages ---------- */
  var R = {};
  var SIZES = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'], lastRemoved = null, wsz = {};
  var BW_CSS = [
    '.do-eyebrow{margin:0;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase}@keyframes doUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '.do-bag{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,400px);gap:clamp(20px,3vw,48px);align-items:start}',
    '@media(max-width:959px){.do-bag{grid-template-columns:1fr}.do-sum{position:static!important}.do-bagpage{padding-bottom:96px!important}}',
    '.do-line{display:grid;grid-template-columns:clamp(96px,11vw,136px) minmax(0,1fr) auto;gap:clamp(14px,2vw,26px);padding:clamp(12px,1.6vw,18px);border:1px solid #e0e0e0;border-radius:20px;margin-bottom:8px;background:#fff;animation:doUp .45s cubic-bezier(.2,.7,.2,1) both}',
    '.do-li{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-width:0}',
    '.do-cat{margin:0 0 6px;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:#999}',
    '.do-nm{color:#000;text-decoration:none;font-size:clamp(15px,1.3vw,18px);font-weight:500;line-height:1.3}.do-nm:hover{text-decoration:underline;text-underline-offset:3px}',
    '.do-szs{display:flex;gap:6px;flex-wrap:wrap}.do-szs button{min-width:38px;height:32px;padding:0 10px;border:1px solid #ddd;border-radius:999px;background:#fff;color:#000;font:500 11px "JetBrains Mono",monospace;cursor:pointer;transition:all .2s}.do-szs button:hover{border-color:#000}.do-szs button.on{background:#000;color:#fff;border-color:#000}',
    '.do-act{display:flex;align-items:center;gap:16px;flex-wrap:wrap}',
    '.do-tl{background:none;border:0;padding:0;font:500 11px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:#777;cursor:pointer;text-decoration:underline;text-underline-offset:3px}.do-tl:hover{color:#000}',
    '.do-lp{display:flex;flex-direction:column;align-items:flex-end;gap:4px;text-align:right}.do-lp strong{font-weight:500;font-size:clamp(16px,1.4vw,19px)}.do-lp s{color:#aaa;font-size:13px}.do-lp small{color:#888;font-size:12px}',
    '@media(max-width:639px){.do-line{grid-template-columns:96px minmax(0,1fr)}.do-lp{grid-column:1/-1;flex-direction:row;justify-content:space-between;align-items:baseline;border-top:1px solid #eee;padding-top:12px}}',
    '.do-note{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:8px;padding:12px 18px;border:1px solid #e0e0e0;border-radius:999px;font-size:13px;color:#555;background:#fafafa}',
    '.do-sum{position:sticky;top:96px;background:#000;color:#fff;border-radius:20px;padding:clamp(22px,2.6vw,32px)}',
    '.do-sum .do-eyebrow{color:rgba(255,255,255,.6)}',
    '.do-srow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 0;font-size:14px;color:rgba(255,255,255,.78);border-bottom:1px solid rgba(255,255,255,.14)}.do-srow b{font-weight:500;color:#fff}',
    '.do-stotal{display:flex;justify-content:space-between;align-items:baseline;padding:18px 0 20px}.do-stotal span{font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.7)}.do-stotal b{font-size:clamp(28px,2.6vw,36px);font-weight:500;letter-spacing:-.03em}',
    '.do-who{display:grid;gap:8px;margin:0 0 18px;padding:16px 0 0;border-top:1px solid rgba(255,255,255,.14)}.do-who .do-eyebrow{margin-bottom:4px}',
    '.do-who input,.do-who textarea{width:100%;box-sizing:border-box;height:46px;padding:0 18px;border:1px solid rgba(255,255,255,.22);border-radius:999px;background:rgba(255,255,255,.04);color:#fff;font:400 16px Inter,sans-serif;outline:none;transition:border-color .2s}',
    '.do-who textarea{height:auto;min-height:64px;padding:12px 18px;border-radius:18px;resize:vertical;line-height:1.45}.do-who input::placeholder,.do-who textarea::placeholder{color:rgba(255,255,255,.45)}.do-who input:focus,.do-who textarea:focus{border-color:#fff}',
    '.do-sum .do-btn.w{width:100%;box-sizing:border-box;height:54px;background:#fff;color:#000;border-color:#fff}.do-sum .do-btn.w:hover{background:#e9e9e9}.do-sum .do-btn .do-arr{display:inline-block;margin-left:8px;transition:transform .25s}.do-sum .do-btn:hover .do-arr{transform:translateX(5px)}',
    '.do-perks2{margin:20px 0 0;padding:18px 0 0;border-top:1px solid rgba(255,255,255,.14);display:grid;gap:10px}.do-perks2 p{margin:0;display:flex;gap:10px;align-items:center;font-size:13px;color:rgba(255,255,255,.82)}',
    '.do-bar{display:none}@media(max-width:959px){.do-bar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;align-items:center;justify-content:space-between;gap:14px;padding:12px clamp(12px,3vw,24px) calc(12px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-top:1px solid #e8e8e8}.do-bar .do-btn{height:46px;padding:0 22px}}',
    '.do-sec{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:clamp(40px,6vw,80px) 0 16px}.do-sec h2{margin:0;font-size:clamp(24px,2.6vw,34px);font-weight:500;letter-spacing:-.03em}.do-sec a{font:500 11px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:#000}',
    '.do-emp{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding:clamp(36px,7vw,88px) 20px;border:1px solid #e0e0e0;border-radius:20px}.do-emp svg{opacity:.85}.do-emp h2{margin:0;font-size:clamp(26px,3vw,40px);font-weight:500;letter-spacing:-.035em}.do-emp p{margin:0 0 8px;max-width:420px;color:#666;font-size:15px;line-height:1.65}',
    '.do-wtools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:clamp(14px,2vw,24px)}',
    '.do-wc{gap:12px;animation:doUp .5s cubic-bezier(.2,.7,.2,1) both}.do-wc:hover{opacity:1}',
    '.do-wc>div:nth-child(2){align-items:flex-start!important}.do-wc>div:nth-child(2)>a{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;min-height:2.6em;line-height:1.3}',   // same-height name row, so size buttons line up across cards
    '.do-wc .do-szs{margin-top:2px}.do-wc .do-szs button{flex:1 0 calc(25% - 6px);min-width:0;height:34px;padding:0}',
    '.do-wc .do-btn{height:44px;width:100%;padding:0 12px;box-sizing:border-box}'
  ].join('');
  var stB = document.createElement('style'); stB.textContent = BW_CSS; (document.head || document.documentElement).appendChild(stB);
  var ICONBAG = '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"></path><path d="M9 8V6a3 3 0 016 0v2"></path></svg>';
  var ICONBM = '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14v18l-7-4-7 4V3z"></path></svg>';
  function catName(p) { var c = D.categories.filter(function (c) { return c.slug === p.category; })[0]; return c ? c.name : ''; }
  function suggest(title, exclude) {
    var l = (S.mostLoved || []).map(D.bySlug).filter(function (p) { return p && exclude.indexOf(p.slug) < 0; }).slice(0, 4);
    return l.length ? '<div class="do-sec"><h2>' + title + '</h2><a href="' + PAGE('most-loved') + '">View all →</a></div>' + gridHTML(l) : '';
  }

  R.bag = function () {
    if (!bag.length) {
      return head('Your Bag', '') + wrap('<div class="do-emp">' + ICONBAG + '<h2>Your bag is empty</h2><p>Pieces you add will wait here for you. Begin with something from the collection.</p><a class="do-btn" href="shop">Continue shopping</a></div>' + suggest('Most loved', []));
    }
    var save_ = 0, orig = 0;
    var rows = bag.map(function (it, i) {
      var p = D.bySlug(it.slug); if (!p) return '';
      var tot = unit(p) * it.qty; orig += p.price * it.qty; save_ += (p.price - unit(p)) * it.qty;
      return '<article class="do-line"><a href="' + D.href(p) + '"><div class="do-ph" style="border-radius:14px"><img src="' + D.card(p).img + '" alt="' + esc(p.name) + '"></div></a>'
        + '<div class="do-li"><div><p class="do-cat">' + esc(catName(p)) + '</p><a class="do-nm" href="' + D.href(p) + '">' + esc(p.name) + '</a></div>'
        + '<div class="do-szs" role="group" aria-label="Size">' + SIZES.map(function (s) { return '<button type="button" data-sz="' + i + '" data-v="' + s + '"' + (s === it.size ? ' class="on"' : '') + '>' + s + '</button>'; }).join('') + '</div>'
        + '<div class="do-act"><div class="do-qty"><button type="button" data-q="' + i + '" data-d="-1" aria-label="Fewer">−</button><span>' + it.qty + '</span><button type="button" data-q="' + i + '" data-d="1" aria-label="More">+</button></div>'
        + '<button type="button" class="do-tl" data-sv="' + i + '">Save for later</button><button type="button" class="do-tl" data-rm="' + i + '">Remove</button></div></div>'
        + '<div class="do-lp"><strong>' + D.inr(tot) + '</strong>' + (p.sale ? '<s>' + D.inr(p.price * it.qty) + '</s>' : '') + (it.qty > 1 ? '<small>' + D.inr(unit(p)) + ' each</small>' : '') + '</div></article>';
    }).join('');
    var undo = lastRemoved ? '<div class="do-note"><span>' + esc(lastRemoved.name) + ' removed.</span><button type="button" class="do-tl" data-undo="1">Undo</button></div>' : '';
    var perks = ['Gift wrapping on request', 'Exchanges within 7 days', 'A personal reply within hours'].map(function (t) { return '<p>' + ICON.check + t + '</p>'; }).join('');
    var summary = '<aside class="do-sum"><p class="do-eyebrow">Order summary</p>'
      + '<div class="do-srow" style="margin-top:12px"><span>Subtotal</span><b>' + D.inr(orig) + '</b></div>'
      + (save_ > 0 ? '<div class="do-srow"><span>Savings</span><b>− ' + D.inr(save_) + '</b></div>' : '')
      + '<div class="do-srow"><span>Delivery</span><b>With your concierge</b></div>'
      + '<div class="do-stotal"><span>Total</span><b>' + D.inr(bagTotal()) + '</b></div>'
      + (function () {
          var me = load('dolce-me', {});
          return '<div class="do-who" id="do-who"><p class="do-eyebrow" style="color:rgba(255,255,255,.6)">Your details</p>'
            + '<input id="do-wn" type="text" autocomplete="name" placeholder="Full name" value="' + esc(me.name || '') + '">'
            + '<input id="do-wp" type="tel" inputmode="tel" autocomplete="tel" placeholder="Mobile number" value="' + esc(me.phone || '') + '">'
            + '<textarea id="do-wa" autocomplete="street-address" rows="2" placeholder="Delivery address (optional)">' + esc(me.address || '') + '</textarea>'
            + '<p id="do-wm" role="status" aria-live="polite" style="display:none;margin:0;font-size:12px;color:#ff8a80"></p></div>';
        })()
      + '<a class="do-btn w" data-order="1" href="#">Order on WhatsApp<span class="do-arr">→</span></a>'
      + '<p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:rgba(255,255,255,.6);text-align:center">Payment and delivery are confirmed personally before anything is charged.</p>'
      + '<div class="do-perks2">' + perks + '</div></aside>';
    var bar = '<div class="do-bar"><div><div style="font:500 11px \'JetBrains Mono\',monospace;letter-spacing:.08em;text-transform:uppercase;color:#888">Total</div><div style="font-size:20px;font-weight:500;letter-spacing:-.02em">' + D.inr(bagTotal()) + '</div></div><a class="do-btn" data-order="1" href="#">Order on WhatsApp</a></div>';
    var inBag = bag.map(function (i) { return i.slug; });
    return head('Your Bag', bagCount() + (bagCount() === 1 ? ' piece' : ' pieces') + ' · held for you')
      + wrap('<div class="do-bagpage"><div class="do-bag"><div>' + undo + rows + '<a href="shop" class="do-tl" style="display:inline-block;margin-top:12px">← Continue shopping</a></div>' + summary + '</div>' + suggest('You may also love', inBag) + '</div>' + bar);
  };
  R.bag.after = function () {
    var main = document.getElementById('dolce-main');
    [['do-wn', 'name'], ['do-wp', 'phone'], ['do-wa', 'address']].forEach(function (f) {   // keep typed details across re-renders
      var el = document.getElementById(f[0]); if (!el) return;
      el.addEventListener('input', function () { var me = load('dolce-me', {}); me[f[1]] = el.value; save('dolce-me', me); });
    });
    main.onclick = function (e) {
      var q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]'), z = e.target.closest('[data-sz]'), sv = e.target.closest('[data-sv]'), u = e.target.closest('[data-undo]');
      if (q) { var it = bag[+q.getAttribute('data-q')]; it.qty += +q.getAttribute('data-d'); if (it.qty < 1) it.qty = 1; lastRemoved = null; }
      else if (z) {
        var a = bag[+z.getAttribute('data-sz')], v = z.getAttribute('data-v'); if (a.size === v) return;
        var twin = null; bag.forEach(function (b) { if (b !== a && b.slug === a.slug && b.size === v) twin = b; });
        if (twin) { twin.qty += a.qty; bag.splice(bag.indexOf(a), 1); } else a.size = v;
        lastRemoved = null;
      }
      else if (sv) {
        var s = bag.splice(+sv.getAttribute('data-sv'), 1)[0], sp = D.bySlug(s.slug);
        if (wish.indexOf(s.slug) < 0) { wish.push(s.slug); save('dolce-wish', wish); }
        lastRemoved = null; toast('Moved to wishlist');
      }
      else if (r) { var gone = bag.splice(+r.getAttribute('data-rm'), 1)[0], gp = D.bySlug(gone.slug); lastRemoved = { it: gone, at: +r.getAttribute('data-rm'), name: gp ? gp.name : 'Piece' }; }
      else if (u && lastRemoved) { bag.splice(lastRemoved.at, 0, lastRemoved.it); lastRemoved = null; }
      else return;
      e.preventDefault();
      save('dolce-bag', bag); paint(); render();
    };
    [].forEach.call(main.querySelectorAll('[data-order]'), function (o) {
      o.addEventListener('click', function (e) {
        e.preventDefault();
        if (needLogin({ t: 'order' })) return;
        var me = load('dolce-me', {}), wn = document.getElementById('do-wn'), wp = document.getElementById('do-wp'), wad = document.getElementById('do-wa'), wm = document.getElementById('do-wm');
        if (wn) {
          var nm = wn.value.trim(), ph = wp.value.trim(), digits = ph.replace(/\D/g, '');
          function bad(t, el) { wm.textContent = t; wm.style.display = 'block'; document.getElementById('do-who').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(function () { el.focus({ preventScroll: true }); }, 350); }
          if (nm.length < 2) { bad('Please add your name so we know who the order is for.', wn); return; }
          if (digits.length < 10) { bad('Please add a mobile number we can confirm the order on.', wp); return; }
          wm.style.display = 'none';
          me.name = nm; me.phone = ph; me.address = wad.value.trim(); save('dolce-me', me);
        }
        var lines = bag.map(function (it) { var p = D.bySlug(it.slug); return '- ' + p.name + ' | size ' + it.size + ' | qty ' + it.qty + ' | ' + D.inr(unit(p) * it.qty); });
        var msg = 'Hello Dolce Orso, I would like to place an order:\n' + lines.join('\n') + '\nTotal: ' + D.inr(bagTotal())
          + (me.name ? '\nName: ' + me.name : '') + (me.phone ? '\nPhone: ' + me.phone : '') + (me.address ? '\nDelivery address: ' + me.address : '');
        window.open(wa(msg), '_blank');
      });
    });
  };

  function wishCard(p) {
    var c = D.card(p), sz = wsz[p.slug] || 'M';
    return '<div class="do-card do-wc"><a href="' + c.href + '" style="display:block"><div class="do-ph"><img loading="lazy" decoding="async" src="' + c.img + '" alt="' + esc(p.name) + '"><img class="h" data-hover="' + c.hoverImg + '" alt="">'
      + (p.sale ? '<div style="position:absolute;top:8px;left:8px;background:#333;color:#fff;font-size:11px;font-weight:500;padding:3px 8px;border-radius:3px;font-family:\'JetBrains Mono\',monospace">-20%</div>' : '')
      + '<div data-wish="' + p.slug + '" aria-label="Remove from wishlist" style="position:absolute;top:8px;right:8px;background:rgba(255,255,255,.88);border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + BM + '</div></div></a>'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:0 2px"><a href="' + c.href + '" style="color:#000;text-decoration:none;font-size:clamp(13px,1.1vw,15px);font-weight:500;line-height:1.3">' + esc(p.name) + '</a>'
      + '<span style="font-size:13px;white-space:nowrap">' + (p.sale ? '<s style="color:#aaa;font-size:12px;margin-right:6px">' + D.inr(p.price) + '</s><b style="font-weight:600">' + D.inr(D.salePrice(p)) + '</b>' : '<b style="font-weight:500">' + D.inr(p.price) + '</b>') + '</span></div>'
      + '<div class="do-szs" role="group" aria-label="Size">' + SIZES.map(function (s) { return '<button type="button" data-ws="' + p.slug + '" data-v="' + s + '"' + (s === sz ? ' class="on"' : '') + '>' + s + '</button>'; }).join('') + '</div>'
      + '<button type="button" class="do-btn" data-wadd="' + p.slug + '">Add to bag</button></div>';
  }
  R.wishlist = function () {
    var list = wish.map(D.bySlug).filter(Boolean);
    if (!list.length) {
      return head('Wishlist', '') + wrap('<div class="do-emp">' + ICONBM + '<h2>Nothing saved yet</h2><p>Tap the bookmark on any piece to keep it here, then choose a size when you are ready.</p><a class="do-btn" href="shop">Start browsing</a></div>' + suggest('Most loved', []));
    }
    var tools = '<div class="do-wtools"><span style="font:500 11px \'JetBrains Mono\',monospace;letter-spacing:.06em;text-transform:uppercase;color:#888">Choose a size, then add to bag</span>'
      + '<a class="do-btn o" id="do-wshare" href="#" style="height:40px;padding:0 20px">Ask the concierge about these</a></div>';
    return head('Wishlist', list.length + (list.length === 1 ? ' piece' : ' pieces') + ' saved')
      + wrap(tools + '<div class="do-grid">' + list.map(wishCard).join('') + '</div>' + suggest('You may also love', wish));
  };
  R.wishlist.after = function () {
    var main = document.getElementById('dolce-main');
    main.onclick = function (e) {
      var s = e.target.closest('[data-ws]'), a = e.target.closest('[data-wadd]');
      if (s) {
        var slug = s.getAttribute('data-ws'); wsz[slug] = s.getAttribute('data-v');
        [].forEach.call(main.querySelectorAll('[data-ws="' + slug + '"]'), function (b) { b.classList.toggle('on', b === s); });
      } else if (a) {
        var sl = a.getAttribute('data-wadd'), size = wsz[sl] || 'M';
        if (needLogin({ t: 'add', slug: sl, size: size })) return;
        addToBag(sl, size, 1); toast('Added to bag');
        a.textContent = 'Added ✓ · size ' + size; a.disabled = true;
        setTimeout(function () { if (document.body.contains(a)) { a.textContent = 'Add to bag'; a.disabled = false; } }, 1800);
      }
    };
    var sh = document.getElementById('do-wshare');
    if (sh) sh.addEventListener('click', function (e) {
      e.preventDefault();
      var names = wish.map(D.bySlug).filter(Boolean).map(function (p) { return '- ' + p.name + ' (' + D.inr(unit(p)) + ')'; });
      window.open(wa('Hello Dolce Orso, I have saved these pieces and would love your advice:\n' + names.join('\n')), '_blank');
    });
  };
  R.search = function () {
    var q = (new URLSearchParams(location.search).get('q') || '').trim(), ql = q.toLowerCase();
    var words = ql.split(/\s+/).filter(Boolean);
    var res = !words.length ? [] : D.products.filter(function (p) {
      var cat = D.categories.filter(function (c) { return c.slug === p.category; })[0];
      var hay = (p.name + ' ' + (cat ? cat.name : '') + ' ' + p.category.replace('-', ' ') + ' ' + p.category.replace('-', '') + ' ' + (p.details || []).join(' ') + ' ' + (p.description || '') + (p.sale ? ' sale' : '')).toLowerCase();
      return words.every(function (w) {
        if (hay.indexOf(w) > -1) return true;
        return [w.replace(/s$/, ''), w.replace(/es$/, '')].some(function (s) { return s !== w && s.length > 2 && hay.indexOf(s) > -1; });   // "tees" -> "tee", "jackets" -> "jacket", "boxes" -> "box"
      });
    });
    // best matches first: name hits before description-only hits
    res.sort(function (a, b) {
      function score(p) { var n = p.name.toLowerCase(); return words.filter(function (w) { return n.indexOf(w.replace(/s$/, '')) > -1; }).length; }
      return score(b) - score(a);
    });
    var body = '<form id="do-sf" style="display:flex;gap:8px;max-width:560px;margin-bottom:28px"><input class="do-input" name="q" value="' + esc(q) + '" placeholder="Search our collection..." autofocus><button class="do-btn" type="submit">Search</button></form>'
      + (res.length ? gridHTML(res) : empty(q ? 'No pieces matched “' + esc(q) + '”. Try “jeans”, “hoodie” or “pink”.' : 'Type something to search.', 'Shop All', 'shop'));
    return head('Search', q ? res.length + ' result' + (res.length === 1 ? '' : 's') + ' for “' + esc(q) + '”' : '') + wrap(body);
  };
  R.search.after = function () {
    var f = document.getElementById('do-sf');
    f.addEventListener('submit', function (e) { e.preventDefault(); location.href = PAGE('search') + '?q=' + encodeURIComponent(f.q.value); });
  };
  function listPage(title, lead, slugs) { return function () { return head(title, lead) + wrap(gridHTML(slugs.map(D.bySlug).filter(Boolean))); }; }
  R['gift-guide'] = listPage('Gift Guide', 'Coordinated sets and easy gifting pieces for the little gentleman in your life.', S.gifts || []);
  R['most-loved'] = listPage('Most Loved', 'The pieces our customers come back to, season after season.', S.mostLoved || []);
  R.collections = function () {
    var tiles = D.categories.map(function (c) {
      var n = D.products.filter(function (p) { return p.category === c.slug; }).length;
      return '<a href="' + c.page + '" class="do-card"><div class="do-ph" style="aspect-ratio:3/4"><img src="' + D.cover(c.slug) + '" alt=""></div>'
        + '<div style="padding:0 2px"><p style="margin:0;font-size:17px;font-weight:500">' + esc(c.name) + '</p><p style="margin:2px 0 0;font-size:11px;color:#888;' + MONO + '">' + n + ' pieces</p></div></a>';
    }).join('');
    return head('Collections', 'Our Autumn/Winter wardrobe, by chapter.') + wrap('<div class="do-grid">' + tiles + '</div>');
  };

  /* ---------- sign in (Google + mobile OTP via Firebase; keys in settings.js) ---------- */
  function session() { return load('dolce-session', null); }
  var FB_VER = '10.12.2', fbReady = null;
  function loadScript(src, cb, er) { var s = document.createElement('script'); s.src = src; s.onload = cb; s.onerror = er; document.head.appendChild(s); }
  function firebaseConfigured() { var c = S.firebase; return !!(c && c.apiKey && c.projectId); }
  function withFirebase(cb, fail) {
    if (!firebaseConfigured()) { fail('not-configured'); return; }
    if (window.firebase && firebase.apps && firebase.apps.length) { cb(window.firebase); return; }
    if (fbReady) { fbReady.push([cb, fail]); return; }
    fbReady = [[cb, fail]];
    var base = 'https://www.gstatic.com/firebasejs/' + FB_VER + '/';
    function done(err) { var q = fbReady; fbReady = null; q.forEach(function (p) { err ? p[1]('load') : p[0](window.firebase); }); }
    loadScript(base + 'firebase-app-compat.js', function () {
      loadScript(base + 'firebase-auth-compat.js', function () {
        try { firebase.initializeApp(S.firebase); done(); } catch (e) { done(e); }
      }, function () { done(true); });
    }, function () { done(true); });
  }
  function authError(e) {
    var c = (e && e.code) || e;
    var m = {
      'not-configured': 'Sign-in is not switched on yet. The store owner needs to add the Firebase keys in settings.js.',
      'load': 'Could not reach the sign-in service. Check your internet and try again.',
      'auth/invalid-phone-number': 'That mobile number does not look right. Please check it.',
      'auth/missing-phone-number': 'Please enter your mobile number.',
      'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
      'auth/invalid-verification-code': 'That code is not right. Please check and try again.',
      'auth/code-expired': 'That code has expired. Please ask for a new one.',
      'auth/quota-exceeded': 'We cannot send more codes right now. Please try again later or use Google.',
      'auth/unauthorized-domain': 'This website address is not approved for sign-in yet (Firebase: Authorized domains).',
      'auth/operation-not-allowed': 'This sign-in method is not turned on in Firebase yet.',
      'auth/network-request-failed': 'Network problem. Please try again.'
    };
    return m[c] || ((e && e.message) ? e.message : 'Something went wrong. Please try again.');
  }
  function finishLogin(user, provider) {
    var me = load('dolce-me', {});
    var sess = { uid: user.uid, provider: provider, phone: user.phoneNumber || '', email: user.email || '', name: user.displayName || '', at: Date.now() };
    save('dolce-session', sess);
    if (provider !== 'preview' && sess.name && !me.name) me.name = sess.name;
    if (sess.phone && !me.phone) me.phone = sess.phone;
    if (sess.email && !me.email) me.email = sess.email;
    save('dolce-me', me);
    var next = new URLSearchParams(location.search).get('next');
    location.href = (next && /^[\w .\-?=&%]+$/.test(next) && next.indexOf('//') < 0) ? next : PAGE('account');
  }
  function signOut() {
    save('dolce-session', null);
    try { localStorage.removeItem('dolce-session'); } catch (e) {}
    try { if (window.firebase && firebase.apps.length) firebase.auth().signOut(); } catch (e) {}
    location.href = PAGE('login');
  }
  var GLOGO = '<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.5 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 010-9.4l-7.9-6.1a24 24 0 000 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
  var ICON = {
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" opacity=".45"></circle><path d="M7.5 12.5l3 3 6-6.5"></path></svg>',
    lock: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 018 0v3"></path></svg>',
    phone: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"></path></svg>',
    mail: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>',
    wa: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.6-4.6A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4-1L3 21z"></path><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 01-1.8-1.8l.8-1-1-2L9 9.5z"></path></svg>'
  };
  var ARR = ' <span class="do-arr">→</span>';
  var AUTH_CSS = [
    '.do-auth{display:grid;grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr);gap:8px;padding:8px clamp(8px,1vw,16px);box-sizing:border-box;overflow:hidden}',
    '@media(min-width:900px){.do-auth{grid-template-columns:clamp(340px,33vw,470px) minmax(0,1fr);grid-template-rows:minmax(0,1fr);max-width:1100px;margin:0 auto;gap:clamp(8px,2vw,40px)}}',
    '.do-auth-side{position:relative;background:#000;color:#fff;border-radius:20px;overflow:hidden;min-height:0}',
    '.do-slide{position:absolute;inset:0;background-size:cover;background-position:center 20%;opacity:0;transition:opacity .7s ease}',
    '.do-slide.on{opacity:1;animation:doZoom 4s ease-out forwards}@keyframes doZoom{from{transform:scale(1)}to{transform:scale(1.07)}}',
    '.do-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,0) 28%,rgba(0,0,0,.1) 46%,rgba(0,0,0,.9) 100%)}',
    '.do-side-in{position:relative;z-index:2;height:100%;box-sizing:border-box;padding:clamp(20px,2.6vw,40px);display:flex;flex-direction:column;justify-content:space-between;gap:16px}',
    '.do-eyebrow{margin:0;font:500 11px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase}',
    '.do-big{margin:0 0 16px;font-size:clamp(34px,3.6vw,60px);font-weight:500;letter-spacing:-.05em;line-height:.98}',
    '.do-perk{margin:0 0 8px;display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,.92)}',
    '.do-pills{display:grid;gap:8px}.do-pill{display:flex;align-items:center;justify-content:center;gap:7px;padding:12px 6px;border-radius:14px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.2);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;text-decoration:none;font-size:13px;transition:background .25s}.do-pill:hover{background:rgba(255,255,255,.26)}',
    '.do-cap{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.28);color:#fff;text-decoration:none;font:500 11px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase}',
    '.do-dots{display:flex;gap:6px;margin-top:12px}.do-dots i{width:20px;height:2px;background:rgba(255,255,255,.35);transition:background .5s}.do-dots i.on{background:#fff}',
    '.do-auth-main{display:flex;min-height:0;overflow-y:auto;padding:clamp(4px,1vh,16px) clamp(4px,2vw,24px)}',
    '.do-auth-form{width:100%;max-width:540px;margin:auto;display:flex;flex-direction:column;gap:clamp(12px,2.2vh,22px);animation:doUp .7s cubic-bezier(.2,.7,.2,1) both}',
    '@keyframes doUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}.do-step{animation:doUp .45s cubic-bezier(.2,.7,.2,1) both}',
    '.do-auth-form h1{margin:0;font-size:clamp(30px,3.4vw,46px);font-weight:500;letter-spacing:-.045em;line-height:1.02}',
    '.do-auth .do-btn{height:52px;width:100%;gap:10px}.do-auth .do-btn .do-arr{display:inline-block;transition:transform .25s ease}.do-auth .do-btn:hover .do-arr{transform:translateX(5px)}.do-btn[disabled]{opacity:.55;cursor:default}',
    '.do-auth .do-input{height:50px;transition:border-color .2s,box-shadow .2s}.do-auth .do-input:focus,.do-phone:focus-within,.do-otp input:focus{border-color:#000;box-shadow:0 0 0 4px rgba(0,0,0,.06)}',
    '.do-auth textarea.do-input{height:84px}.do-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.do-chips{display:flex;flex-wrap:wrap;gap:8px}.do-chip{height:36px;padding:0 14px;border:1px solid #ddd;border-radius:999px;background:#fff;font:500 11px "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:#000;cursor:pointer;transition:all .2s}.do-chip:hover{border-color:#000}.do-chip.on{background:#000;color:#fff;border-color:#000}',
    '.do-otp{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.do-otp input{width:100%;height:58px;text-align:center;font:500 22px Inter,sans-serif;border:1px solid #ddd;border-radius:14px;outline:none;background:#fff;color:#000;box-sizing:border-box;padding:0;transition:border-color .2s,box-shadow .2s}.do-otp input.f{border-color:#000}',
    '.do-link{background:none;border:0;padding:0;font:inherit;color:#000;text-decoration:underline;cursor:pointer}.do-link[disabled]{color:#999;text-decoration:none;cursor:default}',
    '.do-phone{display:flex;align-items:center;border:1px solid #ddd;border-radius:999px;height:52px;overflow:hidden;background:#fff;transition:border-color .2s,box-shadow .2s}',
    '.do-phone span{padding:0 14px 0 20px;font-size:15px;color:#000;border-right:1px solid #e8e8e8;height:24px;display:flex;align-items:center}.do-phone input{flex:1;min-width:0;height:100%;border:0;outline:0;padding:0 18px;font:400 16px Inter,sans-serif;letter-spacing:.02em;background:transparent;box-shadow:none}',
    '.do-live{display:inline-block;width:7px;height:7px;border-radius:50%;background:#2a7a3b;margin-right:8px;box-shadow:0 0 0 0 rgba(42,122,59,.5);animation:doPulse 2s infinite}@keyframes doPulse{70%{box-shadow:0 0 0 8px rgba(42,122,59,0)}100%{box-shadow:0 0 0 0 rgba(42,122,59,0)}}',
    '.do-solo{grid-template-columns:1fr!important;grid-template-rows:minmax(0,1fr)!important;max-width:none!important}.do-solo .do-auth-form{max-width:420px;text-align:center}.do-solo .do-auth-form h1{font-size:clamp(34px,3.4vw,48px)}.do-solo .do-link{text-align:center}.do-auth-form.has-why .do-sub{display:none!important}',
    '.do-auth-form.pv .do-g,.do-auth-form.pv .do-or,.do-auth-form.pv #do-phone,.do-auth-form.pv #do-otpf,.do-auth-form.pv .do-prev{display:none!important}',
    '.do-m{display:none}.do-auth-form.otp .do-g,.do-auth-form.otp .do-or,.do-auth-form.otp .do-prev,.do-auth-form.otp #do-guest{display:none!important}',
    '@media(max-height:640px){.do-prev{display:none}.do-auth-form{gap:9px}}',
    '@media(max-width:899px){.do-auth-side{min-height:150px}.do-side-in{padding:16px 20px;gap:6px;justify-content:flex-end}.do-side-in .do-eyebrow{position:absolute;top:16px;left:20px}.do-perks,.do-cap,.do-dots{display:none!important}.do-big{font-size:30px!important;margin:0!important}.do-big br{display:none}.do-m{display:block}}',
    '@media(max-width:899px) and (max-height:760px){.do-auth-side{display:none}.do-auth{grid-template-rows:minmax(0,1fr)}}',
    '@media(max-width:899px) and (min-height:900px){.do-auth{grid-template-rows:minmax(0,.3fr) minmax(0,1fr)}.do-side-in{padding:28px}.do-big{font-size:clamp(40px,8vw,56px)!important}.do-big br{display:inline}}',
    '@media(max-width:899px) and (max-height:860px){.do-sub,.do-opt{display:none!important}.do-auth-side{min-height:96px}.do-big{font-size:26px!important}.do-auth-form{gap:11px}.do-auth-form h1{font-size:28px}.do-auth .do-btn,.do-phone{height:46px}.do-auth .do-input{height:46px}.do-otp input{height:50px}.do-auth textarea.do-input{height:64px}}',
    '@media(max-height:740px){.do-sub,.do-opt{display:none!important}.do-auth-form{gap:11px}.do-auth-form h1{font-size:28px}.do-auth .do-btn{height:46px}.do-phone{height:46px}.do-otp input{height:50px}.do-auth .do-input{height:46px}.do-auth textarea.do-input{height:64px}}',
    '@media(prefers-reduced-motion:reduce){.do-slide.on,.do-auth-form,.do-step,.do-live{animation:none}}'
  ].join('');
  function authSlides() {
    return (S.authPhotos || []).map(D.bySlug).filter(Boolean).map(function (p) { return { src: D.hero(p), name: p.name, href: D.href(p) }; });
  }
  function authSide(label, headline, bottom) {
    var ph = authSlides();
    return '<aside class="do-auth-side">'
      + ph.map(function (p, i) { return '<div class="do-slide' + (i ? '' : ' on') + '" style="background-image:url(\'' + esc(p.src) + '\')" data-name="' + esc(p.name) + '" data-href="' + esc(p.href) + '"></div>'; }).join('')
      + '<div class="do-shade"></div><div class="do-side-in">'
      + '<p class="do-eyebrow" style="color:rgba(255,255,255,.8)">' + label + '</p>'
      + '<div><p class="do-big">' + headline + '</p><div class="do-perks">' + bottom + '</div>'
      + (ph.length ? '<a id="do-cap" class="do-cap" href="' + esc(ph[0].href) + '"><span>' + esc(ph[0].name) + '</span><span aria-hidden="true">→</span></a>'
        + (ph.length > 1 ? '<div class="do-dots">' + ph.map(function (p, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div>' : '') : '')
      + '</div></div></aside>';
  }
  function startSlides() {
    var side = document.querySelector('.do-auth-side'); if (!side) return;
    var sl = [].slice.call(side.querySelectorAll('.do-slide')), dots = [].slice.call(side.querySelectorAll('.do-dots i')), cap = document.getElementById('do-cap'), i = 0;
    if (sl.length < 2) return;
    var t = setInterval(function () {
      if (!document.body.contains(side)) { clearInterval(t); return; }
      sl[i].classList.remove('on'); if (dots[i]) dots[i].classList.remove('on');
      i = (i + 1) % sl.length;
      sl[i].classList.add('on'); if (dots[i]) dots[i].classList.add('on');
      if (cap) { cap.href = sl[i].getAttribute('data-href'); cap.firstChild.textContent = sl[i].getAttribute('data-name'); }
    }, 2800);
  }
  R.login = function () {
    if (session()) { return head('Signed in', '') + wrap('<div class="do-box" style="max-width:440px"><p class="do-txt">You are already signed in. Welcome back.</p><a class="do-btn" href="' + PAGE('account') + '">Enter my account</a></div>', true); }
    var pend = load(PENDING, null), why = !pend ? '' : { add: 'Sign in to reserve this piece in your bag.', buy: 'Sign in to complete your purchase.', wish: 'Sign in to keep this among your favourites.', order: 'Sign in to place your order.' }[pend.t] || '';
    return '<style>' + AUTH_CSS + '</style><section class="do-auth do-solo do-fit">'
      + '<div class="do-auth-main"><div class="do-auth-form' + (why ? ' has-why' : '') + (firebaseConfigured() ? '' : ' pv') + '">'
      + '<div style="display:flex;flex-direction:column;gap:10px"><p class="do-eyebrow do-opt" style="color:#888">Maison Dolce Orso</p><h1>' + (firebaseConfigured() ? 'Welcome back' : 'Almost there') + '</h1><p class="do-sub" style="margin:0;color:#666;font-size:15px;line-height:1.6">' + (firebaseConfigured() ? 'Keep favourites, follow orders and be looked after personally.' : 'Tell us who you are and we will look after the rest.') + '</p></div>'
      + (why ? '<p style="margin:0;padding:12px 16px;border:1px solid #000;border-radius:14px;font-size:14px;line-height:1.5">' + why + ' We will bring you straight back.</p>' : '')
      + (firebaseConfigured() ? '' : '<p class="do-prev" style="margin:0;padding:9px 14px;border-radius:999px;background:#f4f4f4;color:#666;font-size:11px;text-align:center;' + MONO + '">Preview · private accounts open at launch</p>')
      + '<button id="do-google" type="button" class="do-btn o do-g" style="gap:12px">' + GLOGO + 'Continue with Google</button>'
      + '<div class="do-or" style="display:flex;align-items:center;gap:12px;color:#999;font-size:11px;' + MONO + '"><span style="flex:1;height:1px;background:#e8e8e8"></span>or with your mobile<span style="flex:1;height:1px;background:#e8e8e8"></span></div>'
      + '<form id="do-phone" class="do-step" novalidate style="display:flex;flex-direction:column;gap:14px"><label class="do-lbl" for="do-num" style="margin:0">Mobile number</label>'
      + '<div class="do-phone"><span>+91</span><input id="do-num" name="num" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="11" placeholder="98765 43210"></div>'
      + '<button id="do-send" class="do-btn" type="submit">Send my code' + ARR + '</button></form>'
      + '<form id="do-otpf" class="do-step" novalidate style="display:none;flex-direction:column;gap:16px">'
      + '<div style="display:flex;justify-content:space-between;align-items:center"><button type="button" id="do-change" class="do-link" style="font-size:13px;color:#555;text-decoration:none">← Change number</button><span style="font-size:11px;color:#999;' + MONO + '">Step 2 of 2</span></div>'
      + '<div><p class="do-lbl" style="margin:0 0 6px">Your six-digit code</p><p id="do-sent" style="margin:0;color:#666;font-size:14px;line-height:1.5"></p></div>'
      + '<div class="do-otp" id="do-otp">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input type="text" inputmode="numeric" maxlength="1" aria-label="Digit ' + (i + 1) + '"' + (i === 0 ? ' autocomplete="one-time-code"' : '') + '>'; }).join('') + '</div>'
      + '<button id="do-verify" class="do-btn" type="submit">Confirm and continue' + ARR + '</button>'
      + '<p style="margin:0;font-size:13px;color:#666;text-align:center"><span id="do-timer"></span><button type="button" id="do-resend" class="do-link" disabled>Resend code</button></p></form>'
      + '<p id="do-msg" role="status" aria-live="polite" style="margin:0;font-size:13px;line-height:1.5;color:#b3261e;display:none"></p>'
      + '<div id="do-recaptcha"></div>'
      + (firebaseConfigured() ? '' : '<form id="do-guestf" novalidate style="display:flex;flex-direction:column;gap:12px">'
        + '<label class="do-lbl" for="do-gname" style="margin:0">Your name</label><input id="do-gname" class="do-input" type="text" autocomplete="name" placeholder="Full name">'
        + '<label class="do-lbl" for="do-gnum" style="margin:4px 0 0">Mobile number</label><div class="do-phone"><span>+91</span><input id="do-gnum" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="11" placeholder="98765 43210"></div>'
        + '<button id="do-guest" class="do-btn" type="submit" style="margin-top:4px">Continue' + ARR + '</button>'
        + '<p style="margin:0;font-size:12px;color:#888;line-height:1.6;text-align:center">We use these only to confirm your order with you on WhatsApp.</p></form>')
      + (firebaseConfigured() ? '<p class="do-opt" style="margin:0;font-size:12px;color:#999;line-height:1.6;display:flex;align-items:center;justify-content:center;gap:6px">' + ICON.lock + 'Your number is used only to sign you in.</p>' : '')
      + '<p style="margin:0;font-size:12px;color:#999;line-height:1.6">By continuing you accept our <a href="' + PAGE('terms') + '" style="color:#555">Terms of Service</a>.</p>'
      + '</div></div></section>';
  };
  R.login.after = function () {
    if (!document.getElementById('do-google')) return;
    var confirmation = null, verifier = null, busy = false, preview = !firebaseConfigured(), timerId = null;
    var PREVIEW_MSG = 'This is a preview. Secure sign-in opens when the house launches online.';
    var $ = function (id) { return document.getElementById(id); };
    var boxes = [].slice.call($('do-otp').querySelectorAll('input'));
    function msg(t, kind) { var m = $('do-msg'); m.style.display = t ? 'block' : 'none'; m.style.color = kind === 'note' ? '#666' : kind === 'ok' ? '#2a7a3b' : '#b3261e'; m.textContent = t || ''; }
    function lock(on, label) {
      busy = on;
      [['do-google', null], ['do-send', 'Send my code'], ['do-verify', 'Confirm and continue']].forEach(function (p) {
        var b = $(p[0]); if (!b) return; b.disabled = on;
        if (p[1] && on && label === p[0]) b.innerHTML = p[0] === 'do-send' ? 'Sending…' : 'Verifying…'; else if (p[1]) b.innerHTML = p[1] + ARR;
      });
    }
    function code() { return boxes.map(function (b) { return b.value; }).join(''); }
    function showPhone() { document.querySelector('.do-auth-form').classList.remove('otp'); $('do-otpf').style.display = 'none'; $('do-phone').style.display = 'flex'; clearInterval(timerId); }
    function startTimer() {
      var n = 30, r = $('do-resend'), t = $('do-timer'); r.disabled = true; clearInterval(timerId);
      function tick() { if (n > 0) { t.textContent = 'Resend code in 0:' + (n < 10 ? '0' : '') + n + ' '; r.style.display = 'none'; n--; } else { clearInterval(timerId); t.textContent = 'Not received? '; r.style.display = ''; r.disabled = false; } }
      tick(); timerId = setInterval(tick, 1000);
    }
    function verify() {
      if (busy) return;
      var c = code();
      if (c.length !== 6) { msg('Please enter the 6-digit code.'); return; }
      if (preview) { msg(PREVIEW_MSG, 'note'); return; }
      msg(''); lock(true, 'do-verify');
      confirmation.confirm(c).then(function (r) { finishLogin(r.user, 'phone'); })
        .catch(function (e) { lock(false); msg(authError(e)); boxes.forEach(function (b) { b.value = ''; b.classList.remove('f'); }); boxes[0].focus(); });
    }
    boxes.forEach(function (b, i) {
      b.addEventListener('input', function () {
        b.value = b.value.replace(/\D/g, '').slice(-1); b.classList.toggle('f', !!b.value);
        if (b.value && i < 5) boxes[i + 1].focus();
        if (code().length === 6) verify();
      });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !b.value && i > 0) { boxes[i - 1].value = ''; boxes[i - 1].classList.remove('f'); boxes[i - 1].focus(); }
        else if (e.key === 'ArrowLeft' && i > 0) boxes[i - 1].focus();
        else if (e.key === 'ArrowRight' && i < 5) boxes[i + 1].focus();
      });
      b.addEventListener('paste', function (e) {
        var d = ((e.clipboardData || window.clipboardData).getData('text') || '').replace(/\D/g, '').slice(0, 6); if (!d) return;
        e.preventDefault(); boxes.forEach(function (x, k) { x.value = d[k] || ''; x.classList.toggle('f', !!x.value); });
        boxes[Math.min(d.length, 5)].focus(); if (d.length === 6) verify();
      });
      b.addEventListener('focus', function () { b.select(); });
    });
    $('do-num').addEventListener('input', function () {
      var d = this.value.replace(/\D/g, '').slice(0, 10); this.value = d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
    });
    if (firebaseConfigured()) withFirebase(function () {}, function () {});   // preload so the Google pop-up opens instantly
    $('do-google').addEventListener('click', function () {
      if (busy) return; msg('');
      if (preview) { msg(PREVIEW_MSG, 'note'); return; }
      if (!(window.firebase && firebase.apps && firebase.apps.length)) { withFirebase(function () { msg('Ready. Tap again.', 'ok'); }, function (c) { msg(authError(c)); }); return; }
      lock(true);
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(function (r) { finishLogin(r.user, 'google'); })
        .catch(function (e) { lock(false); if (e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request')) return; msg(authError(e)); });
    });
    function toOtp(raw) {
      document.querySelector('.do-auth-form').classList.add('otp'); $('do-phone').style.display = 'none'; $('do-otpf').style.display = 'flex';
      $('do-sent').textContent = (preview ? 'A code will be sent by SMS to ' : 'We have sent a code by SMS to ') + '+91 ' + raw.slice(0, 5) + ' ' + raw.slice(5) + '.';
      boxes.forEach(function (b) { b.value = ''; b.classList.remove('f'); }); boxes[0].focus(); startTimer();
    }
    function sendCode() {
      var raw = $('do-num').value.replace(/\D/g, '');
      if (raw.length !== 10) { msg('Please enter your 10-digit mobile number.'); $('do-num').focus(); return; }
      msg('');
      if (preview) { toOtp(raw); msg(PREVIEW_MSG, 'note'); return; }
      lock(true, 'do-send');
      withFirebase(function (fb) {
        try { if (verifier) verifier.clear(); } catch (e) {}
        $('do-recaptcha').innerHTML = '';
        verifier = new fb.auth.RecaptchaVerifier('do-recaptcha', { size: 'invisible' });
        fb.auth().signInWithPhoneNumber('+91' + raw, verifier).then(function (cr) { confirmation = cr; lock(false); toOtp(raw); })
          .catch(function (e) { lock(false); try { verifier.clear(); } catch (x) {} verifier = null; msg(authError(e)); });
      }, function (c) { lock(false); msg(authError(c)); });
    }
    $('do-phone').addEventListener('submit', function (e) { e.preventDefault(); if (!busy) sendCode(); });
    $('do-otpf').addEventListener('submit', function (e) { e.preventDefault(); verify(); });
    $('do-change').addEventListener('click', function () { msg(''); showPhone(); $('do-num').focus(); });
    $('do-resend').addEventListener('click', function () { if (!busy) { showPhone(); sendCode(); } });
    var gf = $('do-guestf');
    if (gf) {
      var gme = load('dolce-me', {});
      if (gme.name) $('do-gname').value = gme.name;
      if (gme.phone) { var gd = gme.phone.replace(/\D/g, '').slice(-10); $('do-gnum').value = gd.slice(0, 5) + ' ' + gd.slice(5); }
      $('do-gnum').addEventListener('input', function () { var d = this.value.replace(/\D/g, '').slice(0, 10); this.value = d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d; });
      gf.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = $('do-gname').value.trim(), raw = $('do-gnum').value.replace(/\D/g, '');
        if (name.length < 2) { msg('Please enter your name.'); $('do-gname').focus(); return; }
        if (raw.length !== 10) { msg('Please enter your 10-digit mobile number.'); $('do-gnum').focus(); return; }
        var me = load('dolce-me', {}); me.name = name; me.phone = '+91 ' + raw.slice(0, 5) + ' ' + raw.slice(5); save('dolce-me', me);
        finishLogin({ uid: 'guest', displayName: name, phoneNumber: '+91' + raw }, 'preview');
      });
    }
    startSlides();
    $('do-num').focus();
  };
  R.account = function () {
    var me = load('dolce-me', {});
    var f = formRows([{ l: 'Name', n: 'name' }, { l: 'Phone', n: 'phone' }, { l: 'Delivery address', n: 'address', t: 'area' }]);
    var ss = session();
    var who = ss ? '<div class="do-box" style="margin-bottom:clamp(20px,3vw,40px);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><div><p class="do-lbl" style="margin-bottom:4px">Signed in</p><p style="margin:0;font-size:15px">' + esc(ss.name || ss.email || ss.phone || (ss.provider === 'preview' ? 'Guest (preview)' : 'Your account')) + (ss.name && (ss.email || ss.phone) ? ' <span style="color:#888">· ' + esc(ss.email || ss.phone) + '</span>' : '') + '</p></div><button id="do-out" class="do-btn o" type="button">Sign out</button></div>'
      : '<div class="do-box" style="margin-bottom:clamp(20px,3vw,40px);display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap"><p style="margin:0;font-size:15px">Sign in to keep your details, favourites and orders in one place.</p><a class="do-btn" href="' + PAGE('login') + '">Sign in</a></div>';
    return head('My Account', 'Keep your details with us once. We will have them ready whenever you order.')
      + wrap(who + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr));gap:clamp(20px,3vw,40px)">'
        + '<form id="do-me" class="do-box">' + f + '<button class="do-btn" type="submit" style="margin-top:6px">Save details</button><span id="do-saved" style="margin-left:14px;font-size:13px;color:#2a7a3b"></span></form>'
        + '<div class="do-box"><p class="do-lbl">Quick links</p>' + [['Your bag (' + bagCount() + ')', PAGE('bag')], ['Wishlist (' + wish.length + ')', PAGE('wishlist')], ['Track an order', PAGE('order-tracking')], ['Delivery information', PAGE('delivery')], ['Returns & exchanges', PAGE('returns')]]
          .map(function (l) { return '<a href="' + l[1] + '" style="display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #eee;color:#000;text-decoration:none;font-size:15px"><span>' + l[0] + '</span><span>→</span></a>'; }).join('')
        + '<p style="font-size:12px;color:#999;margin:16px 0 0">Details are stored only on this device.</p></div></div>');
  };
  R.account.after = function () {
    var out = document.getElementById('do-out'); if (out) out.addEventListener('click', signOut);
    var me = load('dolce-me', {}), f = document.getElementById('do-me');
    ['name', 'phone', 'address'].forEach(function (k) { f[k].value = me[k] || ''; });
    f.addEventListener('submit', function (e) { e.preventDefault(); save('dolce-me', formVals(f)); document.getElementById('do-saved').textContent = 'Saved'; });
  };
  R['order-tracking'] = function () {
    return head('Order Tracking', 'Enter your order details and our concierge will reply with the latest status on WhatsApp.')
      + wrap('<form id="do-tr" class="do-box" style="max-width:560px">' + formRows([{ l: 'Order number or product', n: 'order' }, { l: 'Your phone number', n: 'phone' }]) + '<button class="do-btn" type="submit">Ask on WhatsApp</button></form>', true);
  };
  R['order-tracking'].after = function () {
    var f = document.getElementById('do-tr');
    f.addEventListener('submit', function (e) { e.preventDefault(); var v = formVals(f); window.open(wa('Hello Dolce Orso, please share the status of my order: ' + (v.order || '-') + '. Phone: ' + (v.phone || '-')), '_blank'); });
  };
  R.concierge = function () {
    var P = (window.DOLCE_PAGES || {}).concierge || {}, me = load('dolce-me', {});
    var tel = S.phone ? 'tel:' + esc(S.phone.replace(/[^\d+]/g, '')) : '', pills = ['<a class="do-pill" href="' + wa('Hello Dolce Orso') + '" target="_blank" rel="noopener">' + ICON.wa + '<span>WhatsApp</span></a>'];
    if (S.phone) pills.push('<a class="do-pill" href="' + tel + '">' + ICON.phone + '<span>Call</span></a>');
    if (S.email) pills.push('<a class="do-pill" href="mailto:' + esc(S.email) + '">' + ICON.mail + '<span>Email</span></a>');
    var bottom = (P.hours ? '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:rgba(255,255,255,.88);max-width:400px">' + esc(P.hours) + '</p>' : '')
      + '<div class="do-pills" style="grid-template-columns:repeat(' + pills.length + ',1fr)">' + pills.join('') + '</div>';
    var chips = ['Sizing & fit', 'Your order', 'Gifting', 'Something else'].map(function (t) { return '<button type="button" class="do-chip" data-topic="' + t + '">' + t + '</button>'; }).join('');
    return '<style>' + AUTH_CSS + '</style><section class="do-auth do-fit">'
      + authSide('Dolce Orso · Personal Concierge', 'At your <br>service.', bottom)
      + '<div class="do-auth-main"><form id="do-ct" class="do-auth-form" novalidate>'
      + '<div style="display:flex;flex-direction:column;gap:10px"><p class="do-eyebrow do-opt" style="color:#888">Private enquiries</p><h1>Your concierge</h1><p class="do-sub" style="margin:0;color:#666;font-size:15px;line-height:1.6">' + esc(P.lead || 'Sizing, styling, orders, gifts — ask us anything.') + '</p></div>'
      + '<div><p class="do-lbl do-opt" style="margin:0 0 10px">How may we assist?</p><div class="do-chips" id="do-topics">' + chips + '</div></div>'
      + '<div class="do-row2"><input class="do-input" name="name" placeholder="Your name" autocomplete="name" value="' + esc(me.name || '') + '"><input class="do-input" name="phone" type="tel" placeholder="Mobile" autocomplete="tel" value="' + esc(me.phone || '') + '"></div>'
      + '<textarea class="do-input" name="msg" placeholder="How may we assist you?"></textarea>'
      + '<button class="do-btn" id="do-ctsend" type="submit">Send via WhatsApp' + ARR + '</button>'
      + '<p class="do-opt" style="margin:0;font-size:12px;color:#777;line-height:1.5;display:flex;align-items:center"><span class="do-live"></span>Replies are personal, usually within a few hours.</p>'
      + '<p class="do-m" style="margin:0;font-size:12px;color:#999;line-height:1.6;text-align:center">' + (S.phone ? 'Or call <a href="' + tel + '" style="color:#555">' + esc(S.phone) + '</a>' : '') + (S.phone && S.email ? ' · ' : '') + (S.email ? '<a href="mailto:' + esc(S.email) + '" style="color:#555">' + esc(S.email) + '</a>' : '') + '</p>'
      + '</form></div></section>';
  };
  R.concierge.after = function () {
    var f = document.getElementById('do-ct'), topic = '', ta = f.querySelector('textarea');
    var HINTS = { 'Sizing & fit': 'Share your child’s height and the piece you admire…', 'Your order': 'Your order number, or the piece you ordered…', 'Gifting': 'Who is it for, and what occasion or budget do you have in mind?', 'Something else': 'How may we assist you?' };
    [].forEach.call(f.querySelectorAll('.do-chip'), function (c) {
      c.addEventListener('click', function () {
        var on = c.classList.contains('on');
        [].forEach.call(f.querySelectorAll('.do-chip'), function (x) { x.classList.remove('on'); });
        topic = on ? '' : c.getAttribute('data-topic'); if (!on) c.classList.add('on');
        ta.placeholder = HINTS[topic] || 'How may we assist you?';
      });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var v = formVals(f), b = document.getElementById('do-ctsend');
      window.open(wa('Hello Dolce Orso, ' + (topic ? '[' + topic + '] ' : '') + (v.msg || 'I would like some help.') + (v.name ? '\nName: ' + v.name : '') + (v.phone ? '\nPhone: ' + v.phone : '')), '_blank');
      b.innerHTML = 'Sent to WhatsApp ✓'; setTimeout(function () { b.innerHTML = 'Send via WhatsApp' + ARR; }, 2500);
    });
    startSlides();
  };

  /* generic content pages from pages.js */
  function contentPage(key) {
    var P = (window.DOLCE_PAGES || {})[key]; if (!P) return null;
    var body = (P.sections || []).map(function (s) {
      return '<div style="margin-bottom:34px">' + (s.h ? '<p class="do-lbl">' + esc(s.h) + '</p>' : '')
        + (s.p || []).map(function (t) { return '<p class="do-txt">' + t + '</p>'; }).join('')
        + (s.list ? '<ul style="margin:0 0 14px;padding-left:20px;color:#555;line-height:1.9;font-size:15px">' + s.list.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') + '</div>';
    }).join('');
    if (P.faq) body += P.faq.map(function (q) { return '<details class="do-q"><summary>' + esc(q[0]) + '</summary><p class="do-txt" style="margin:12px 0 0">' + q[1] + '</p></details>'; }).join('');
    if (P.articles) body += '<div class="do-grid">' + P.articles.map(function (a) {
      return '<a href="' + a.href + '" class="do-card"><div class="do-ph"><img src="' + D.cover(a.cat) + '" alt=""></div><div style="padding:0 2px"><p style="margin:0 0 4px;font-size:11px;color:#888;' + MONO + '">' + esc(a.tag) + '</p><p style="margin:0 0 6px;font-size:17px;font-weight:500;line-height:1.3">' + esc(a.t) + '</p><p style="margin:0;font-size:14px;color:#666;line-height:1.6">' + esc(a.d) + '</p></div></a>';
    }).join('') + '</div>';
    if (P.cta) body += '<div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap">' + P.cta.map(function (c) {
      var h = c.wa ? wa(c.wa) : c.href;
      return '<a class="do-btn' + (c.o ? ' o' : '') + '" href="' + h + '"' + (c.wa ? ' target="_blank"' : '') + '>' + esc(c.l) + '</a>';
    }).join('') + '</div>';
    return function () { return head(P.title, P.lead) + wrap(body, !P.articles); };
  }

  /* login + concierge fill exactly one screen below the header, so the whole section is visible at once */
  function fitSections() {
    [].forEach.call(document.querySelectorAll('.do-fit'), function (el) {
      var top = el.getBoundingClientRect().top + (window.pageYOffset || 0);
      el.style.height = Math.max(360, (window.innerHeight || document.documentElement.clientHeight) - top) + 'px';
    });
  }
  window.addEventListener('resize', fitSections);
  window.addEventListener('orientationchange', function () { setTimeout(fitSections, 200); });
  window.addEventListener('load', fitSections);
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitSections); } catch (e) {}

  /* ---------- router ---------- */
  var current = '';
  function render() {
    var main = document.getElementById('dolce-main'); if (!main) return;
    var key = window.DOLCE_KEY || new URLSearchParams(location.search).get('p') || '';
    current = key;
    var fn = R[key] || contentPage(key);
    if (!fn) { fn = function () { return head('Page not found', 'We couldn’t find that page.') + wrap(empty('Let’s get you back to the collection.', 'Shop All', 'shop')); }; }
    var title = (window.DOLCE_PAGES && window.DOLCE_PAGES[key] && window.DOLCE_PAGES[key].title) || key.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    try { document.title = title + ' — Dolce Orso'; } catch (e) {}
    main.innerHTML = fn();
    if (R[key] && R[key].after) R[key].after();
    fitSections();
    paint();
  }
  D.render = render;

  /* mount once the shell is on the page; keep counters/hearts fresh */
  function tick() {
    if (!pendingDone && document.body) { pendingDone = true; applyPending(); }
    var main = document.getElementById('dolce-main');
    if (main && !main.firstChild) render();
    paint(); fixLinks();
  }
  /* footer social links come from settings.js */
  function fixLinks() {
    [].forEach.call(document.querySelectorAll('a[href="' + PAGE('account') + '"],a[href="' + PAGE('login') + '"]'), function (a) { a.setAttribute('href', session() ? PAGE('account') : PAGE('login')); });
    [].forEach.call(document.querySelectorAll('a[href="#"]'), function (a) {
      var t = a.textContent.trim(), soc = S.social || {};
      if (t === 'WhatsApp') { a.href = wa('Hello Dolce Orso'); a.target = '_blank'; }
      else if (t === 'Instagram' && soc.instagram) { a.href = soc.instagram; a.target = '_blank'; }
      else if (t === 'YouTube' && soc.youtube) { a.href = soc.youtube; a.target = '_blank'; }
      else if (t === 'LinkedIn' && soc.linkedin) { a.href = soc.linkedin; a.target = '_blank'; }
      else if (t === 'DOLCE ORSO') a.href = './';
    });
    // footer copyright always shows the current year
    var yr = String(new Date().getFullYear());
    [].forEach.call(document.querySelectorAll('footer p'), function (p) {
      if (/^© \d{4} /.test(p.textContent) && p.textContent.indexOf('© ' + yr) !== 0 && p.childNodes.length === 1) p.textContent = p.textContent.replace(/^© \d{4}/, '© ' + yr);
    });
  }
  var t;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(tick, 60); }).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('storage', function () { bag = load('dolce-bag', []); wish = load('dolce-wish', []); paint(); });
  document.addEventListener('DOMContentLoaded', tick);
  tick();
})();

/* ---------- product-card hover slideshow ----------
   Hover a card: it steps through the product page's slider photos in order (front product, side/back views ...)
   and ends on the product page's left-panel photo, which stays until the mouse leaves. Touch screens are unaffected.
   Works on every page, on any <img> pair made of  .../card.web.jpg  +  .../hover.web.jpg  (or hero.web.jpg). */
(function () {
  var D = window.DOLCE;
  if (!D || !window.matchMedia || !matchMedia('(hover: hover)').matches) return;
  // hover photos are written as data-hover (no src): phones never download them, and mouse devices fetch a card's
  // hover photo only when the pointer reaches that card (it used to fetch every card's hover photo while scrolling:
  // ~12MB on the home page alone)
  var warmed = {};
  function warm(u) { if (u && !warmed[u]) { warmed[u] = 1; var i = new Image(); i.decoding = 'async'; i.src = u; } }
  document.addEventListener('pointerover', function (e) {
    var a = e.target.closest && e.target.closest('a, .do-card'); if (!a) return;
    var l = a.querySelectorAll('img[data-hover]:not([src])');
    for (var i = 0; i < l.length; i++) { l[i].decoding = 'async'; l[i].src = l[i].getAttribute('data-hover'); }
    if (!l.length) return;
    // the pointer is among the cards now: quietly fetch the hover photo of the cards either side, so the next hover is instant
    var all = document.querySelectorAll('img[data-hover]'), at = Array.prototype.indexOf.call(all, l[0]);
    for (var k = at - 2; k <= at + 4; k++) if (all[k] && k !== at) warm(all[k].getAttribute('data-hover'));
  }, { passive: true });
  var STEP = 750;                                  // ms each photo stays before the next one
  var cache = {}, active = null, run = 0;
  function preload(u) { return cache[u] || (cache[u] = new Promise(function (ok) { var i = new Image(); i.onload = i.onerror = ok; i.src = u; })); }
  function sleep(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }
  function cardAt(target) {
    for (var el = target; el && el !== document.body; el = el.parentElement) {
      var c = el.querySelector && el.querySelector('img[src*="/card.web.jpg"]');
      if (c) {
        var ph = c.parentElement, imgs = ph.querySelectorAll('img');
        if (imgs.length < 2) return null;
        var h = imgs[1] === c ? imgs[0] : imgs[1];
        var m = /assets\/([^/]+)\//.exec(c.getAttribute('src'));
        var p = m && D.products.filter(function (x) { return x.folder === m[1]; })[0];
        if (!p || !p.hov) return null;
        return { ph: ph, h: h, p: p, base: c.getAttribute('src').replace(/[^/]+$/, '').replace(/\?.*$/, ''), v: (c.getAttribute('src').split('?')[1] || '') };
      }
    }
    return null;
  }
  function frames(k) {
    var names = ['2-product-front', '3-model-side', '4-product-side', '5-model-back', '6-product-back'];
    return names.filter(function (n) { return !(k.p.noSide && /side/.test(n)); })
                .map(function (n) { return k.base + n + '.web.jpg' + (k.v ? '?' + k.v : ''); });
  }
  function start(k) {
    var h = k.h, my = ++run;
    if (!h.dataset.orig) h.dataset.orig = h.getAttribute('src') || h.getAttribute('data-hover');
    var list = frames(k), last = h.dataset.orig;
    list.forEach(preload);
    (async function () {
      for (var i = 0; i < list.length; i++) {
        await preload(list[i]);
        if (run !== my) return;
        h.setAttribute('src', list[i]);
        await sleep(STEP);
        if (run !== my) return;
      }
      h.setAttribute('src', last);                  // the product page's left-panel photo, held until un-hover
    })();
  }
  function stop(k) {
    run++;
    var h = k.h, orig = h.dataset.orig;
    if (!orig) return;
    setTimeout(function () { if (!active || active.h !== h) h.setAttribute('src', orig); }, 380);   // after the fade-out
  }
  document.addEventListener('mouseover', function (e) {
    var k = cardAt(e.target);
    if ((k && active && k.ph === active.ph) || (!k && !active)) return;
    var prev = active; active = k;
    if (prev) stop(prev);
    if (k) start(k);
  });
  document.addEventListener('mouseout', function (e) { if (e.relatedTarget) return; if (active) { var prev = active; active = null; stop(prev); } });
})();

/* Warm-up: once the page has finished loading, quietly fetch the four menu photos, so the menu opens with its
   pictures already there (they sit in a hidden panel, and the browser would otherwise only start fetching them on open). */
(function () {
  var D = window.DOLCE; if (!D || !D.menuCover) return;
  if ((navigator.connection || {}).saveData) return;
  function go() {
    (window.requestIdleCallback || function (f) { setTimeout(f, 400); })(function () {
      ['denim', 't-shirts', 'jackets', 'hoodies'].forEach(function (k) { var i = new Image(); i.decoding = 'async'; i.src = D.menuCover(k); });
    }, { timeout: 3000 });
  }
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
