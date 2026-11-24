// uso: node still.js page.html outprefix shot:frac [shot:frac ...]
const { chromium } = require('playwright');
(async () => {
  const [html, out, ...pts] = process.argv.slice(2);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.log('ERR', e.message)); pg.on('console', m => { if (m.type() === 'error') console.log('CERR', m.text()); });
  await pg.goto('file://' + html); await pg.waitForFunction('window.READY', null, { timeout: 30000 });
  for (const s of pts) { const [i, k] = s.split(':'); await pg.evaluate(([i, k]) => { window.GF = 0; const n = window.NFS[i]; window.drawShotAt(+i, Math.min(n - 1, Math.round(n * +k))); }, [i, k]); await pg.screenshot({ path: `${out}_${i}_${k}.jpg`, type: 'jpeg', quality: 80 }); }
  await b.close();
})();
