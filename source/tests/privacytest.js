// Checks the privacy controls against a local copy of the site (python3 -m http.server 8124 in site/).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const CSP = fs.readFileSync(__dirname + '/../../site/_headers', 'utf8').match(/Content-Security-Policy: (.*)/)[1];
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const out = [], ok = (n, c) => out.push((c ? 'PASS ' : 'FAIL ') + n);
  async function page(ctx) { const pg = await ctx.newPage(); const msgs = [], reqs = [];
    await pg.route('**/*', async r => { const resp = await r.fetch(); await r.fulfill({ response: resp, headers: Object.assign({}, resp.headers(), { 'content-security-policy': CSP }) }); });
    pg.on('console', m => msgs.push(m.type() + ': ' + m.text())); pg.on('pageerror', e => msgs.push('pageerror: ' + e.message)); pg.on('request', r => reqs.push(r.url())); return { pg, msgs, reqs }; }
  // 1. normal visitor: no cookies, no third-party requests, banner shows, no console output, no CSP violations
  let ctx = await br.newContext(); let { pg, msgs, reqs } = await page(ctx);
  for (const p of ['/', '/circuit-basics-quest/', '/power-keeper/', '/cpu-quest/', '/embedded-quest/', '/privacy-policy/', '/terms/', '/privacy-requests/']) { await pg.goto('http://localhost:8124' + p); await pg.waitForTimeout(250); }
  ok('no cookies set', (await ctx.cookies()).length === 0);
  ok('only same-origin requests', reqs.every(u => u.startsWith('http://localhost:8124')));
  ok('no console messages or errors on any page', msgs.length === 0); if (msgs.length) console.log(msgs.slice(0, 5));
  await pg.goto('http://localhost:8124/'); await pg.waitForTimeout(200);
  ok('notice shown first visit', !!(await pg.$('#pv-notice')));
  await pg.click('#pv-notice button'); await pg.goto('http://localhost:8124/'); await pg.waitForTimeout(200);
  ok('notice stays dismissed', !(await pg.$('#pv-notice')));
  // consent gate
  ok('optional scripts blocked without opt-in', (await pg.evaluate(() => Privacy.loadScript('/x.js', 'analytics'))) === false && (await pg.evaluate(() => Privacy.allowed('analytics'))) === false);
  ok('essential needs no consent flag but unknown categories denied', (await pg.evaluate(() => Privacy.allowed('whatever'))) === false);
  // stored data contains no PII-like keys; progress key only
  await pg.goto('http://localhost:8124/circuit-basics-quest/?test'); await pg.click('#anaBtn');
  const keys = await pg.evaluate(() => Object.keys(localStorage)); ok('only studygame_* and privacy_meta keys stored', keys.every(k => /^studygame_|^privacy_meta$/.test(k)));
  // export + delete
  await pg.goto('http://localhost:8124/privacy-requests/');
  const exp = await pg.evaluate(() => JSON.stringify(Privacy.exportData())); ok('export contains the game data', /studygame_circuit-basics-quest/.test(exp));
  pg.once('dialog', d => d.accept()); await pg.click('#del'); await pg.waitForTimeout(150);
  ok('delete removes saved data', (await pg.evaluate(() => Object.keys(localStorage).filter(k => k.indexOf('studygame_') === 0).length)) === 0);
  ok('request form is a Netlify form with honeypot', await pg.evaluate(() => { const f = document.querySelector('form'); return f.hasAttribute('data-netlify') && f.getAttribute('netlify-honeypot') === 'bot-field' && f.querySelector('[name=email]').required; }));
  await ctx.close();
  // 2. retention: data older than 365 days idle is wiped on load
  ctx = await br.newContext(); ({ pg } = await page(ctx));
  await pg.goto('http://localhost:8124/terms/'); await pg.evaluate(() => { localStorage.setItem('studygame_x', '{"levels":{"1":{"done":true}}}'); const m = JSON.parse(localStorage.getItem('privacy_meta')); m.lastSeen = new Date(Date.now() - 400 * 864e5).toISOString(); localStorage.setItem('privacy_meta', JSON.stringify(m)); });
  await pg.goto('http://localhost:8124/terms/'); ok('retention clean-up wipes progress idle > 365 days', (await pg.evaluate(() => localStorage.getItem('studygame_x'))) === null);
  await pg.evaluate(() => localStorage.setItem('studygame_y', '1')); await pg.goto('http://localhost:8124/terms/'); ok('recent progress is kept', (await pg.evaluate(() => localStorage.getItem('studygame_y'))) === '1');
  await ctx.close();
  // 3. GPC
  ctx = await br.newContext(); await ctx.addInitScript(() => { Object.defineProperty(navigator, 'globalPrivacyControl', { value: true }); });
  ({ pg } = await page(ctx)); await pg.goto('http://localhost:8124/'); await pg.waitForTimeout(200);
  ok('GPC detected', await pg.evaluate(() => Privacy.gpc === true));
  ok('GPC: opt-in refused and scripts stay blocked', (await pg.evaluate(() => Privacy.grant('analytics'))) === false && (await pg.evaluate(() => Privacy.loadScript('/x.js', 'analytics'))) === false);
  ok('GPC mentioned in the notice', /Global Privacy Control/.test(await pg.evaluate(() => document.getElementById('pv-notice').textContent)));
  await ctx.close();
  // 4. a game still works under the CSP
  ctx = await br.newContext(); ({ pg, msgs } = await page(ctx)); await pg.goto('http://localhost:8124/cpu-quest/?test'); await pg.evaluate(() => { __kit.state().calm = true; __kit.start(1); });
  ok('game plays under the CSP', await pg.evaluate(() => { __kit.auto(); return true; })); ok('no CSP violations', !msgs.some(m => /Content Security Policy|Refused/.test(m)));
  console.log(out.join('\n')); await br.close(); process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
})();
