(function () {
  if (window.__pandaDrag) return; window.__pandaDrag = true;
  let el = null, sx = 0, sy = 0, dx = 0, dy = 0, lastX = 0, vx = 0;
  const SPRING = 'transform 0.9s cubic-bezier(.34,1.56,.64,1)';
  document.addEventListener('pointerdown', (e) => {
    const t = e.target.closest && e.target.closest('[data-slot="footer-panda"]');
    if (!t) return;
    e.preventDefault();
    el = t; sx = e.clientX; sy = e.clientY; lastX = e.clientX; vx = 0;
    el.style.transition = 'transform 0.12s ease';
    
    el.style.cursor = 'grabbing';
    el.style.transform = 'scale(1.06) rotate(-3deg)';
  });
  window.addEventListener('pointermove', (e) => {
    if (!el) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    vx = vx * 0.7 + (e.clientX - lastX) * 0.3; lastX = e.clientX;
    const rot = Math.max(-18, Math.min(18, vx * 1.2));
    el.style.transition = 'none';
    el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.06)`;
  });
  const end = () => {
    if (!el) return;
    const t = el; el = null;
    t.style.transition = SPRING;
    t.style.transform = 'translate(0px, 0px) rotate(0deg) scale(1)';
    t.style.cursor = 'grab';
    
  };
  let hov = null, jig = null;
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest && e.target.closest('[data-slot="footer-panda"]');
    if (!t || t === hov || el) return;
    hov = t;
    if (jig) jig.cancel();
    t.style.transformOrigin = '50% 100%';
    jig = t.animate([
      { translate: '0 0', scale: '1 1', rotate: '0deg' },
      { translate: '0 -3px', scale: '1.012 1.012', rotate: '-1.2deg', offset: 0.25 },
      { translate: '0 0', scale: '1 1', rotate: '0deg', offset: 0.5 },
      { translate: '0 -3px', scale: '1.012 1.012', rotate: '1.2deg', offset: 0.75 },
      { translate: '0 0', scale: '1 1', rotate: '0deg' }
    ], { duration: 3600, iterations: Infinity, easing: 'ease-in-out' });
  });
  document.addEventListener('pointerout', (e) => {
    if (!hov) return;
    const to = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-slot="footer-panda"]');
    if (to !== hov) { const t = hov; hov = null; if (jig) { const cs = getComputedStyle(t); const from = { translate: cs.translate, scale: cs.scale, rotate: cs.rotate }; jig.cancel(); jig = t.animate([from, { translate: '0 0', scale: '1 1', rotate: '0deg' }], { duration: 700, easing: 'ease-out' }); } }
  });
  window.addEventListener('pointerup', end);
  window.addEventListener('pointercancel', end);
})();
