/* =====================================================================
   DOLCE ORSO - HOME PAGE "SHOP BY CATEGORY" OBJECT CANVAS
   Four product cut-outs floating on white. Each one slowly spins on its own axis,
   showing its front and its back. Click one to open its category.

   Photos live in assets/home-objects/ as <category>-front.webp and <category>-back.webp
   (transparent background). To change an object, replace those two files.
   Spin speed: change the 11s in  animation: dcoSpin 11s  below.
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
    '.dco-float{position:relative;display:block;perspective:1400px;animation:dcoFloat 6.5s ease-in-out infinite;animation-delay:var(--d,0s)}',
    '.dco-spin{position:relative;display:block;width:100%;aspect-ratio:var(--ar);transform-style:preserve-3d;animation:dcoSpin 11s ease-in-out infinite;animation-delay:var(--sd,0s);transition:scale .5s cubic-bezier(.22,1,.36,1)}',
    '.dco-item:hover .dco-spin,.dco-item:focus-visible .dco-spin{scale:1.07}',
    '.dco-face{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;backface-visibility:hidden;-webkit-backface-visibility:hidden;user-select:none;-webkit-user-drag:none}',
    '.dco-back{transform:rotateY(180deg)}',
    '.dco-shadow{position:absolute;left:12%;right:12%;bottom:-3%;height:7%;border-radius:50%;background:radial-gradient(ellipse at center,rgba(0,0,0,.22),rgba(0,0,0,0) 70%);filter:blur(6px);pointer-events:none}',
    '.dco-label{position:absolute;left:50%;top:100%;transform:translate(-50%,10px);margin-top:10px;display:flex;flex-direction:column;align-items:center;gap:6px;white-space:nowrap;font:500 clamp(15px,1.5vw,22px)/1 "Inter",sans-serif;letter-spacing:-.02em}',
    '.dco-label i{font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.1em;color:#888;font-style:normal}',
    '.dco-label b{font:500 10px/1 "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid #000;padding-bottom:2px;opacity:0;transition:opacity .35s ease}',
    '.dco-item:hover .dco-label b,.dco-item:focus-visible .dco-label b{opacity:1}',
    '.dco-hint{margin:clamp(40px,5vw,72px) 0 0;text-align:center;font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.55px;text-transform:uppercase;color:#888}',
    '@keyframes dcoFloat{0%,100%{transform:translateY(0) rotate(var(--r0,-1.5deg))}50%{transform:translateY(-12px) rotate(var(--r1,1.5deg))}}',
    '@keyframes dcoSpin{0%,12%{transform:rotateY(0deg)}50%,62%{transform:rotateY(180deg)}100%{transform:rotateY(360deg)}}',
    '@media (max-width:767px){',
    '.dco-stage{display:grid;grid-template-columns:1fr 1fr;gap:20px 8px;aspect-ratio:auto;max-height:none;padding:16px 4px 56px}',
    '.dco-item{position:relative;left:auto;top:auto;width:auto;transform:none;padding:0 6%}',
    '.dco-item:nth-child(even){margin-top:56px}',
    '.dco-label b{opacity:1}',
    '}',
    '@media (prefers-reduced-motion:reduce){.dco-float,.dco-spin{animation:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
