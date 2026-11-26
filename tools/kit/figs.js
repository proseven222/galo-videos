// ═════ FIGURAS (silhuetas sem rosto) ═════
const ROBES = ['woman', 'monk', 'king', 'priest', 'wizard', 'judge'];
function fig(q, type, x, y, h, o = {}) {
  q.save(); q.translate(x, y); q.scale((o.dir || 1) * h / 112, h / 112);
  const col = o.col || SIL; q.fillStyle = col; q.strokeStyle = col; q.lineCap = 'round'; q.lineJoin = 'round';
  const ph = o.ph || 0, walk = !!o.walk, sw = walk ? Math.sin(ph) : 0;
  const bob = walk ? Math.abs(Math.cos(ph)) * 2.4 : o.dance ? Math.abs(Math.sin(ph * 2)) * 6 : o.cough ? Math.abs(Math.sin(ph * 2)) * 3 : Math.sin(ph * .8) * .7;
  q.translate(0, -bob);
  const robe = ROBES.includes(type);
  if (o.kneel) q.translate(0, 26);
  if (robe) { q.beginPath(); q.moveTo(-12, -62); q.lineTo(12, -62); q.lineTo(21 + sw * 2, 0); q.lineTo(-21 + sw * 2, 0); q.closePath(); q.fill(); }
  else if (o.kneel) { q.lineWidth = 8; q.beginPath(); q.moveTo(-3, -34); q.lineTo(-18, -14); q.lineTo(-4, -2); q.moveTo(4, -34); q.lineTo(16, -2); q.stroke(); }
  else { q.lineWidth = 7; q.beginPath(); q.moveTo(-3, -44); q.lineTo(-3 + sw * 13, 0); q.moveTo(3, -44); q.lineTo(3 - sw * 13, 0); q.stroke(); }
  // tronco
  q.beginPath(); q.moveTo(-13, -84); q.lineTo(13, -84);
  if (type === 'top' || type === 'man' || type === 'scholar' || type === 'king') { q.lineTo(17, -52); q.lineTo(21, -24); q.lineTo(-21, -24); q.lineTo(-17, -52); }
  else { q.lineTo(15, -50); q.lineTo(-15, -50); }
  q.closePath(); q.fill();
  if (type === 'king') { q.beginPath(); q.moveTo(-14, -84); q.lineTo(-30, -6); q.lineTo(-10, -30); q.closePath(); q.fill(); }
  // cabeça e cobertura
  const hy = -91;
  if (type === 'monk' || type === 'hood' || type === 'wizard') { q.beginPath(); q.moveTo(-12, -80); q.quadraticCurveTo(-14, -104, 0, -112); q.quadraticCurveTo(14, -104, 12, -80); q.closePath(); q.fill(); }
  else { q.beginPath(); q.arc(0, hy, 7.5, 0, 7); q.fill(); }
  if (type === 'top') { q.fillRect(-14, -97, 28, 3.5); q.fillRect(-8.5, -112, 17, 16); }
  else if (type === 'man') { q.beginPath(); q.ellipse(0, -97, 10, 4.5, 0, Math.PI, 0); q.fill(); q.fillRect(-10, -97, 20, 2); }
  else if (type === 'woman') { q.beginPath(); q.arc(-5, -98, 5.5, 0, 7); q.fill(); q.beginPath(); q.moveTo(-8, -98); q.lineTo(9, -90); q.lineTo(-6, -86); q.closePath(); q.fill(); }
  else if (type === 'king') { q.beginPath(); q.moveTo(-8, -97); q.lineTo(-9, -108); q.lineTo(-4, -103); q.lineTo(0, -111); q.lineTo(4, -103); q.lineTo(9, -108); q.lineTo(8, -97); q.closePath(); q.fill(); }
  else if (type === 'soldier' || type === 'knight') { q.beginPath(); q.arc(0, -93, 9, Math.PI, 0); q.fill(); q.fillRect(-9, -93, 18, 2.5); if (type === 'knight') { q.beginPath(); q.moveTo(0, -102); q.quadraticCurveTo(-14, -112 + Math.sin(ph * 1.3) * 3, -22, -98); q.lineTo(-10, -100); q.fill(); } else { q.beginPath(); q.moveTo(-1, -102); q.lineTo(2, -112); q.lineTo(4, -102); q.fill(); } }
  else if (type === 'pilgrim') { q.beginPath(); q.ellipse(0, -97, 16, 4, 0, 0, 7); q.fill(); q.fillRect(-8, -107, 16, 10); }
  else if (type === 'scholar') { q.fillRect(-10, -100, 20, 3); q.fillRect(-7, -105, 14, 5); }
  else if (type === 'sailor') { q.fillRect(-9, -100, 18, 5); q.beginPath(); q.ellipse(0, -97, 11, 3, 0, 0, 7); q.fill(); }
  else if (type === 'judge') { q.fillRect(-9, -101, 18, 5); q.beginPath(); q.ellipse(0, -101, 9, 11, 0, Math.PI, 0); q.fill(); q.beginPath(); q.arc(-8, -90, 5, 0, 7); q.arc(8, -90, 5, 0, 7); q.arc(-9, -83, 4.5, 0, 7); q.arc(9, -83, 4.5, 0, 7); q.fill(); q.fillStyle = '#e8d4a2'; q.beginPath(); q.moveTo(-6, -83); q.lineTo(6, -83); q.lineTo(8, -66); q.lineTo(1.5, -66); q.lineTo(0, -76); q.lineTo(-1.5, -66); q.lineTo(-8, -66); q.closePath(); q.fill(); q.fillStyle = col; }
  else if (type === 'priest') { q.fillRect(-9, -100, 18, 4); q.fillRect(-6, -108, 12, 8); }
  // braços
  const a = o.arms || (o.prop ? 'hold' : 'down'); q.lineWidth = 6;
  const armsUp = a === 'up' ? 1 : a === 'cheer' ? (.55 + .45 * Math.sin(ph * 2)) : 0;
  if (a === 'up' || a === 'cheer') { const k = a === 'up' ? 1 : armsUp; q.beginPath(); q.moveTo(-11, -80); q.lineTo(-20 - 2 * k, -80 - 30 * k - 4); q.moveTo(11, -80); q.lineTo(20 + 2 * k, -80 - 30 * k - 4); q.stroke(); }
  else if (a === 'one') { q.beginPath(); q.moveTo(11, -80); q.lineTo(20, -116); q.moveTo(-11, -80); q.lineTo(-13, -52); q.stroke(); }
  else if (a === 'point') { q.beginPath(); q.moveTo(11, -80); q.lineTo(34, -88); q.moveTo(-11, -80); q.lineTo(-13, -52); q.stroke(); }
  else if (a === 'wave') { q.beginPath(); q.moveTo(11, -80); q.lineTo(22, -102 + Math.sin(ph * 4) * 6); q.moveTo(-11, -80); q.lineTo(-13, -52); q.stroke(); }
  else if (a === 'dance') { const s2 = Math.sin(ph * 2); q.beginPath(); q.moveTo(-11, -80); q.lineTo(-24, -100 - 14 * s2); q.moveTo(11, -80); q.lineTo(24, -100 + 14 * s2); q.stroke(); }
  else if (a === 'hanky') { q.beginPath(); q.moveTo(10, -78); q.lineTo(9, -66); q.lineTo(4, -86); q.stroke(); q.fillStyle = '#b9bd8c'; q.beginPath(); q.moveTo(0, -90); q.lineTo(8, -92); q.lineTo(9, -83); q.lineTo(1, -82); q.closePath(); q.fill(); q.fillStyle = col; }
  else if (a === 'hold') { q.beginPath(); q.moveTo(11, -80); q.lineTo(24, -66); q.moveTo(-11, -80); q.lineTo(-13, -52); q.stroke(); }
  else { q.beginPath(); q.moveTo(11, -80); q.lineTo(14, -52); q.moveTo(-11, -80); q.lineTo(-14, -52); q.stroke(); }
  // adereços
  const pr = o.prop;
  if (pr === 'spear') { q.lineWidth = 3.2; q.beginPath(); q.moveTo(24, -30); q.lineTo(26, -150 + (o.lower || 0)); q.stroke(); q.beginPath(); q.moveTo(26, -150 + (o.lower || 0)); q.lineTo(22, -138 + (o.lower || 0)); q.lineTo(30, -138 + (o.lower || 0)); q.closePath(); q.fill(); }
  else if (pr === 'staff') { q.lineWidth = 3.4; q.beginPath(); q.moveTo(26, -2); q.lineTo(26, -118); q.stroke(); }
  else if (pr === 'torch') { q.lineWidth = 3.4; q.beginPath(); q.moveTo(26, -50); q.lineTo(28, -112); q.stroke(); glow(q, 28, -122, 80, '255,190,90', .85 + .15 * Math.sin(ph * 5), 'lighter'); q.fillStyle = 'rgba(255,224,150,.95)'; q.beginPath(); q.ellipse(28, -118, 5, 9 + Math.sin(ph * 6) * 2, 0, 0, 7); q.fill(); q.fillStyle = col; }
  else if (pr === 'lantern') { q.lineWidth = 2; q.beginPath(); q.moveTo(25, -66); q.lineTo(25, -52); q.stroke(); glow(q, 25, -46, 90, '255,196,100', .9, 'lighter'); q.fillStyle = '#ffe3a3'; q.fillRect(21, -52, 8, 11); q.fillStyle = col; }
  else if (pr === 'scroll') { q.fillStyle = '#d9c590'; q.fillRect(22, -76, 14, 20); q.fillStyle = col; }
  else if (pr === 'book') { q.fillStyle = '#d9c590'; q.fillRect(16, -74, 20, 14); q.fillStyle = col; q.fillRect(16, -74, 2, 14); }
  else if (pr === 'sword') { q.lineWidth = 3; q.beginPath(); q.moveTo(24, -62); q.lineTo(52, -112); q.stroke(); q.fillRect(20, -66, 12, 3); }
  else if (pr === 'banner') { q.lineWidth = 3.4; q.beginPath(); q.moveTo(26, -2); q.lineTo(26, -150); q.stroke(); q.fillStyle = '#6a4a28'; q.beginPath(); q.moveTo(26, -148); for (let i = 0; i <= 8; i++) q.lineTo(26 + i * 6, -148 + Math.sin(ph * 3 - i * .7) * 4 * i / 8); for (let i = 8; i >= 0; i--) q.lineTo(26 + i * 6, -118 + Math.sin(ph * 3 - i * .7) * 4 * i / 8); q.closePath(); q.fill(); q.fillStyle = col; }
  else if (pr === 'peel') { q.lineWidth = 3; q.beginPath(); q.moveTo(24, -64); q.lineTo(70, -40); q.stroke(); q.beginPath(); q.ellipse(76, -38, 11, 7, .4, 0, 7); q.fill(); }
  else if (pr === 'tool') { q.lineWidth = 3.2; q.beginPath(); q.moveTo(24, -10); q.lineTo(30, -120); q.stroke(); q.beginPath(); q.moveTo(30, -120); q.lineTo(14, -124); q.lineTo(18, -114); q.closePath(); q.fill(); }
  else if (pr === 'bag') { q.beginPath(); q.ellipse(24, -52, 9, 11, 0, 0, 7); q.fill(); }
  if (type === 'soldier' || type === 'knight') { if (o.shield !== false) { q.save(); q.translate(-16, -64); q.beginPath(); q.ellipse(0, 0, 9, 24, 0, 0, 7); q.fill(); q.strokeStyle = '#8a6030'; q.lineWidth = 2; q.beginPath(); q.ellipse(0, 0, 5, 18, 0, 0, 7); q.stroke(); q.restore(); } }
  q.restore();
}
// grupo de figuras
function crowd(q, f, o) {
  const r = R(o.seed || 1), n = o.n || 8, t = f / 30;
  for (let i = 0; i < n; i++) {
    const k = n > 1 ? i / (n - 1) : .5, row = o.rows ? i % o.rows : 0, x = (o.x0 || 540) + (k - .5) * (o.spread || 600) + (r() - .5) * 40 - (o.camx || 0) * (o.fac == null ? 1 : o.fac);
    const h = (o.h || 300) * (1 - row * .16) * (.9 + r() * .2), y = (o.y || 1600) - row * (o.rowGap || 70), ph = f * (o.speed || .2) + r() * 6.28;
    const types = o.types || [o.type || 'man']; const ty = types[Math.floor(r() * types.length)];
    const mode = o.mode || 'idle'; const oo = { ph, dir: o.dir || (r() < .5 ? -1 : 1) };
    if (o.dir) oo.dir = o.dir; if (o.prop) oo.prop = o.prop; if (o.props) oo.prop = o.props[Math.floor(r() * o.props.length)];
    let xx = x; if (mode === 'march') { oo.walk = 1; xx = x + ((t * (o.vx || 60)) % 200) * (o.dir || 1) - 100; if (o.loop) xx = ((x + t * (o.vx || 60) * (o.dir || 1) + 2000) % (W + 400)) - 200; }
    else if (mode === 'run') { oo.walk = 1; oo.ph = f * .5 + i; }
    else if (mode === 'cheer') oo.arms = 'cheer'; else if (mode === 'up') { oo.arms = 'up'; } else if (mode === 'dance') { oo.dance = 1; oo.arms = 'dance'; oo.ph = f * .22 + i * 1.3; }
    else if (mode === 'cough') { oo.cough = 1; oo.arms = 'hanky'; oo.ph = f * .24 + i; } else if (mode === 'fan') { oo.arms = 'hold'; }
    else if (mode === 'kneel') { oo.kneel = 1; } else if (mode === 'point') { oo.arms = 'point'; } else if (mode === 'look') { oo.arms = 'down'; } else if (mode === 'shade') { oo.arms = 'one'; }
    else if (mode === 'wave') { oo.arms = 'wave'; }
    if (o.rise != null && (mode === 'up' || mode === 'cheer')) { const kk = clamp((t - o.rise - i * .15) * 3); if (kk < 1) { oo.arms = kk > .05 ? 'up' : 'down'; } }
    if (o.arms && mode === 'idle') oo.arms = o.arms;
    fig(q, ty, xx, y, h, oo);
  }
}
