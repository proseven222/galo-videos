const T = {
  inkRGB: '58,36,18', ink: '#3a2412', inkDeep: '#241408', paper: '#dcc392', paperLight: '#ead7a8',
  ember: '#d9742a', glow: '#f2b95c', brass1: '#7a5429', brass2: '#d9b36a', brass3: '#5c3d1c',
  sea1: '#bf9d68', sea2: '#8f6d3e',
  S1: 90, S2: 240
};
const ink = a => `rgba(${T.inkRGB},${a})`;
function makeParchment(w, h, seed) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const q = cv.getContext('2d'); const r = R(seed);
  const gr = q.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#dcc392'); gr.addColorStop(.5, '#e4cfa0'); gr.addColorStop(1, '#d3b684');
  q.fillStyle = gr; q.fillRect(0, 0, w, h);
  for (let i = 0; i < 110; i++) {
    const x = r() * w, y = r() * h, rad = 80 + r() * 280; const rg = q.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() < .6; const a = .04 + r() * .08;
    rg.addColorStop(0, dark ? `rgba(130,85,35,${a})` : `rgba(255,240,200,${a})`); rg.addColorStop(1, 'rgba(0,0,0,0)');
    q.fillStyle = rg; q.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 7; i++) { q.strokeStyle = `rgba(110,70,25,${.02 + r() * .02})`; q.lineWidth = 3 + r() * 6; q.beginPath(); q.arc(r() * w, r() * h, 40 + r() * 140, 0, 7); q.stroke(); }
  for (let i = 0; i < 1100; i++) { const x = r() * w, y = r() * h, a = r() * 6.28, l = 6 + r() * 26; q.strokeStyle = `rgba(90,55,20,${.04 + r() * .05})`; q.lineWidth = 1; q.beginPath(); q.moveTo(x, y); q.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); q.stroke(); }
  // dobras
  q.strokeStyle = 'rgba(90,55,20,.10)'; q.lineWidth = 3; q.beginPath(); q.moveTo(w * .5, 0); q.lineTo(w * .5, h); q.moveTo(0, h * .5); q.lineTo(w, h * .5); q.stroke();
  q.strokeStyle = 'rgba(255,245,210,.12)'; q.lineWidth = 2; q.beginPath(); q.moveTo(w * .5 + 3, 0); q.lineTo(w * .5 + 3, h); q.moveTo(0, h * .5 + 3); q.lineTo(w, h * .5 + 3); q.stroke();
  const eg = q.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .32, w / 2, h / 2, Math.max(w, h) * .72);
  eg.addColorStop(0, 'rgba(90,50,15,0)'); eg.addColorStop(1, 'rgba(90,50,15,.5)'); q.fillStyle = eg; q.fillRect(0, 0, w, h);
  const id = q.getImageData(0, 0, w, h), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - .5) * 20; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  q.putImageData(id, 0, 0); return cv;
}
const PARCH = makeParchment(1240, 2440, 11);
function drawCompass(q, x, y, rad, rot) {
  q.save(); q.translate(x, y); q.rotate(rot);
  q.strokeStyle = ink(.7); q.lineWidth = 3; q.beginPath(); q.arc(0, 0, rad, 0, 7); q.stroke(); q.lineWidth = 1.6; q.beginPath(); q.arc(0, 0, rad * .86, 0, 7); q.stroke(); q.beginPath(); q.arc(0, 0, rad * .5, 0, 7); q.stroke();
  for (let i = 0; i < 32; i++) { const a = i / 32 * 6.28; q.lineWidth = i % 4 === 0 ? 2.4 : 1; q.beginPath(); q.moveTo(Math.cos(a) * rad * .86, Math.sin(a) * rad * .86); q.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); q.stroke(); }
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * 6.28 - Math.PI / 2, major = i % 4 === 0, half = i % 2 === 0, len = rad * (major ? .98 : half ? .72 : .5), wd = rad * (major ? .13 : .08);
    const tx = Math.cos(a) * len, ty = Math.sin(a) * len, nx = Math.cos(a + 1.5708) * wd, ny = Math.sin(a + 1.5708) * wd;
    q.fillStyle = ink(.85); q.beginPath(); q.moveTo(0, 0); q.lineTo(nx, ny); q.lineTo(tx, ty); q.closePath(); q.fill();
    q.fillStyle = 'rgba(234,215,168,.9)'; q.beginPath(); q.moveTo(0, 0); q.lineTo(-nx, -ny); q.lineTo(tx, ty); q.closePath(); q.fill(); q.strokeStyle = ink(.8); q.lineWidth = 1.4; q.stroke();
  }
  q.fillStyle = ink(.9); q.beginPath(); q.moveTo(0, -rad * 1.18); q.lineTo(rad * .09, -rad * 1.0); q.lineTo(-rad * .09, -rad * 1.0); q.closePath(); q.fill(); q.beginPath(); q.arc(0, -rad * 1.06, rad * .04, 0, 7); q.fill();
  q.restore();
}
function drawBorder(q) {
  q.save(); q.strokeStyle = T.ink; q.fillStyle = T.ink;
  q.lineWidth = 7; q.strokeRect(26, 26, W - 52, H - 52); q.lineWidth = 2.5; q.strokeRect(62, 62, W - 124, H - 124);
  // faixa graduada
  const seg = 30;
  for (let x = 62; x < W - 62; x += seg * 2) { q.fillRect(x, 34, seg, 20); q.fillRect(x, H - 54, seg, 20); }
  for (let y = 62; y < H - 62; y += seg * 2) { q.fillRect(34, y, 20, seg); q.fillRect(W - 54, y, 20, seg); }
  // cantos
  for (const [cx, cy, sx, sy] of [[44, 44, 1, 1], [W - 44, 44, -1, 1], [44, H - 44, 1, -1], [W - 44, H - 44, -1, -1]]) {
    q.save(); q.translate(cx, cy); q.scale(sx, sy); q.fillStyle = T.ink; q.fillRect(-18, -18, 36, 36); q.fillStyle = '#e9d6a6'; q.fillRect(-12, -12, 24, 24); q.fillStyle = T.ink; q.beginPath(); q.moveTo(0, -10); q.lineTo(10, 0); q.lineTo(0, 10); q.lineTo(-10, 0); q.closePath(); q.fill();
    q.strokeStyle = ink(.75); q.lineWidth = 2.2; for (let k = 1; k <= 3; k++) { q.beginPath(); q.arc(28, 28, 20 + k * 18, Math.PI, Math.PI * 1.5); q.stroke(); }
    q.restore();
  }
  q.restore();
}
