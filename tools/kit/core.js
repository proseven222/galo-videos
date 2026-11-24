// ───────── VÍDEO 4 · O GRANDE FEDOR DE LONDRES · pintura a óleo procedural ─────────
const W = 1080, H = 1920, FPS = 30;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const eOut = t => 1 - Math.pow(1 - clamp(t), 3);
const eIn = t => Math.pow(clamp(t), 2);
const eIO = t => (1 - Math.cos(Math.PI * clamp(t))) / 2;
function R(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const main = document.getElementById('c'), mg = main.getContext('2d');
const off = document.createElement('canvas'); off.width = W; off.height = H;
let g = off.getContext('2d');
const SIL = '#0b0d06';
const mk = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; return [cv, cv.getContext('2d')]; };

// ── névoa (tile contínuo) ──
function makeFog(w, h, seed, rgb, n) {
  const [cv, q] = mk(w, h); const r = R(seed);
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = h * (.2 + r() * .6), rad = 90 + r() * 200, a = .05 + r() * .13;
    for (const dx of [-w, 0, w]) { const gr = q.createRadialGradient(x + dx, y, 0, x + dx, y, rad); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(1, `rgba(${rgb},0)`); q.fillStyle = gr; q.fillRect(x + dx - rad, y - rad, rad * 2, rad * 2); }
  }
  return cv;
}
const FOG_G = makeFog(1600, 560, 3, '150,172,62', 120);
const FOG_W = makeFog(1600, 560, 8, '210,190,130', 110);
const FOG_D = makeFog(1600, 560, 12, '40,46,20', 90);
function fog(q, tile, y, h, f, spd, alpha, camX, fac, sc) {
  sc = sc || 1; const tw = 1600 * sc; let ox = -(((f * spd + camX * fac) % tw) + tw) % tw;
  q.save(); q.globalAlpha = alpha; for (let x = ox - tw; x < W + tw; x += tw) q.drawImage(tile, x, y, tw, h); q.restore();
}
// ── céu / luz ──
function vgrad(q, y0, y1, stops, x0 = -300, w = W + 600) { const gr = q.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); q.fillStyle = gr; q.fillRect(x0, y0, w, y1 - y0); }
function glow(q, x, y, r, rgb, a, mode) { q.save(); if (mode) q.globalCompositeOperation = mode; const gr = q.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${rgb},${a})`); gr.addColorStop(.35, `rgba(${rgb},${a * .35})`); gr.addColorStop(1, `rgba(${rgb},0)`); q.fillStyle = gr; q.fillRect(x - r, y - r, r * 2, r * 2); q.restore(); }
// ── figuras ──
function pol(q, x, y, h, o = {}) {
  q.save(); q.translate(x, y); q.scale((o.dir || 1) * h / 111, h / 111); q.fillStyle = o.col || SIL; q.strokeStyle = o.col || SIL; q.lineCap = 'round';
  const ph = o.ph || 0, walk = !!o.walk, sw = Math.sin(ph) * (walk ? 1 : 0), bob = (o.cough ? Math.abs(Math.sin(ph * 2)) * 3.2 : walk ? Math.abs(Math.cos(ph)) * 2 : Math.sin(ph) * .6);
  q.translate(0, -bob);
  q.lineWidth = 7; q.beginPath(); q.moveTo(-3, -42); q.lineTo(-3 + sw * 13, 0); q.moveTo(3, -42); q.lineTo(3 - sw * 13, 0); q.stroke();
  q.beginPath(); q.moveTo(-13, -82); q.lineTo(13, -82); q.lineTo(16, -52); q.lineTo(21, -22); q.lineTo(-21, -22); q.lineTo(-16, -52); q.closePath(); q.fill();
  q.beginPath(); q.arc(0, -89, 7.5, 0, 7); q.fill();
  q.fillRect(-14, -96, 28, 3.5); q.fillRect(-8.5, -111, 17, 16);
  if (o.hanky) { q.lineWidth = 6; q.beginPath(); q.moveTo(10, -78); q.lineTo(9, -66); q.lineTo(4, -86); q.stroke(); q.fillStyle = '#b9bd8c'; q.beginPath(); q.moveTo(0, -90); q.lineTo(8, -92); q.lineTo(9, -83); q.lineTo(1, -82); q.closePath(); q.fill(); q.fillStyle = o.col || SIL; }
  else if (o.fan) { const a = Math.sin(o.fan) * .5; q.lineWidth = 6; q.beginPath(); q.moveTo(10, -78); q.lineTo(26, -66); q.stroke(); q.save(); q.translate(26, -66); q.rotate(a - .6); q.fillStyle = '#9a8f5a'; q.beginPath(); q.moveTo(0, 0); q.arc(0, 0, 22, -.8, .8); q.closePath(); q.fill(); q.restore(); q.fillStyle = o.col || SIL; }
  else if (o.up) { const k = o.up; q.lineWidth = 6; q.beginPath(); q.moveTo(10, -78); q.lineTo(12 + 4 * k, -78 - 30 * k - 6); q.stroke(); q.beginPath(); q.arc(12 + 4 * k, -78 - 30 * k - 9, 4.5, 0, 7); q.fill(); }
  else { q.lineWidth = 6; q.beginPath(); q.moveTo(10, -78); q.lineTo(13, -52); q.stroke(); }
  q.restore();
}
function lamp(q, x, y, h, f, seed, a) {
  q.fillStyle = SIL; const s = h / 300; q.fillRect(x - 5 * s, y - h, 10 * s, h); q.fillRect(x - 14 * s, y - 22 * s, 28 * s, 22 * s); q.fillRect(x - 11 * s, y - h - 36 * s, 22 * s, 36 * s);
  q.beginPath(); q.moveTo(x - 17 * s, y - h - 36 * s); q.lineTo(x, y - h - 56 * s); q.lineTo(x + 17 * s, y - h - 36 * s); q.fill();
  const fl = .8 + .2 * Math.sin(f * .3 + seed * 3); glow(q, x, y - h - 18 * s, 220 * s, '255,190,90', (a || .8) * fl, 'lighter');
  q.fillStyle = 'rgba(255,224,150,.95)'; q.fillRect(x - 7 * s, y - h - 32 * s, 14 * s, 26 * s);
}
function bigBen(q, x, y, s, col, lit, f) {
  q.fillStyle = col; q.fillRect(x - 38 * s, y - 330 * s, 76 * s, 330 * s);
  q.fillRect(x - 50 * s, y - 440 * s, 100 * s, 120 * s); q.fillRect(x - 56 * s, y - 452 * s, 112 * s, 14 * s);
  q.beginPath(); q.moveTo(x - 48 * s, y - 452 * s); q.lineTo(x, y - 640 * s); q.lineTo(x + 48 * s, y - 452 * s); q.closePath(); q.fill();
  for (const dx of [-52, 52]) { q.beginPath(); q.moveTo(x + (dx - 7) * s, y - 452 * s); q.lineTo(x + dx * s, y - 500 * s); q.lineTo(x + (dx + 7) * s, y - 452 * s); q.fill(); }
  q.fillRect(x - 3 * s, y - 700 * s, 6 * s, 64 * s);
  if (lit) { const fl = .85 + .15 * Math.sin(f * .2); glow(q, x, y - 395 * s, 190 * s, '255,214,120', lit * fl, 'lighter'); q.fillStyle = `rgba(255,226,150,${.95 * lit})`; q.beginPath(); q.arc(x, y - 395 * s, 25 * s, 0, 7); q.fill(); q.strokeStyle = col; q.lineWidth = 2.5 * s; q.beginPath(); q.moveTo(x, y - 395 * s); q.lineTo(x, y - 414 * s); q.moveTo(x, y - 395 * s); q.lineTo(x + 11 * s, y - 392 * s); q.stroke(); }
}
function palaceLine(q, x0, x1, y, s, col, seed) {
  const r = R(seed); q.fillStyle = col; q.beginPath(); q.moveTo(x0, y + 4);
  let x = x0; while (x < x1) { const w = (30 + r() * 60) * s, h = (50 + r() * 90) * s, k = r();
    q.lineTo(x, y - h); if (k < .4) { q.lineTo(x + w / 2, y - h - (40 + r() * 70) * s); } else if (k < .7) { q.lineTo(x + w * .15, y - h - 12 * s); q.lineTo(x + w * .3, y - h); q.lineTo(x + w * .5, y - h - 14 * s); q.lineTo(x + w * .7, y - h); }
    x += w; q.lineTo(x, y - h * (.5 + r() * .4)); }
  q.lineTo(x1, y + 4); q.closePath(); q.fill();
}
function water(q, y0, y1, f, cTop, cBot, spd, camX, fac, rip) {
  vgrad(q, y0, y1, [[0, cTop], [1, cBot]]); const r = R(77); q.save(); q.lineWidth = 2.4;
  for (let i = 0; i < (rip || 70); i++) { const k = r(), yy = y0 + (y1 - y0) * Math.pow(k, 1.6), len = 40 + k * 170, xx = ((r() * (W + 400) + f * spd * (.3 + k) - camX * fac * (.3 + k)) % (W + 400) + (W + 400)) % (W + 400) - 200;
    q.strokeStyle = `rgba(230,220,160,${.05 + k * .12})`; q.beginPath(); q.moveTo(xx, yy); q.lineTo(xx + len, yy + Math.sin(f * .1 + i) * 1.5); q.stroke(); }
  q.restore();
}
function embers(q, f, seed, n, x0, y0, spread, rise, rgb) {
  const r = R(seed); q.save(); q.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const sp = .25 + r() * .6, ph = r(), age = ((f * .012 * sp + ph) % 1), x = x0 + (r() - .5) * spread + Math.sin(age * 9 + i) * 26, y = y0 - age * rise * (.5 + r()), a = Math.sin(age * 3.14) * (.35 + r() * .5), rad = 2 + r() * 5;
    q.fillStyle = `rgba(${rgb || '255,170,70'},${a})`; q.beginPath(); q.arc(x, y, rad, 0, 7); q.fill(); }
  q.restore();
}
function motes(q, f, seed, n, camX, fac, col) {
  const r = R(seed); q.save(); for (let i = 0; i < n; i++) { const dz = .4 + r() * 1.2, x = (((r() * (W + 200) - camX * fac * dz + Math.sin(f * .02 * dz + i) * 40) % (W + 200)) + W + 200) % (W + 200) - 100, y = (((r() * H - f * (.4 + r() * .7) * dz) % H) + H) % H, a = .15 + r() * .45;
    q.fillStyle = (col || 'rgba(255,235,170,A)').replace('A', a); q.beginPath(); q.arc(x, y, 1.2 + dz * 1.5, 0, 7); q.fill(); }
  q.restore();
}
function brickTile(w, h, seed, base, mortar) {
  const [cv, q] = mk(w, h); const r = R(seed); q.fillStyle = mortar; q.fillRect(0, 0, w, h);
  const bh = 26, bw = 64; for (let y = 0, row = 0; y < h; y += bh, row++) for (let x = -(row % 2) * bw / 2; x < w; x += bw) { const v = (r() - .5) * 26; q.fillStyle = `rgb(${base[0] + v},${base[1] + v * .7},${base[2] + v * .5})`; q.fillRect(x + 2, y + 2, bw - 4, bh - 4); }
  return cv;
}
