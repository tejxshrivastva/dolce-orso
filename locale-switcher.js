(function(){
  const CK='dolce-currency', LK='dolce-lang';
  const currencies=[
    {code:'INR',symbol:'₹',rate:1},
    {code:'USD',symbol:'$',rate:0.012},
    {code:'EUR',symbol:'€',rate:0.011},
    {code:'GBP',symbol:'£',rate:0.0095},
    {code:'AED',symbol:'د.إ',rate:0.044}
  ];
  const languages=[
    {code:'en',label:'English',short:'EN'},
    {code:'fr',label:'Français',short:'FR'},
    {code:'it',label:'Italiano',short:'IT'},
    {code:'hi',label:'हिन्दी',short:'हि'}
  ];
  let curr=localStorage.getItem(CK)||'INR';
  // the site is written in English only; the old FR/IT/HI options translated just a few labels, so they are retired
  let lang='en';
  try{localStorage.removeItem(LK);}catch(e){}
  function ci(){return currencies.find(c=>c.code===curr)||currencies[0];}
  function fmtConverted(inr,c){
    const v=Math.round(inr*c.rate);
    if(c.code==='INR')return c.symbol+(v>=1000?Math.floor(v/1000)+','+String(v%1000).padStart(3,'0'):v);
    return c.symbol+v.toLocaleString('en-US');
  }
  const TR={
    fr:{'Explore the Collection':'Explorer la Collection','Shop All':'Tout Voir','Discover':'Découvrir','Subscribe':"S'abonner",'Add to Bag':'Ajouter au Panier','Buy Now':'Acheter','Load More':'Voir Plus','Back to top':'Retour en haut','Filter':'Filtrer','Size':'Taille','Price':'Prix','Color':'Couleur','Sort by:':'Trier par:','Newest':'Nouveautés','Best Selling':'Meilleures Ventes','Search our collection...':'Rechercher...','Concierge':'Conciergerie','Your email address':'Votre adresse e-mail','View the Wardrobe':'Voir la Garde-robe','You May Also Adore':'Vous Aimerez Aussi','Personal Shopping via WhatsApp':'Personal Shopping via WhatsApp','My Account':'Mon Compte','Wishlist':'Liste de Souhaits','Cancel':'Annuler','Size Guide':'Guide des Tailles','Details & Description':'Détails','Washcare':'Entretien','Shipping':'Livraison'},
    it:{'Explore the Collection':'Esplora la Collezione','Shop All':'Vedi Tutto','Discover':'Scopri','Subscribe':'Iscriviti','Add to Bag':'Aggiungi','Buy Now':'Acquista','Load More':'Carica Altro','Back to top':'Torna in alto','Filter':'Filtra','Size':'Taglia','Price':'Prezzo','Color':'Colore','Sort by:':'Ordina per:','Newest':'Novità','Best Selling':'Più Venduti','Search our collection...':'Cerca...','Concierge':'Concierge','Your email address':'La tua e-mail','View the Wardrobe':'Vedi il Guardaroba','You May Also Adore':'Potrebbe Piacerti','Personal Shopping via WhatsApp':'Personal Shopping via WhatsApp','My Account':'Il Mio Account','Wishlist':'Lista Desideri','Cancel':'Annulla','Size Guide':'Guida Taglie','Details & Description':'Dettagli','Washcare':'Lavaggio','Shipping':'Spedizione'},
    hi:{'Explore the Collection':'कलेक्शन देखें','Shop All':'सभी देखें','Discover':'खोजें','Subscribe':'सदस्यता','Add to Bag':'बैग में जोड़ें','Buy Now':'अभी खरीदें','Load More':'और देखें','Back to top':'ऊपर जाएं','Filter':'फ़िल्टर','Size':'साइज़','Price':'मूल्य','Color':'रंग','Sort by:':'क्रम:','Newest':'नवीनतम','Best Selling':'लोकप्रिय','Search our collection...':'खोजें...','Concierge':'सहायता','Your email address':'आपका ईमेल','View the Wardrobe':'वॉर्डरोब देखें','You May Also Adore':'आपको ये भी पसंद आएगा','Personal Shopping via WhatsApp':'WhatsApp पर खरीदें','My Account':'मेरा अकाउंट','Wishlist':'विशलिस्ट','Cancel':'रद्द करें','Size Guide':'साइज़ गाइड','Details & Description':'विवरण','Washcare':'धुलाई','Shipping':'डिलीवरी'}
  };
  let debounce=null;
  function convertPrices(){
    if(curr==='INR')return;
    const c=ci();
    const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walk.nextNode()){
      const nd=walk.currentNode;
      if(nd.parentElement&&nd.parentElement.dataset.pc)continue;
      if(/₹\d/.test(nd.textContent)){
        nd.textContent=nd.textContent.replace(/₹(\d{1,2},?\d{3})/g,(m,p)=>{
          return fmtConverted(parseInt(p.replace(/,/g,'')),c);
        });
        if(nd.parentElement)nd.parentElement.dataset.pc='1';
      }
    }
  }
  function translateDOM(){
    if(lang==='en')return;
    const dict=TR[lang];if(!dict)return;
    const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walk.nextNode()){
      const nd=walk.currentNode;
      if(nd.parentElement&&nd.parentElement.dataset.tl)continue;
      const t=nd.textContent.trim();
      if(dict[t]){nd.textContent=nd.textContent.replace(t,dict[t]);if(nd.parentElement)nd.parentElement.dataset.tl='1';}
    }
    document.querySelectorAll('input[placeholder]').forEach(el=>{
      if(dict[el.placeholder])el.placeholder=dict[el.placeholder];
    });
    document.querySelectorAll('option').forEach(el=>{
      const t=el.textContent.trim();if(dict[t])el.textContent=dict[t];
    });
  }
  function scheduleConvert(){
    if(debounce)clearTimeout(debounce);
    debounce=setTimeout(()=>{convertPrices();translateDOM();},150);
  }
  const NAMES={INR:'Indian Rupee',USD:'US Dollar',EUR:'Euro',GBP:'British Pound',AED:'UAE Dirham'};
  const LBL={en:['Currency','Language'],fr:['Devise','Langue'],it:['Valuta','Lingua'],hi:['मुद्रा','भाषा']};
  const CHEV='<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><polyline points="5 9 12 16 19 9"></polyline></svg>';
  const MONO="'JetBrains Mono',monospace";
  function mk(kind,ctx){
    const isC=kind==='currency';
    const lab=(LBL[lang]||LBL.en)[isC?0:1];
    const cur=ci(),lg=languages.find(x=>x.code===lang)||languages[0];
    const hdr=ctx==='header';
    const val=isC?cur.symbol+' '+cur.code:(hdr?lg.short:lg.label);
    const wrap=document.createElement('div');
    wrap.setAttribute('data-dl',kind);wrap.dataset.tl='1';wrap.dataset.pc='1';
    wrap.style.cssText='position:relative;display:flex;align-items:center;flex-shrink:0';
    const btn=document.createElement('button');
    btn.setAttribute('aria-label',lab+': '+val);btn.setAttribute('aria-haspopup','listbox');
    btn.style.cssText=hdr
      ?'background:none;border:none;padding:0 10px;min-height:40px;display:flex;align-items:center;gap:7px;font:400 13px Inter,sans-serif;letter-spacing:0.5px;color:inherit;white-space:nowrap'
      :'background:none;border:none;padding:6px 0;display:inline-flex;align-items:center;gap:8px;font:400 10px '+MONO+';letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.62);white-space:nowrap;transition:color .2s';
    btn.innerHTML='<span style="opacity:'+(hdr?'0.6':'0.7')+'">'+lab+'</span><span style="'+(hdr?'':'color:#fff')+'">'+val+'</span>'+CHEV;
    if(!hdr){btn.onmouseenter=()=>{btn.style.color='#fff';};btn.onmouseleave=()=>{btn.style.color='rgba(255,255,255,0.62)';};}
    let panel=null;
    const close=e=>{if(!wrap.contains(e.target)){shut();}};
    function shut(){if(panel){panel.remove();panel=null;}document.removeEventListener('click',close);}
    btn.onclick=e=>{
      e.stopPropagation();
      if(panel){shut();return;}
      panel=document.createElement('div');
      panel.setAttribute('role','listbox');
      panel.style.cssText='position:absolute;'+(hdr?'top:calc(100% + 8px)':'bottom:calc(100% + 10px)')+';'+(hdr?'right:0':'left:0')+';background:#fff;color:#000;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,0.18);padding:8px;min-width:230px;z-index:300;text-align:left;text-transform:none;letter-spacing:0;font-family:Inter,sans-serif';
      let h='<p style="margin:0;padding:10px 12px 8px;font:500 10px '+MONO+';letter-spacing:0.55px;text-transform:uppercase;color:#888">Select '+(isC?'currency':'language')+'</p>';
      (isC?currencies:languages).forEach(x=>{
        const act=isC?x.code===curr:x.code===lang;
        const left=isC?x.symbol+'&nbsp;&nbsp;'+x.code:x.label;
        const right=isC?NAMES[x.code]:x.short;
        h+='<button role="option" data-v="'+x.code+'" style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:11px 12px;border:none;border-radius:10px;background:'+(act?'#f2f2f2':'transparent')+';font:'+(act?'500':'400')+' 13px Inter,sans-serif;color:#000;text-align:left">'+'<span>'+left+'</span><span style="font-size:11px;color:#888">'+right+'</span></button>';
      });
      panel.innerHTML=h;
      panel.querySelectorAll('[data-v]').forEach(o=>{
        o.onmouseenter=()=>{o.style.background='#f6f6f6';};
        o.onmouseleave=()=>{o.style.background=(isC?o.dataset.v===curr:o.dataset.v===lang)?'#f2f2f2':'transparent';};
        o.onclick=ev=>{ev.stopPropagation();localStorage.setItem(isC?CK:LK,o.dataset.v);location.reload();};
      });
      wrap.appendChild(panel);
      setTimeout(()=>document.addEventListener('click',close),0);
    };
    wrap.appendChild(btn);
    return wrap;
  }
  function headerSlot(){
    const h=document.querySelector('header>div');
    return h&&h.lastElementChild&&h.lastElementChild.tagName==='DIV'?h.lastElementChild:null;
  }
  function footerBar(){
    const p=[...document.querySelectorAll('footer p')].find(x=>/ALL RIGHTS RESERVED/i.test(x.textContent));
    return p?p.parentElement:null;
  }
  function ensure(){
    document.querySelectorAll('#dolce-locale,header [data-dl]').forEach(e=>e.remove());
    const fb=footerBar();
    if(!fb)return;
    fb.querySelectorAll('[data-dl="language"]').forEach(e=>e.remove());
    if(!fb.querySelector('[data-dl="currency"]'))fb.insertBefore(mk('currency','footer'),fb.children[1]||null);
  }
  function init(){
    ensure();
    setTimeout(()=>{convertPrices();translateDOM();},400);
    new MutationObserver(scheduleConvert).observe(document.documentElement,{childList:true,subtree:true});
    setInterval(()=>{
      ensure();
    },300);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else setTimeout(init,200);
  window.__dolceLocale={
    formatPrice:inr=>fmtConverted(inr,ci()),
    getCurrency:()=>curr,
    getLang:()=>lang
  };
})();
