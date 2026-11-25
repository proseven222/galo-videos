// ═════ ACABAMENTO (marca) + DESPACHO DA HISTÓRIA ═════
const GR2 = [0, 1, 2, 3].map(k => { const [cv, q] = mk(256, 256); const id = q.createImageData(256, 256); const r = R(100 + k); for (let i = 0; i < id.data.length; i += 4) { const v = 128 + (r() - .5) * 150; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } q.putImageData(id, 0, 0); return cv; });
function mapGrid(q) {
  q.save(); q.globalCompositeOperation = 'multiply'; q.strokeStyle = 'rgba(90,58,28,.20)'; q.lineWidth = 1.6; q.setLineDash([14, 10]);
  for (let i = 1; i < 5; i++) { const x = i * 216; q.beginPath(); q.moveTo(x, 70); q.quadraticCurveTo(x + (i - 2.5) * 26, H / 2, x, H - 70); q.stroke(); }
  for (let j = 1; j < 9; j++) { const y = j * 213; q.beginPath(); q.moveTo(70, y); q.quadraticCurveTo(W / 2, y + 30 * (j % 2 ? 1 : -1), W - 70, y); q.stroke(); }
  q.restore();
}
const ST = window.STORY, NF = ST.shots.map(s => Math.round(s.sec * FPS)), CUTS = [0]; NF.forEach((n, i) => CUTS.push(CUTS[i] + n));
function drawShot(i, lf) {
  const s = ST.shots[i], n = NF[i], u = lf / n, hook = i === 0 && s.hook !== false, cam = camera(s.cam || 'push', u);
  let sc = cam.s, dx = 0, dy = cam.y;
  if (hook) { sc *= 1 + .5 * (1 - eOut(lf / 22)); const sh = Math.exp(-lf / 6) * 26; dx = Math.sin(lf * 2.3) * sh; dy += Math.cos(lf * 1.9) * sh; }
  g.save(); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.translate(540 + dx, cam.py + dy); g.rotate(cam.rot); g.scale(sc, sc); g.translate(-540, -cam.py);
  const p = Object.assign({}, s.p || {}); if (ST.seed && !p.seed) p.seed = ST.seed + i * 7;
  (TPL[s.tpl] || T_landscape)(p, lf, n, cam.x);
  g.restore();
  for (const pp of (s.pop || [])) {
    const k = (lf - (pp.t0 || 0) * n) / 11; if (k <= 0 || (pp.t1 != null && u >= pp.t1)) continue;
    const kk = clamp(k), ov = eOut(kk) + .2 * Math.sin(kk * Math.PI), x = pp.x != null ? pp.x * W : 540, y = pp.y != null ? pp.y * H : 900, r = pp.r || 290;
    g.save(); g.translate(x, y); g.scale(ov, ov); g.fillStyle = 'rgba(232,212,162,.95)'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.strokeStyle = '#1b0f06'; g.lineWidth = 10; g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, r - 28, 0, 7); g.stroke(); icon(g, pp.n, 0, 0, pp.s || 1.8, lf); g.restore();
    if (k < 1.6) { g.save(); g.strokeStyle = `rgba(255,240,200,${.9 * (1 - k / 1.6)})`; g.lineWidth = 12; g.beginPath(); g.arc(x, y, r + 260 * (k / 1.6), 0, 7); g.stroke(); g.restore(); }
  }
  if (hook) {
    const k = lf / 26;
    if (k < 1) { g.save(); g.strokeStyle = `rgba(255,240,200,${.9 * (1 - k)})`; g.lineWidth = 16 * (1 - k) + 3; g.beginPath(); g.arc(540, 860, 100 + 950 * eOut(k), 0, 7); g.stroke(); g.restore(); }
    if (lf < 18) { g.save(); const a = .55 * (1 - lf / 18); g.strokeStyle = `rgba(255,236,190,${a})`; for (let l = 0; l < 44; l++) { const an = l / 44 * 6.283 + Math.sin(l * 3.1) * .05, r1 = 380 + (l % 3) * 90 + lf * 40, r2 = r1 + 520; g.lineWidth = 3 + (l % 4) * 2; g.beginPath(); g.moveTo(540 + Math.cos(an) * r1, 860 + Math.sin(an) * r1); g.lineTo(540 + Math.cos(an) * r2, 860 + Math.sin(an) * r2); g.stroke(); } g.restore(); }
    if (s.slam) { const kk = clamp(lf / 12), ov = kk < 1 ? 1 + .35 * Math.sin(kk * Math.PI) * (1 - kk) * 2 : 1, sz = (kk <= 0 ? 0 : (8 - 6.2 * eOut(kk)) * (kk >= 1 ? 1 : 1)) , pulse = 1 + .03 * Math.sin(lf * .25);
      { const S = kk < 1 ? 2.6 - .8 * eOut(kk) : 1.8 * pulse; g.save(); g.fillStyle = 'rgba(232,212,162,.94)'; g.beginPath(); g.arc(540, 860, 300 * (S / 1.8 > 2 ? 2 : Math.max(1, S / 1.8)) * (kk < 1 ? 1 : 1), 0, 7); g.fill(); g.strokeStyle = '#1b0f06'; g.lineWidth = 10; g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(540, 860, 272, 0, 7); g.stroke(); icon(g, s.slam, 540, 860, S, lf); g.restore(); } }
    g.fillStyle = `rgba(255,248,225,${.12 * Math.exp(-lf / 3.5)})`; g.fillRect(0, 0, W, H);
  }
}
function finish(i, lf) {
  const t = (CUTS[i] + lf) / FPS, s = ST.shots[i];
  mg.save(); mg.globalCompositeOperation = 'source-over'; mg.fillStyle = '#000'; mg.fillRect(0, 0, W, H);
  mg.filter = 'url(#ink)'; mg.drawImage(off, 0, 0); mg.filter = 'none';
  mg.globalCompositeOperation = 'multiply'; mg.drawImage(PARCH, -60, -80);
  mg.globalCompositeOperation = 'lighten'; mg.fillStyle = '#2b190b'; mg.fillRect(0, 0, W, H);
  mg.restore();
  mapGrid(mg);
  const comp = s.compass != null ? s.compass : (i === 0 ? 0 : (i % 2 ? 1 : 0));
  if (comp) { mg.save(); mg.globalAlpha = .95; drawCompass(mg, 215, 345, 135, t * .1); mg.restore(); }
  mg.save(); mg.globalCompositeOperation = 'multiply'; mg.fillStyle = 'rgba(214,168,104,.30)'; mg.fillRect(0, 0, W, H); mg.restore();
  mg.save(); mg.globalCompositeOperation = 'overlay'; mg.globalAlpha = .26; const pat = mg.createPattern(GR2[(window.GF || 0) % 4], 'repeat'); mg.translate(((window.GF || 0) * 53) % 256, ((window.GF || 0) * 97) % 256); mg.fillStyle = pat; mg.fillRect(-256, -256, W + 512, H + 512); mg.restore();
  const v = mg.createRadialGradient(W / 2, H / 2, 420, W / 2, H / 2, 1180); v.addColorStop(0, 'rgba(25,12,4,0)'); v.addColorStop(1, 'rgba(25,12,4,.62)'); mg.fillStyle = v; mg.fillRect(0, 0, W, H);
  drawBorder(mg);
}
window.drawShotAt = function (i, lf) { drawShot(i, lf); finish(i, lf); };
window.drawFrame = function (f) { let i = 0; while (i < NF.length - 1 && f >= CUTS[i + 1]) i++; drawShotAt(i, f - CUTS[i]); };
window.TOTAL = CUTS[CUTS.length - 1]; window.NSHOT = NF.length; window.NFS = NF;
window.READY = true;
