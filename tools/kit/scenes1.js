// ═════ CENAS · PALETAS, HORIZONTES, PAISAGEM, MAR ═════
const hex2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb = a => `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})`;
const mulc = (h, k) => { const a = hex2(h); return rgb(a.map(v => Math.min(255, v * k))); };
const mixc = (h1, h2, t) => { const a = hex2(h1), b = hex2(h2); return rgb(a.map((v, i) => v + (b[i] - v) * t)); };
const TOD = {
  day: { sky: ['#7f929c', '#bcc5b4', '#efe3bd'], far: '#a3a98c', mid: '#5f6249', sil: '#14110a', gnd: ['#8d8a58', '#3a3820'], glow: '255,240,190', dk: 1 },
  gold: { sky: ['#6a5a40', '#d8a860', '#fbe3a4'], far: '#b58a50', mid: '#6a4a24', sil: '#160e05', gnd: ['#a87c3c', '#3c2812'], glow: '255,214,130', dk: .9 },
  dusk: { sky: ['#1c1a2a', '#7a4a3e', '#f0a060'], far: '#8a5a48', mid: '#3e2a24', sil: '#0c0806', gnd: ['#4a3224', '#160e0a'], glow: '255,180,110', dk: .55 },
  dawn: { sky: ['#3a4a5c', '#c08a74', '#fbd9a0'], far: '#9a8478', mid: '#54483e', sil: '#12100c', gnd: ['#6a5a44', '#241c12'], glow: '255,220,160', dk: .75 },
  night: { sky: ['#04060c', '#0e1626', '#2a3a52'], far: '#16202e', mid: '#0c121c', sil: '#03050a', gnd: ['#1c2634', '#06080c'], glow: '170,200,255', dk: .22 },
  storm: { sky: ['#0c1014', '#2a3238', '#59635f'], far: '#3a4448', mid: '#1c2224', sil: '#07090a', gnd: ['#2c3430', '#0a0c0c'], glow: '200,220,255', dk: .45 },
  grey: { sky: ['#747c7e', '#aab0a8', '#d4d4c2'], far: '#9aa092', mid: '#6c7064', sil: '#1a1c18', gnd: ['#98998a', '#4a4c40'], glow: '240,240,220', dk: .85 },
  fire: { sky: ['#1a0603', '#6a2208', '#f09a3a'], far: '#8a3a14', mid: '#40160a', sil: '#0a0302', gnd: ['#4a1c0a', '#120503'], glow: '255,170,80', dk: .5 },
};
const GND = { grass: null, snow: ['#dedccc', '#8a897d'], sand: ['#d8bd86', '#7a6038'], mud: ['#6a4b26', '#24160a'], stone: ['#8d8776', '#3a372e'], dark: ['#1a1a14', '#050504'] };
// ── horizontes (tiles em cache) ──
const SKC = {};
function skyTile(kind, seed, col, s) {
  const key = kind + seed + col + s; if (SKC[key]) return SKC[key];
  const [cv, q] = mk(2600, 900), r = R(seed), B = 880; q.fillStyle = col; q.strokeStyle = col; q.lineCap = 'round';
  const spire = (x, w, h) => { q.fillRect(x, B - h, w, h); q.beginPath(); q.moveTo(x - 4 * s, B - h); q.lineTo(x + w / 2, B - h - w * 1.9); q.lineTo(x + w + 4 * s, B - h); q.fill(); };
  if (kind === 'city') { palaceLine(q, 0, 2600, B, 1.7 * s, col, seed); for (let i = 0; i < 9; i++) { const x = 100 + i * 280 + r() * 100, h = (180 + r() * 220) * s, w = (26 + r() * 22) * s; if (r() < .6) spire(x, w, h); else { q.fillRect(x, B - h, w * 1.8, h); q.beginPath(); q.ellipse(x + w * .9, B - h, w * 1.1, w * 1.1, 0, Math.PI, 0); q.fill(); q.fillRect(x + w * .86, B - h - w * 1.7, 3, w * .7); } } }
  else if (kind === 'castle') { q.fillRect(0, B - 140 * s, 2600, 140 * s); for (let x = 0; x < 2600; x += 34 * s) q.fillRect(x, B - 140 * s - 18 * s, 20 * s, 20 * s); for (let i = 0; i < 6; i++) { const x = 80 + i * 420 + r() * 120, w = (70 + r() * 30) * s, h = (260 + r() * 140) * s; q.fillRect(x, B - h, w, h); for (let k = 0; k < 4; k++) q.fillRect(x + k * w / 3.6, B - h - 20 * s, w / 5, 22 * s); if (r() < .6) { q.beginPath(); q.moveTo(x - 6, B - h - 18 * s); q.lineTo(x + w / 2, B - h - 120 * s); q.lineTo(x + w + 6, B - h - 18 * s); q.fill(); } } q.fillRect(1250, B - 520 * s, 180 * s, 520 * s); }
  else if (kind === 'mountains' || kind === 'volcano') { q.beginPath(); q.moveTo(0, B + 10); for (let x = 0; x <= 2600; x += 26) { let h = 160 + 150 * Math.sin(x * .004 + seed) + 110 * Math.sin(x * .011 + seed * 2) + r() * 40; if (kind === 'volcano') { const d = Math.abs(x - 1300); h = 90 + 40 * Math.sin(x * .01 + seed) + Math.max(0, 560 - d * .85) * (d < 80 ? .88 + d * .0015 : 1); } q.lineTo(x, B - h * s); } q.lineTo(2600, B + 10); q.fill(); }
  else if (kind === 'forest' || kind === 'jungle') { for (let x = -20; x < 2620; x += 16 * s) { const h = (150 + r() * 260) * s, w = (40 + r() * 36) * s; if (kind === 'forest') { for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(x - w * (1 - k * .18), B - h * (k * .24)); q.lineTo(x, B - h * (.36 + k * .24)); q.lineTo(x + w * (1 - k * .18), B - h * (k * .24)); q.fill(); } } else { q.fillRect(x, B - h * .7, 5 * s, h * .7); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55; q.beginPath(); q.moveTo(x + 2, B - h * .7); q.quadraticCurveTo(x + Math.cos(a) * w * 1.2, B - h * .7 + Math.sin(a) * w * .9, x + Math.cos(a) * w * 2, B - h * .7 + Math.sin(a) * w * 1.2 + 24 * s); q.quadraticCurveTo(x + Math.cos(a) * w * 1.2, B - h * .7 + Math.sin(a) * w * .6, x + 2, B - h * .7 + 4); q.fill(); } } } q.fillRect(0, B - 40 * s, 2600, 60); }
  else if (kind === 'port') { for (let x = 0; x < 2600; x += 110 * s) { const h = (50 + r() * 90) * s; q.fillRect(x, B - h, 100 * s, h); q.beginPath(); q.moveTo(x - 4, B - h); q.lineTo(x + 50 * s, B - h - 36 * s); q.lineTo(x + 104 * s, B - h); q.fill(); } q.lineWidth = 6 * s; for (let i = 0; i < 9; i++) { const x = 140 + i * 280 + r() * 120, h = (300 + r() * 220) * s; q.beginPath(); q.moveTo(x, B); q.lineTo(x, B - h); q.stroke(); q.lineWidth = 4 * s; for (let k = 0; k < 3; k++) { q.beginPath(); q.moveTo(x - 60 * s + k * 10, B - h + k * 90 * s); q.lineTo(x + 60 * s - k * 10, B - h + k * 90 * s); q.stroke(); } q.lineWidth = 6 * s; } }
  else if (kind === 'ruins') { q.fillRect(0, B - 30 * s, 2600, 40); for (let i = 0; i < 16; i++) { const x = 60 + i * 150 + r() * 60, h = (120 + r() * 260) * s; q.fillRect(x, B - h, 36 * s, h); q.fillRect(x - 8 * s, B - h - 14 * s, 52 * s, 14 * s); if (r() < .5) { q.beginPath(); q.moveTo(x, B - h); q.lineTo(x + 14 * s, B - h - 22 * s); q.lineTo(x + 24 * s, B - h - 6 * s); q.lineTo(x + 36 * s, B - h - 26 * s); q.lineTo(x + 36 * s, B - h); q.fill(); } if (r() < .35) { q.lineWidth = 30 * s; q.beginPath(); q.arc(x + 130 * s, B - h, 110 * s, Math.PI, Math.PI * 1.7); q.stroke(); } } }
  else if (kind === 'monastery') { q.fillRect(200, B - 200 * s, 1600, 200 * s); q.fillRect(300, B - 340 * s, 1000, 140 * s); q.beginPath(); q.moveTo(280, B - 340 * s); q.lineTo(800, B - 480 * s); q.lineTo(1320, B - 340 * s); q.fill(); q.fillRect(1500, B - 560 * s, 90 * s, 560 * s); q.beginPath(); q.moveTo(1490, B - 560 * s); q.lineTo(1545 * 1, B - 700 * s); q.lineTo(1600, B - 560 * s); q.fill(); q.fillRect(1542, B - 770 * s, 6, 70 * s); q.fillRect(1525, B - 750 * s, 40, 6); q.beginPath(); q.ellipse(1900, B - 200 * s, 130 * s, 150 * s, 0, Math.PI, 0); q.fill(); palaceLine(q, 0, 200, B, 1 * s, col, seed + 1); palaceLine(q, 1900, 2600, B, 1 * s, col, seed + 2); }
  else if (kind === 'village' || kind === 'dutch') { for (let x = 0; x < 2600; x += (60 + r() * 50) * s) { const w = (50 + r() * 40) * s, h = (50 + r() * 70) * s; q.fillRect(x, B - h, w, h); if (kind === 'dutch') { for (let k = 0; k < 4; k++) q.fillRect(x + k * 3 * s, B - h - (k + 1) * 9 * s, w - k * 6 * s, 9 * s); } else { q.beginPath(); q.moveTo(x - 6 * s, B - h); q.lineTo(x + w / 2, B - h - (36 + r() * 30) * s); q.lineTo(x + w + 6 * s, B - h); q.fill(); if (r() < .4) q.fillRect(x + w * .68, B - h - 52 * s, 9 * s, 34 * s); } x += w * .2; } spire(1300, 34 * s, 260 * s); }
  else if (kind === 'huts') { for (let x = 40; x < 2600; x += (110 + r() * 90) * s) { const w = (70 + r() * 30) * s, h = (50 + r() * 20) * s; q.fillRect(x, B - h, w, h); q.beginPath(); q.moveTo(x - 10 * s, B - h); q.lineTo(x + w / 2, B - h - 60 * s); q.lineTo(x + w + 10 * s, B - h); q.fill(); } for (let i = 0; i < 4; i++) { const x = 300 + i * 650 + r() * 100; q.fillRect(x, B - 280 * s, 22 * s, 280 * s); q.beginPath(); q.ellipse(x + 11 * s, B - 290 * s, 150 * s, 50 * s, 0, 0, 7); q.fill(); } }
  else if (kind === 'tower') { q.beginPath(); q.moveTo(0, B + 10); for (let x = 0; x <= 2600; x += 40) q.lineTo(x, B - 60 * s - 40 * s * Math.sin(x * .006 + seed)); q.lineTo(2600, B + 10); q.fill(); q.fillRect(1260, B - 760 * s, 90 * s, 760 * s); for (let k = 0; k < 4; k++) q.fillRect(1254 + k * 28 * s, B - 790 * s, 18 * s, 34 * s); q.fillRect(1230, B - 640 * s, 150 * s, 24); }
  else if (kind === 'dunes') { q.beginPath(); q.moveTo(0, B + 10); for (let x = 0; x <= 2600; x += 30) q.lineTo(x, B - (90 + 70 * Math.sin(x * .006 + seed) + 40 * Math.sin(x * .017)) * s); q.lineTo(2600, B + 10); q.fill(); q.beginPath(); q.moveTo(1000, B - 70); q.lineTo(1400, B - 400 * s); q.lineTo(1800, B - 70); q.fill(); }
  else { q.beginPath(); q.moveTo(0, B + 10); for (let x = 0; x <= 2600; x += 30) q.lineTo(x, B - (60 + 50 * Math.sin(x * .004 + seed) + 30 * Math.sin(x * .013)) * s); q.lineTo(2600, B + 10); q.fill(); }
  return SKC[key] = cv;
}
function skyline(q, kind, hz, cx, fac, col, s, seed, a) { const t = skyTile(kind, seed, col, s); q.save(); if (a != null) q.globalAlpha = a; q.drawImage(t, -760 - cx * fac, hz - 880 + 2); q.restore(); }
function stars(q, f, n, seed, a) { const r = R(seed); q.fillStyle = '#fff'; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * 900, s = .6 + r() * 1.8; q.globalAlpha = a * (.4 + .6 * Math.abs(Math.sin(f * .05 + i))); q.fillRect(x, y, s, s); } q.globalAlpha = 1; }
function clouds(q, f, y, n, col, a, spd, cx, seed) { const r = R(seed); q.save(); q.fillStyle = col; for (let i = 0; i < n; i++) { const x = (((r() * (W + 800) + f * spd - cx * .15) % (W + 800)) + W + 800) % (W + 800) - 400, yy = y + r() * 260, w = 220 + r() * 300; for (let k = 0; k < 6; k++) { q.globalAlpha = a * .28; q.beginPath(); q.ellipse(x + (k - 2.5) * w * .16, yy + Math.sin(k * 2 + i) * 14, w * .26, 38 + r() * 22, 0, 0, 7); q.fill(); } } q.restore(); }
function bolt(q, x, y0, y1, seed, a) { const r = R(seed); q.save(); q.strokeStyle = `rgba(230,240,255,${a})`; q.lineWidth = 7; q.shadowColor = 'rgba(200,220,255,1)'; q.shadowBlur = 40; q.beginPath(); let px = x, py = y0; q.moveTo(px, py); while (py < y1) { px += (r() - .5) * 90; py += 40 + r() * 70; q.lineTo(px, py); } q.stroke(); q.restore(); }
function rainFx(q, f, n, spd, sl, a) { const r = R(5); q.save(); q.strokeStyle = `rgba(210,220,230,${a})`; q.lineWidth = 2.2; for (let i = 0; i < n; i++) { const x = r() * (W + 400) - 200, y0 = r() * (H + 200); const y = (y0 + f * spd * (.7 + r() * .6)) % (H + 200) - 100, xx = x - (y * sl); q.beginPath(); q.moveTo(xx % (W + 200), y); q.lineTo(xx % (W + 200) - 8 * sl * 3, y + 34); q.stroke(); } q.restore(); }
function snowFx(q, f, n, a) { const r = R(11); q.save(); q.fillStyle = `rgba(250,248,240,${a})`; for (let i = 0; i < n; i++) { const s = 1.5 + r() * 4, x0 = r() * W, y0 = r() * H, sp = 1.5 + s * .7; const x = (x0 + Math.sin(f * .03 + i) * 40 + f * .6) % W, y = (y0 + f * sp) % H; q.beginPath(); q.arc(x, y, s, 0, 7); q.fill(); } q.restore(); }
function ashFx(q, f, n, rgbc) { const r = R(23); q.save(); for (let i = 0; i < n; i++) { const s = 1.5 + r() * 3.5, x0 = r() * W, y0 = r() * H; const x = (x0 + Math.sin(f * .02 + i) * 50 + f * .9 + W) % W, y = (y0 + f * (1 + s * .5)) % H; q.fillStyle = `rgba(${rgbc || '40,36,30'},${.35 + .4 * r()})`; q.beginPath(); q.arc(x, y, s, 0, 7); q.fill(); } q.restore(); }
function birds(q, f, n, y, cx, seed) { const r = R(seed); q.save(); q.strokeStyle = SIL; q.lineWidth = 3.2; for (let i = 0; i < n; i++) { const x = (((r() * 1400 + f * (2 + r() * 2) - cx * .4) % 1400) + 1400) % 1400 - 160, yy = y + r() * 220 + Math.sin(f * .03 + i) * 20, fl = Math.sin(f * .3 + i * 2) * 10, s = 14 + r() * 14; q.beginPath(); q.moveTo(x - s, yy - fl); q.quadraticCurveTo(x - s / 2, yy - fl - 6, x, yy); q.quadraticCurveTo(x + s / 2, yy - fl - 6, x + s, yy - fl); q.stroke(); } q.restore(); }
// ── adereços ──
function tent(q, x, y, s, col, lit) { q.fillStyle = col; q.beginPath(); q.moveTo(x - 90 * s, y); q.lineTo(x, y - 130 * s); q.lineTo(x + 90 * s, y); q.closePath(); q.fill(); q.fillRect(x - 2, y - 170 * s, 4, 50 * s); q.beginPath(); q.moveTo(x + 2, y - 170 * s); q.lineTo(x + 34 * s, y - 160 * s); q.lineTo(x + 2, y - 150 * s); q.fill(); if (lit) { q.fillStyle = 'rgba(255,200,110,.85)'; q.beginPath(); q.moveTo(x - 18 * s, y); q.lineTo(x, y - 52 * s); q.lineTo(x + 18 * s, y); q.fill(); } }
function bonfire(q, x, y, s, f) { glow(q, x, y - 60 * s, 420 * s, '255,170,80', .95, 'lighter'); q.fillStyle = SIL; q.save(); q.translate(x, y); q.rotate(.3); q.fillRect(-70 * s, -8 * s, 140 * s, 16 * s); q.rotate(-.6); q.fillRect(-70 * s, -8 * s, 140 * s, 16 * s); q.restore(); for (let i = 0; i < 6; i++) { const k = i - 2.5; q.fillStyle = i % 2 ? '#ffd98a' : '#ffb04a'; q.beginPath(); q.moveTo(x + k * 18 * s, y); q.quadraticCurveTo(x + k * 26 * s + Math.sin(f * .4 + i) * 10 * s, y - 90 * s, x + k * 8 * s + Math.sin(f * .3 + i * 2) * 14 * s, y - (150 + (i % 3) * 40) * s + Math.sin(f * .5 + i) * 10 * s); q.quadraticCurveTo(x + k * 12 * s + 14 * s, y - 70 * s, x + (k + 1) * 18 * s, y); q.fill(); } }
function pyre(q, x, y, s, f, lit) { q.fillStyle = SIL; q.fillRect(x - 6 * s, y - 300 * s, 12 * s, 300 * s); for (let i = 0; i < 9; i++) { q.save(); q.translate(x, y - 8 * s); q.rotate((i - 4) * .22); q.fillRect(-5 * s, -120 * s, 10 * s, 130 * s); q.restore(); } if (lit) bonfire(q, x, y, s * 1.6, f); }
function bannerP(q, x, y, h, f, col, i, big) { q.fillStyle = SIL; q.fillRect(x - 3, y - h, 6, h); q.beginPath(); q.moveTo(x, y - h); q.lineTo(x + h * .5 + Math.sin(f * .12 + i) * 12, y - h + 8 + Math.sin(f * .1 + i) * 6); for (let k = 0; k < 5; k++) q.lineTo(x + h * (.5 - k * .09) + Math.sin(f * .12 + i - k * .5) * 12, y - h + 8 + h * .16 * (k + 1) / 5 * 2 + Math.sin(f * .1 + i + k) * 8); q.lineTo(x, y - h + h * .32); q.closePath(); q.fillStyle = col || '#6a3a20'; q.fill(); if (big) { q.fillStyle = SIL; q.beginPath(); q.arc(x + h * .22, y - h + h * .15, h * .06, 0, 7); q.fill(); } }
function cart(q, x, y, s, f) { q.fillStyle = SIL; q.fillRect(x - 70 * s, y - 60 * s, 140 * s, 30 * s); q.fillRect(x - 74 * s, y - 100 * s, 8 * s, 40 * s); q.fillRect(x + 66 * s, y - 100 * s, 8 * s, 40 * s); q.strokeStyle = SIL; q.lineWidth = 7 * s; for (const dx of [-40, 40]) { q.beginPath(); q.arc(x + dx * s, y - 22 * s, 24 * s, 0, 7); q.stroke(); for (let k = 0; k < 4; k++) { const a = k * .79 + f * .02; q.beginPath(); q.moveTo(x + dx * s, y - 22 * s); q.lineTo(x + dx * s + Math.cos(a) * 24 * s, y - 22 * s + Math.sin(a) * 24 * s); q.stroke(); } } q.lineWidth = 6 * s; q.beginPath(); q.moveTo(x + 70 * s, y - 50 * s); q.lineTo(x + 150 * s, y - 36 * s); q.stroke(); }
function gate(q, x, y, s, f, open) { q.fillStyle = SIL; q.fillRect(x - 260 * s, y - 520 * s, 130 * s, 520 * s); q.fillRect(x + 130 * s, y - 520 * s, 130 * s, 520 * s); for (const dx of [-260, -208, -156, 130, 182, 234]) q.fillRect(x + dx * s, y - 556 * s, 28 * s, 40 * s); q.fillRect(x - 260 * s, y - 440 * s, 520 * s, 130 * s); q.beginPath(); q.moveTo(x - 130 * s, y); q.lineTo(x - 130 * s, y - 250 * s); q.arc(x, y - 250 * s, 130 * s, Math.PI, 0); q.lineTo(x + 130 * s, y); q.closePath(); q.fillStyle = '#e9c27a'; q.fill(); q.fillStyle = SIL; const dw = 130 * s * (1 - (open || 0)); q.fillRect(x - 130 * s, y - 380 * s, dw, 380 * s); q.fillRect(x + 130 * s - dw, y - 380 * s, dw, 380 * s); glow(q, x, y - 140 * s, 360 * s * (.3 + (open || 0)), '255,210,120', .6 * (open || 0) + .15, 'lighter'); }
function villa(q, x, y, s, f, seed) { q.fillStyle = SIL; q.fillRect(x - 320 * s, y - 300 * s, 640 * s, 300 * s); q.beginPath(); q.moveTo(x - 350 * s, y - 300 * s); q.lineTo(x - 120 * s, y - 440 * s); q.lineTo(x + 120 * s, y - 440 * s); q.lineTo(x + 350 * s, y - 300 * s); q.fill(); q.fillRect(x + 140 * s, y - 520 * s, 30 * s, 100 * s); const r = R(seed || 3); for (let i = 0; i < 6; i++) { const wx = x - 270 * s + i * 100 * s, wy = y - 230 * s; const fl = .7 + .3 * Math.sin(f * .2 + i * 2); glow(q, wx + 25 * s, wy + 35 * s, 110 * s, '255,190,100', .7 * fl, 'lighter'); q.fillStyle = `rgba(255,214,140,${.9 * fl})`; q.fillRect(wx, wy, 50 * s, 74 * s); q.fillStyle = SIL; q.fillRect(wx + 23 * s, wy, 4 * s, 74 * s); q.fillRect(wx, wy + 33 * s, 50 * s, 4 * s); } }
function mill(q, x, y, s, f) { q.fillStyle = SIL; q.beginPath(); q.moveTo(x - 60 * s, y); q.lineTo(x - 36 * s, y - 280 * s); q.lineTo(x + 36 * s, y - 280 * s); q.lineTo(x + 60 * s, y); q.fill(); q.beginPath(); q.moveTo(x - 46 * s, y - 280 * s); q.lineTo(x, y - 340 * s); q.lineTo(x + 46 * s, y - 280 * s); q.fill(); q.save(); q.translate(x, y - 270 * s); q.rotate(f * .012); q.lineWidth = 8 * s; q.strokeStyle = SIL; for (let k = 0; k < 4; k++) { q.rotate(Math.PI / 2); q.beginPath(); q.moveTo(0, 0); q.lineTo(0, -230 * s); q.stroke(); q.fillStyle = 'rgba(40,30,16,.85)'; q.fillRect(6 * s, -220 * s, 52 * s, 150 * s); } q.restore(); }
function bigtree(q, x, y, h, f, seed, col) { const r = R(seed); q.fillStyle = col || SIL; q.strokeStyle = col || SIL; q.lineCap = 'round'; q.lineWidth = h * .06; q.beginPath(); q.moveTo(x, y); q.quadraticCurveTo(x + 10, y - h * .4, x - 6, y - h * .72); q.stroke(); const br = (bx, by, a, l, d) => { if (d > 3) return; const ex = bx + Math.cos(a) * l, ey = by + Math.sin(a) * l; q.lineWidth = Math.max(2, h * .035 / (d + 1)); q.beginPath(); q.moveTo(bx, by); q.lineTo(ex, ey); q.stroke(); br(ex, ey, a - .5 + Math.sin(f * .02 + d) * .03, l * .7, d + 1); br(ex, ey, a + .5 + Math.sin(f * .02 + d + 1) * .03, l * .7, d + 1); }; br(x - 6, y - h * .72, -Math.PI / 2 - .3, h * .26, 0); br(x - 6, y - h * .6, -Math.PI / 2 + .7, h * .2, 0); }
function ground(q, hz, tod, gt, f, cx, p) {
  const T = TOD[tod], gg = GND[gt]; let c0 = T.gnd[0], c1 = T.gnd[1];
  if (gg) { c0 = mulc(gg[0], Math.max(.2, T.dk)); c1 = mulc(gg[1], Math.max(.2, T.dk)); }
  if (gt === 'water') { water(q, hz, H + 700, f, mulc('#5a6a50', T.dk + .1), mulc('#10140c', T.dk + .1), 1.4, cx, .3, 80); return; }
  vgrad(q, hz, H + 700, [[0, c0], [1, c1]], -600, W + 1200);
  q.save(); q.lineWidth = 2.2; const r = R(41);
  if (p.road) { q.fillStyle = mulc('#d6c08a', Math.max(.25, T.dk)); q.beginPath(); const vx = 540 + (p.roadx || 0) - cx * .3; q.moveTo(vx - 14, hz); q.lineTo(vx + 14, hz); q.quadraticCurveTo(vx + 80 + (p.roadc || 0), hz + 420, vx + 520, H + 100); q.lineTo(vx - 520 - (p.roadc || 0) * 2, H + 100); q.quadraticCurveTo(vx - 80, hz + 420, vx - 14, hz); q.fill(); }
  if (p.furrows) { q.strokeStyle = 'rgba(20,14,6,.35)'; for (let i = -9; i <= 9; i++) { q.beginPath(); q.moveTo(540 + i * 12 - cx * .3, hz); q.lineTo(540 + i * 190 - cx * 1.1, H + 80); q.stroke(); } }
  for (let i = 0; i < 70; i++) { const k = Math.pow(r(), 1.7), y = hz + 20 + k * (H - hz + 400), x = ((r() * (W + 1200) - cx * (.3 + k)) % (W + 1200) + W + 1200) % (W + 1200) - 600, l = 6 + k * 46; q.strokeStyle = `rgba(10,8,4,${.25 + k * .3})`; q.beginPath(); q.moveTo(x, y); q.lineTo(x - l * .3, y - l); q.moveTo(x, y); q.lineTo(x + l * .35, y - l * .9); q.stroke(); }
  q.restore();
}
// ═════ PAISAGEM ═════
const SKY_ALIAS = { houses: 'village', town: 'village', fields: 'plain', hill: 'plain', hills: 'plain', cathedral: 'monastery', church: 'monastery', africa: 'huts', desert: 'dunes', canal: 'dutch', harbor: 'port', harbour: 'port', woods: 'forest' };
function T_landscape(p, f, n, cx) {
  const tod = p.tod || 'day', T = TOD[tod], hz = p.hz || 1120, u = f / n, sd = p.seed || 7;
  vgrad(g, -900, hz, [[0, T.sky[0]], [.5, T.sky[1]], [1, T.sky[2]]], -600, W + 1200);
  if (tod === 'night' || p.stars) stars(g, f, 90, sd, .9);
  const cel = p.cel || (tod === 'night' ? 'moon' : tod === 'storm' || tod === 'grey' ? 'pale' : tod === 'fire' ? 'none' : 'sun');
  const sx = (p.sx != null ? p.sx : .66) * W - cx * .08, sy = p.sy || hz - 420 - (tod === 'day' ? 300 : tod === 'gold' ? 120 : 0);
  if (cel !== 'none') {
    glow(g, sx, sy, 640, T.glow, cel === 'pale' ? .32 : .55, 'lighter');
    if (cel === 'moon') { g.fillStyle = '#f0ead0'; g.beginPath(); g.arc(sx, sy, 86, 0, 7); g.fill(); g.fillStyle = 'rgba(120,120,110,.4)'; for (const [a, b, r] of [[-26, -12, 18], [22, 20, 24], [28, -30, 11]]) { g.beginPath(); g.arc(sx + a, sy + b, r, 0, 7); g.fill(); } }
    else if (cel === 'eclipse') { glow(g, sx, sy, 340, '255,240,200', .7, 'lighter'); g.fillStyle = '#020202'; g.beginPath(); g.arc(sx, sy, 92, 0, 7); g.fill(); g.strokeStyle = 'rgba(255,240,200,.9)'; g.lineWidth = 6; g.beginPath(); g.arc(sx, sy, 96, 0, 7); g.stroke(); }
    else { g.fillStyle = cel === 'pale' ? 'rgba(240,238,225,.75)' : '#fff4d0'; g.beginPath(); g.arc(sx, sy, cel === 'pale' ? 66 : 82, 0, 7); g.fill(); }
  }
  if (p.clouds !== 0) clouds(g, f, 120, tod === 'storm' ? 9 : 5, tod === 'night' ? '#0a0f18' : tod === 'storm' ? '#0c1012' : tod === 'dusk' || tod === 'fire' ? '#3a1a10' : '#f4ecd6', tod === 'storm' ? .9 : .7, .25, cx, sd + 2);
  if (p.lightning && ((f % 54) < 5 || (f % 97) < 3)) { g.fillStyle = `rgba(230,238,255,${.4 * (1 - (f % 54) / 5)})`; g.fillRect(0, 0, W, hz); bolt(g, 300 + ((f * 7) % 500), 0, hz - 20, Math.floor(f / 54), .95); }
  if (p.back) skyline(g, SKY_ALIAS[p.back] || p.back, hz - 10, cx, .18, T.far, 1.15, sd + 5, .8);
  const sk = SKY_ALIAS[p.sky] || p.sky || 'plain';
  skyline(g, sk === 'volcano' ? 'volcano' : sk, hz + 4, cx, .4, p.skyfar ? T.far : T.mid, p.ss || 1, sd, 1);
  if (p.volcano) { const vx = 540 - cx * .4 + (p.vx || 0), vy = hz - 600 * (p.ss || 1); g.save(); const pl = Math.sin(f * .02) * 14; for (let i = 0; i < 30; i++) { const k = i / 30, y = vy - k * 1400 - f * .3 % 1, w = 50 + k * 420, x = vx + Math.sin(k * 5 + f * .02) * 50 * k + pl * k; g.fillStyle = `rgba(${120 - 55 * k},${100 - 48 * k},${88 - 42 * k},.95)`; g.beginPath(); g.ellipse(x, y, w, 60 + k * 90, 0, 0, 7); g.fill(); } g.restore(); for (let i = 0; i < 7; i++) { g.strokeStyle = `rgba(255,${120 + i * 12},50,.8)`; g.lineWidth = 6; g.beginPath(); g.moveTo(vx + (i - 3) * 8, vy + 20); g.lineTo(vx + (i - 3) * 60 + Math.sin(i) * 20, vy + 330 + i % 3 * 60); g.stroke(); } glow(g, vx, vy + 30, 520, '255,120,40', .8 + .2 * Math.sin(f * .3), 'lighter'); }
  glow(g, 540, hz - 20, 760, T.glow, tod === 'night' ? .08 : .22, 'lighter');
  fog(g, tod === 'fire' ? FOG_D : FOG_W, hz - 220, 300, f, .5, tod === 'night' || tod === 'storm' ? .22 : .38, cx, .2, 1.5);
  ground(g, hz, tod, p.gnd || 'grass', f, cx, p);
  for (const pr of (p.props || [])) {
    const x = pr.x * W - cx * .85, y = pr.y || hz + 160, s = pr.s || 1;
    if (pr.t === 'tent') tent(g, x, y, s * 2, T.sil, tod === 'night' || tod === 'dusk');
    else if (pr.t === 'bonfire') bonfire(g, x, y, s * 1.4, f);
    else if (pr.t === 'pyre') pyre(g, x, y, s * 1.8, f, pr.lit !== 0);
    else if (pr.t === 'cart') cart(g, x, y, s * 2, f);
    else if (pr.t === 'gate') gate(g, x, y, s * 1.3, f, pr.open != null ? eIO(clamp((u - pr.open) * 3)) : 0);
    else if (pr.t === 'villa') villa(g, x, y, s * 1.2, f, sd);
    else if (pr.t === 'mill') mill(g, x, y, s * 1.4, f);
    else if (pr.t === 'tree') bigtree(g, x, y, 560 * s, f, sd + (pr.k || 0), T.sil);
    else if (pr.t === 'banner') bannerP(g, x, y, 420 * s, f, pr.col, pr.k || 0, 1);
    else if (pr.t === 'icon') icon(g, pr.n, x, pr.y || 900, (pr.s || 1.6), f, pr.rot);
    else if (pr.t === 'tomb') icon(g, 'tomb', x, y - 60, s * 2.2, f);
  }
  for (const a of (p.actors || [])) crowd(g, f, Object.assign({ x0: 540, spread: 640, h: 330, y: hz + 520, camx: cx, fac: 1.15, seed: sd + 3, col: T.sil }, a, { col: undefined }));
  for (const k of (p.trunks || [])) bigtree(g, k * W - cx * 1.5, H + 140, 1500, f, sd + k * 10, T.sil);
  if (p.fg !== 0) { g.fillStyle = T.sil; const r = R(sd + 9); for (let i = 0; i < 14; i++) { const x = ((r() * (W + 600) - cx * 1.5) % (W + 600) + W + 600) % (W + 600) - 300; g.beginPath(); for (let k = 0; k < 5; k++) { g.moveTo(x + k * 6, H + 20); g.quadraticCurveTo(x + k * 10 - 10, H - 60 - r() * 90, x + k * 14 - 22 + Math.sin(f * .05 + i) * 6, H - 130 - r() * 120); g.quadraticCurveTo(x + k * 12, H - 60, x + k * 6 + 8, H + 20); } g.fill(); } }
  if (p.banners) for (const b of p.banners) bannerP(g, b[0] * W - cx * 1.3, b[1] || H - 160, b[2] || 700, f, '#7a3a1c', b[0] * 9, 1);
  if (p.fire || tod === 'fire') { glow(g, 540, H, 1100, '255,120,40', .5, 'lighter'); }
  if (p.birds) birds(g, f, p.birds, 260, cx, sd);
  if (p.rain) rainFx(g, f, 220, 34, .35, .5);
  if (p.snow) snowFx(g, f, 160, .85);
  if (p.ash) ashFx(g, f, 160, tod === 'night' ? '200,190,170' : '40,36,30');
  if (p.fog !== 0) fog(g, tod === 'fire' ? FOG_D : FOG_G, hz + 260, 560, f, 1.1, p.fogA == null ? .28 : p.fogA, cx, .9, 1.3);
  if (p.embers || tod === 'fire') embers(g, f * 2, 9, 40, 540, hz + 400, 900, 1000, '255,170,70');
  if (p.smoke) fog(g, FOG_D, 360, 700, f, 1.3, p.smoke, cx, .3, 1.5);
  motes(g, f * 1.6, 5, 40, cx, .8, tod === 'night' ? 'rgba(200,220,255,A)' : 'rgba(255,235,170,A)');
}
// ═════ MAR ═════
function T_sea(p, f, n, cx) {
  const tod = p.tod || 'day', T = TOD[tod], hz = p.hz || 1000, sd = p.seed || 5, u = f / n;
  vgrad(g, -900, hz, [[0, T.sky[0]], [.55, T.sky[1]], [1, T.sky[2]]], -600, W + 1200);
  if (tod === 'night') stars(g, f, 80, sd, .8);
  const sx = .62 * W - cx * .08, sy = hz - 300; glow(g, sx, sy, 620, T.glow, tod === 'storm' ? .15 : .55, 'lighter');
  if (tod !== 'storm') { g.fillStyle = tod === 'night' ? '#f0ead0' : '#fff2cc'; g.beginPath(); g.arc(sx, sy, 78, 0, 7); g.fill(); }
  clouds(g, f, 140, tod === 'storm' ? 10 : 5, tod === 'night' ? '#0a0f18' : tod === 'storm' ? '#0a0e10' : '#f2e8d0', tod === 'storm' ? .95 : .7, .3, cx, sd);
  if (p.lightning && ((f % 50) < 5 || (f % 83) < 3)) { g.fillStyle = `rgba(230,238,255,${.45 * (1 - (f % 50) / 5)})`; g.fillRect(0, 0, W, hz); bolt(g, 200 + ((f * 9) % 600), 0, hz, Math.floor(f / 50), .95); }
  if (p.cape) skyline(g, SKY_ALIAS[p.cape] || p.cape, hz + 4, cx, .35, T.mid, 1, sd + 4, 1);
  const wc = [mulc('#6b7c70', T.dk + .15), mulc('#1a2420', T.dk + .15)];
  vgrad(g, hz, H + 700, [[0, wc[0]], [1, wc[1]]], -600, W + 1200);
  glow(g, sx, hz + 40, 520, T.glow, .3, 'lighter');
  const amp = p.rough ? 38 : 16;
  const wave = (yy, k, col, sp, a2) => { g.fillStyle = col; g.beginPath(); g.moveTo(-100, H + 700); for (let x = -100; x <= W + 100; x += 20) g.lineTo(x, yy + Math.sin(x * .012 * (1 + k * .4) + f * sp + k * 2) * a2 + Math.sin(x * .031 + f * sp * 1.7) * a2 * .4); g.lineTo(W + 100, H + 700); g.closePath(); g.fill(); };
  const shipAt = (sh, i) => { const x = sh.x * W - cx * (.3 + sh.s * .3), y = sh.y || hz + 120 + sh.s * 260; icon(g, sh.n || 'ship', x + Math.sin(f * .02 + i) * 12, y, sh.s * 2.2, f + i * 9, (sh.n === 'plane') ? Math.sin(f * .04) * .04 : 0); };
  const ships = (p.ships || []).slice().sort((a, b) => a.s - b.s);
  for (let k = 0; k < 6; k++) { const yy = hz + 40 + k * k * 22 + k * 60; wave(yy, k, mulc(k % 2 ? '#2a3a34' : '#4a5a50', T.dk + .1 + k * .02), .03 + k * .012, amp * (.4 + k * .35)); for (const [i, sh] of ships.entries()) if (Math.min(5, Math.floor(sh.s * 3.2)) === k) shipAt(sh, i); }
  if (p.cape && p.capeFg) { }
  if (p.rain) rainFx(g, f, 260, 36, .4, .55);
  fog(g, FOG_W, hz - 160, 320, f, .6, tod === 'storm' ? .3 : .22, cx, .2, 1.6);
  if (p.spray) { g.fillStyle = 'rgba(240,240,230,.35)'; const r = R(8); for (let i = 0; i < 70; i++) { g.beginPath(); g.arc(r() * W, H - r() * 500 - ((f * 3 + i * 40) % 160), 2 + r() * 4, 0, 7); g.fill(); } }
  for (const a of (p.actors || [])) crowd(g, f, Object.assign({ x0: 540, spread: 500, h: 360, y: H - 120, camx: cx, fac: 1.2, seed: sd }, a));
  if (p.icon) icon(g, p.icon, 540, 880, 3.2, f);
  motes(g, f * 1.4, 7, 30, cx, .6, 'rgba(255,235,170,A)');
}
