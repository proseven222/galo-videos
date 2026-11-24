// ═════ MAPA · INTERIOR · GRANDE PLANO · TÚNEL · CÂMARA · GANCHO ═════
const LAND = {
  europe: [[.08,.55],[.10,.40],[.18,.30],[.30,.26],[.40,.14],[.52,.10],[.66,.16],[.78,.12],[.92,.22],[.96,.40],[.86,.50],[.80,.62],[.66,.70],[.58,.80],[.50,.74],[.42,.86],[.30,.80],[.24,.68],[.14,.70]],
  iberia: [[.18,.30],[.55,.22],[.82,.32],[.78,.55],[.62,.78],[.40,.82],[.22,.70],[.12,.50]],
  africa: [[.10,.20],[.40,.12],[.62,.18],[.74,.34],[.92,.40],[.80,.60],[.66,.78],[.58,.94],[.44,.90],[.34,.68],[.18,.54],[.06,.38]],
  island: [[.20,.40],[.34,.22],[.58,.20],[.78,.34],[.84,.56],[.64,.76],[.40,.80],[.24,.64]],
  america: [[.34,.08],[.62,.14],[.78,.30],[.70,.48],[.58,.58],[.66,.72],[.56,.92],[.44,.86],[.40,.64],[.28,.50],[.22,.30]],
  asia: [[.06,.30],[.30,.12],[.60,.10],[.92,.24],[.96,.52],[.80,.70],[.60,.64],[.46,.82],[.34,.62],[.14,.56]],
};
function landPoly(q, name, x, y, w, h, seed) { const P = LAND[name] || LAND.island, r = R(seed); q.beginPath(); P.forEach(([a, b], i) => { const px = x + a * w + (r() - .5) * 14, py = y + b * h + (r() - .5) * 14; i ? q.lineTo(px, py) : q.moveTo(px, py); }); q.closePath(); }
function T_map(p, f, n, cx) {
  const u = f / n, sd = p.seed || 4; vgrad(g, -700, H + 700, [[0, '#ece0b8'], [1, '#e2d2a2']], -600, W + 1200);
  g.save(); g.strokeStyle = 'rgba(80,60,30,.35)'; g.lineWidth = 2; g.setLineDash([10, 12]); for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-200 - cx * .3, 200 + i * 220); g.quadraticCurveTo(540, 160 + i * 220 + (i % 2 ? 60 : -60), 1300 - cx * .3, 200 + i * 220); g.stroke(); } g.restore();
  for (const [i, L] of (p.land || [{ n: 'island' }]).entries()) { const x = L.x * W - cx * .5, y = L.y * H, w = L.w * W, h = (L.h || L.w * 1.2) * W; landPoly(g, L.n, x, y, w, h, sd + i * 3); g.fillStyle = L.dark ? '#7a6238' : '#b49c62'; g.fill(); g.strokeStyle = '#1b0f06'; g.lineWidth = 7; g.lineJoin = 'round'; g.stroke(); g.save(); g.clip(); g.strokeStyle = 'rgba(40,26,10,.35)'; g.lineWidth = 2; for (let k = 0; k < 24; k++) { g.beginPath(); g.moveTo(x - 50, y + k * h / 20); g.lineTo(x + w + 50, y + k * h / 20 - 60); g.stroke(); } g.restore(); }
  for (const w of (p.waves || [])) { g.strokeStyle = '#5a4020'; g.lineWidth = 3; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(w[0] * W + k * 40 - cx * .5, w[1] * H + Math.sin(f * .05 + k) * 4); g.quadraticCurveTo(w[0] * W + k * 40 + 10 - cx * .5, w[1] * H - 12, w[0] * W + k * 40 + 20 - cx * .5, w[1] * H); g.stroke(); } }
  // rotas
  for (const rt of (p.routes || [])) {
    const pts = rt.pts.map(([a, b]) => [a * W - cx * .5, b * H]), seg = pts.length - 1, prog = clamp((u - (rt.t0 || 0)) / (rt.dur || .7)), tot = prog * seg;
    g.save(); g.strokeStyle = rt.col || '#7a2a18'; g.lineWidth = 9; g.setLineDash([22, 16]); g.lineDashOffset = -f * .6; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    let hx = pts[0][0], hy = pts[0][1], ha = 0;
    for (let i = 0; i < seg; i++) { const k = clamp(tot - i); if (k <= 0) break; const ax = pts[i][0], ay = pts[i][1], bx = pts[i + 1][0], by = pts[i + 1][1], mx = (ax + bx) / 2 + (ay - by) * .2, my = (ay + by) / 2 + (bx - ax) * .2; const qx = (1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mx + k * k * (ax + (bx - ax) * 1), qy = (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * my + k * k * by; const ex = (1 - k) * ax + k * bx, ey = (1 - k) * ay + k * by; g.quadraticCurveTo(lerp(ax, mx, k), lerp(ay, my, k), qx * 0 + (1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mx + k * k * bx, (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * my + k * k * by); hx = (1 - k) * (1 - k) * ax + 2 * (1 - k) * k * mx + k * k * bx; hy = (1 - k) * (1 - k) * ay + 2 * (1 - k) * k * my + k * k * by; ha = Math.atan2(by - ay, bx - ax); }
    g.stroke(); g.restore();
    if (rt.icon) icon(g, rt.icon, hx, hy - 20, .8, f, ha * .0);
    else { g.fillStyle = '#7a2a18'; g.save(); g.translate(hx, hy); g.rotate(ha); g.beginPath(); g.moveTo(26, 0); g.lineTo(-14, -18); g.lineTo(-14, 18); g.closePath(); g.fill(); g.restore(); }
  }
  for (const [i, pn] of (p.pins || []).entries()) { const k = eOut((u - (pn[2] || 0) - i * .03) * 6); if (k <= 0) continue; const x = pn[0] * W - cx * .5, y = pn[1] * H; g.save(); g.translate(x, y); g.scale(k * 1.3, k * 1.3); g.fillStyle = '#7a2a18'; g.strokeStyle = '#1b0f06'; g.lineWidth = 4; g.beginPath(); g.arc(0, -40, 22, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-14, -28); g.lineTo(0, 0); g.lineTo(14, -28); g.fill(); g.fillStyle = '#e8d4a2'; g.beginPath(); g.arc(0, -40, 7, 0, 7); g.fill(); g.restore(); }
  for (const d of (p.dots || [])) { const cxx = d.x * W - cx * .5, cyy = d.y * H, R0 = d.r * W * eOut(u * (d.sp || 1.2)); const r = R(sd + 9); for (let i = 0; i < (d.n || 60); i++) { const a = r() * 6.283, rr = Math.sqrt(r()) * R0; g.fillStyle = d.col || '#7a2a18'; g.beginPath(); g.arc(cxx + Math.cos(a) * rr, cyy + Math.sin(a) * rr, 5 + r() * 5, 0, 7); g.fill(); } g.strokeStyle = 'rgba(122,42,24,.5)'; g.lineWidth = 4; g.beginPath(); g.arc(cxx, cyy, R0, 0, 7); g.stroke(); }
  for (const ic of (p.icons || [])) icon(g, ic.n, ic.x * W - cx * .5, ic.y * H + Math.sin(f * .05) * 6, ic.s || 1, f);
  motes(g, f, 3, 30, cx, .5, 'rgba(120,90,50,A)');
}
// ── interior ──
function T_interior(p, f, n, cx) {
  const k = p.kind || 'council', sd = p.seed || 6, tod = p.tod || 'night', dim = tod === 'day' ? 1 : .6, hz = 1020;
  vgrad(g, -700, hz, [[0, mulc('#3a2a1a', dim)], [1, mulc('#8a6a40', dim)]], -600, W + 1200);
  // parede: pedra ou arcos
  g.fillStyle = mulc('#2a1e12', dim); for (let i = -1; i < 4; i++) { const x = 130 + i * 420 - cx * .4; g.beginPath(); g.moveTo(x, hz); g.lineTo(x, 560); g.arc(x + 130, 560, 130, Math.PI, 0); g.lineTo(x + 260, hz); g.closePath(); g.fill(); }
  g.fillStyle = mulc('#120c06', dim); for (let i = -1; i < 4; i++) { const x = 130 + i * 420 - cx * .4; g.beginPath(); g.moveTo(x + 40, hz); g.lineTo(x + 40, 580); g.arc(x + 130, 580, 90, Math.PI, 0); g.lineTo(x + 220, hz); g.closePath(); g.fill(); }
  if (p.window !== 0) for (let i = 0; i < 2; i++) { const x = 300 + i * 480 - cx * .5; g.fillStyle = tod === 'day' ? '#fff0c0' : '#3a5a8a'; g.beginPath(); g.moveTo(x, 760); g.lineTo(x, 380); g.arc(x + 90, 380, 90, Math.PI, 0); g.lineTo(x + 180, 760); g.fill(); g.fillStyle = '#0b0805'; g.fillRect(x + 86, 290, 8, 470); g.fillRect(x, 560, 180, 8); if (p.shaft) { g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(x, 400, x + 300, H); gr.addColorStop(0, 'rgba(255,230,160,.5)'); gr.addColorStop(1, 'rgba(255,230,160,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 400); g.lineTo(x + 180, 400); g.lineTo(x + 560, H); g.lineTo(x + 220, H); g.fill(); g.restore(); } if (p.lightning && f % 60 < 6) { g.fillStyle = 'rgba(230,240,255,.5)'; g.fillRect(x, 380, 180, 380); } }
  if (k === 'archive') for (let r2 = 0; r2 < 5; r2++) { g.fillStyle = '#0d0905'; g.fillRect(-200 - cx * .5, 380 + r2 * 120, W + 400, 12); const rr = R(sd + r2); for (let i = 0; i < 40; i++) { g.fillStyle = `rgb(${50 + rr() * 60},${30 + rr() * 30},${14 + rr() * 16})`; g.fillRect(-200 + i * 36 - cx * .5, 380 + r2 * 120 - 80 + rr() * 20, 24 + rr() * 8, 80 - rr() * 20 + 0); } }
  if (k === 'monastery' || k === 'church') { for (const x of [150, 540, 930]) bigCandle(g, x - cx * .6, 780, f, x); }
  // piso
  vgrad(g, hz, H + 600, [[0, mulc('#6a4a28', dim)], [1, mulc('#140c06', dim)]], -600, W + 1200);
  g.save(); g.strokeStyle = 'rgba(10,6,2,.55)'; g.lineWidth = 3; for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(540 + i * 30 - cx * .3, hz); g.lineTo(540 + i * 220 - cx * 1.2, H + 80); g.stroke(); } for (let j = 1; j < 9; j++) { const y = hz + Math.pow(j / 9, 1.9) * (H - hz); g.beginPath(); g.moveTo(-100, y); g.lineTo(W + 100, y); g.stroke(); } g.restore();
  // trono / forno / etc.
  if (k === 'court') { icon(g, 'throne', 540 - cx * .7, 800, 3.4, f); for (const x of [-1, 1]) bannerP(g, 540 + x * 380 - cx * .7, 1000, 520, f, '#6a3a1c', x, 1); }
  if (k === 'workshop') { icon(g, p.big || 'bread', 540 - cx * .7, 840, 3.6, f); }
  if (k === 'tavern') { for (const x of [100, 960]) { g.fillStyle = '#0d0905'; g.beginPath(); g.ellipse(x - cx * .8, 1040, 90, 120, 0, 0, 7); g.fill(); g.strokeStyle = '#3a2a16'; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 86 - cx * .8, 1000); g.lineTo(x + 86 - cx * .8, 1000); g.stroke(); } }
  if (k === 'hall') for (const x of [-1, 1]) for (let j = 0; j < 3; j++) { const xx = 540 + x * (300 + j * 90), s = 1 - j * .25; g.fillStyle = mulc('#1a1208', dim); g.fillRect(xx - 24 * s - cx * (1 - j * .2), 300 + j * 140, 48 * s, hz - 300 - j * 140); }
  glow(g, 540, 1000, 900, '255,196,110', tod === 'day' ? .15 : .35, 'lighter');
  // figuras + mesa
  const tbl = p.table !== 0 && k !== 'hall', ty = p.ty || 1440;
  for (const a of (p.actors || [])) crowd(g, f, Object.assign({ x0: 540, spread: 700, h: 560, y: ty - 80, camx: cx, fac: 1.1, seed: sd + 1 }, a));
  if (tbl) { g.fillStyle = '#0c0804'; g.beginPath(); g.moveTo(-200 - cx * 1.2, ty); g.lineTo(W + 200 - cx * 1.2, ty); g.lineTo(W + 360 - cx * 1.2, H + 100); g.lineTo(-360 - cx * 1.2, H + 100); g.closePath(); g.fill(); g.fillStyle = '#3a2812'; g.fillRect(-200 - cx * 1.2, ty - 10, W + 400, 18); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-300, ty + 18, W + 600, 14); }
  for (const it of (p.items || [])) icon(g, it.n, it.x * W - cx * 1.2, ty - 20 - (it.up || 0), it.s || .9, f, it.rot);
  if (p.fore) for (const a of p.fore) crowd(g, f, Object.assign({ x0: 540, spread: 900, h: 1000, y: H + 260, camx: cx, fac: 1.5, seed: sd + 5, col: '#000' }, a));
  if (p.rain) { const q = g; q.save(); q.globalAlpha = .0; q.restore(); }
  if (p.smoke !== 0) fog(g, FOG_D, 520, 700, f, 1.1, .22, cx, .5, 1.5);
  embers(g, f, 12, 22, 540, 1300, 800, 900, '255,190,90'); motes(g, f * 1.2, 9, 40, cx, .9, 'rgba(255,225,150,A)');
}
function bigCandle(q, x, y, f, s) { const fl = Math.sin(f * .31 + s) * 3; glow(q, x, y - 60, 260, '255,196,110', .9, 'lighter'); q.fillStyle = '#e8d4a2'; q.fillRect(x - 14, y - 40, 28, 140); q.fillStyle = '#ffd88a'; q.beginPath(); q.moveTo(x, y - 100 + fl); q.quadraticCurveTo(x + 14, y - 70, x, y - 46); q.quadraticCurveTo(x - 14, y - 70, x, y - 100 + fl); q.fill(); }
// ── grande plano (ícone) ──
function T_closeup(p, f, n, cx) {
  const u = f / n, T = TOD[p.tod || 'dusk'], sd = p.seed || 3;
  vgrad(g, -700, H + 700, [[0, mulc(p.bg || '#2a1a10', 1)], [.5, '#6a4a28'], [1, '#2a1a10']], -600, W + 1200);
  glow(g, 540, 860, 1000, p.glowc || '255,214,130', .75, 'lighter');
  g.save(); g.translate(540, 860); for (let i = 0; i < 30; i++) { const a = i / 30 * 6.283 + f * .004; g.fillStyle = `rgba(255,230,160,${.07 + .05 * (i % 2)})`; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 1500, Math.sin(a) * 1500); g.lineTo(Math.cos(a + .08) * 1500, Math.sin(a + .08) * 1500); g.closePath(); g.fill(); } g.restore();
  for (let i = 0; i < 3; i++) { const k = ((u * 1.3 + i / 3) % 1); g.strokeStyle = `rgba(255,226,150,${.5 * (1 - k)})`; g.lineWidth = 6; g.beginPath(); g.arc(540, 860, 120 + k * 700, 0, 7); g.stroke(); }
  g.fillStyle = 'rgba(232,212,162,.9)'; g.beginPath(); g.arc(540, 860, 390, 0, 7); g.fill(); g.strokeStyle = '#1b0f06'; g.lineWidth = 10; g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(540, 860, 360, 0, 7); g.stroke();
  const ics = p.icons || [{ n: p.icon || 'scroll', x: 0, y: 0, s: 3 }];
  for (const [i, ic] of ics.entries()) { const kk = eOut((u * n / 30 - i * .15) * 3), sc = (ic.s || 3) * (.4 + .6 * kk) * (1 + .03 * Math.sin(f * .08 + i)); icon(g, ic.n, 540 + (ic.x || 0) * 300, 860 + (ic.y || 0) * 300 + Math.sin(f * .05 + i) * 6, sc, f, (ic.rot || 0) + Math.sin(f * .03 + i) * .04); }
  for (const [i, s] of (p.orbit || []).entries()) { const a = f * .02 + i / (p.orbit.length) * 6.283; icon(g, s, 540 + Math.cos(a) * 520, 860 + Math.sin(a) * 300 * 1.5, 1, f); }
  if (p.below) for (const a of p.below) crowd(g, f, Object.assign({ x0: 540, spread: 900, h: 420, y: H + 40, seed: sd, camx: cx, fac: 1.2 }, a));
  embers(g, f, 21, 28, 540, 1500, 900, 1100, '255,190,90'); motes(g, f * 1.4, 9, 40, cx, .7, 'rgba(255,235,170,A)');
}
// ── túnel ──
function tunnelArch(q, cx, fy, w, h) { q.moveTo(cx - w / 2, fy); q.lineTo(cx - w / 2, fy - h + w / 2); q.arc(cx, fy - h + w / 2, w / 2, Math.PI, 0); q.lineTo(cx + w / 2, fy); q.closePath(); }
function T_tunnel(p, f, n, cx) {
  const u = f / n, t = f / 30, cxx = 540 + Math.sin(t * .5) * 26 - cx * .2, cy = 880; vgrad(g, 0, H, [[0, '#050603'], [1, '#0a0b05']], -600, W + 1200);
  const open = p.open != null ? eIO(clamp((u - p.open) / (1 - p.open))) : 0, N = 26, zoff = (f * .02 * (1.2 + 2.4 * eIn(u))) % 1;
  glow(g, cxx, cy + 60, 380 + 560 * open, '255,235,170', .12 + .88 * open, 'lighter');
  for (let i = N; i >= 0; i--) { const z = i + 1 - zoff, s = 1 / (z * .24 + .04), fade = clamp(1 - z / 24), w = 520 * s, h = 640 * s, fy = cy + 250 * s, lit = clamp(1.25 - z * .09) * (.8 + .2 * Math.sin(f * .31 + i)); g.beginPath(); tunnelArch(g, cxx, fy, w, h); tunnelArch(g, cxx, fy, w * .78, h * .8); const br = Math.floor(14 + 70 * lit); g.fillStyle = `rgb(${br},${Math.floor(br * .8)},${Math.floor(br * .45)})`; g.fill('evenodd'); g.fillStyle = `rgba(${Math.floor(30 + 90 * lit)},${Math.floor(26 + 70 * lit)},${Math.floor(10 + 25 * lit)},${.55 * fade})`; g.fillRect(cxx - w / 2, fy - 4 * s, w, 8 * s); }
  const ex = 520 + Math.sin(t * .8) * 10, ey = 1700 + Math.sin(t * 8) * 3, ls = 1 + .2 * u, lanY = ey - 330 * ls + Math.sin(t * 5) * 6;
  glow(g, ex + 120 * ls, lanY, 860 * ls, '255,196,100', .95, 'lighter'); fig(g, p.who || 'scholar', ex, ey, 640 * ls, { walk: 1, ph: t * 4, dir: 1, prop: 'lantern' });
  fog(g, FOG_W, 700, 560, f, .9, .18 + .14 * (1 - open), cx, .2, 1.4); motes(g, f * 1.4, 71, 70, cx, .3, 'rgba(255,225,150,A)');
}
const TPL = { landscape: T_landscape, sea: T_sea, map: T_map, interior: T_interior, closeup: T_closeup, tunnel: T_tunnel };
// ── câmara ──
function camera(type, u, hook) {
  const e = eIO(u); let s = 1.12, x = 0, y = 0, rot = 0, px = 540, py = 1100;
  switch (type) {
    case 'push': s = lerp(1.04, 1.30, e); py = 1000; break;
    case 'pull': s = lerp(1.32, 1.06, e); py = 1000; break;
    case 'panL': s = 1.14; x = lerp(160, -160, e); break;
    case 'panR': s = 1.14; x = lerp(-160, 160, e); break;
    case 'tiltUp': s = 1.16; y = lerp(-190, 170, e); break;
    case 'tiltDown': s = 1.16; y = lerp(170, -190, e); break;
    case 'orbit': s = lerp(1.10, 1.26, e); x = lerp(-130, 130, e); rot = lerp(-.025, .025, e); break;
    default: s = 1.1 + .02 * Math.sin(u * 3); x = Math.sin(u * 4) * 60;
  }
  return { s, x, y, rot, px, py };
}
