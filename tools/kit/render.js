const { chromium } = require('playwright'); const { spawn } = require('child_process');
(async () => {
  const [html, a, b_, out] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5]];
  const ff = spawn('ffmpeg', ['-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','17','-pix_fmt','yuv420p', out], { stdio: ['pipe','ignore','inherit'] });
  const b = await chromium.launch({ args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('file://' + html); await p.waitForFunction('window.READY===true');
  const t0 = Date.now();
  for (let f = a; f < b_; f++) { await p.evaluate(f => { window.GF = f; window.drawFrame(f); }, f); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (f % 60 === 0) console.log('frame', f, ((Date.now() - t0) / 1000).toFixed(1) + 's'); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', ((Date.now() - t0) / 1000).toFixed(1) + 's');
})();
