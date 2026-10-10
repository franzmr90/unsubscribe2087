/* Zip the home-network package: the server, the game page, and the launchers.
   node tools/pack-lan.js [out.zip] */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const out = process.argv[2] || path.join('/opt/cursor/artifacts', 'unsubscribe-2087-lan.zip');
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'u2087-lan-pack-'));
const dest = path.join(stage, 'unsubscribe-2087-lan');

function copyFile(src, rel, mode) {
  const to = path.join(dest, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(src, to);
  if (mode) fs.chmodSync(to, mode);
}
function copyDir(src, rel) {
  fs.cpSync(src, path.join(dest, rel), { recursive: true });
}

copyDir(path.join(root, 'server', 'lib'), 'server/lib');
copyDir(path.join(root, 'server', 'public'), 'server/public');
copyFile(path.join(root, 'server', 'server.js'), 'server/server.js');
copyFile(path.join(root, 'server', 'admin.js'), 'server/admin.js');
/* The life checks require this. The path is the same one server/lib/plaus.js uses. */
copyFile(path.join(root, 'src', 'formulas.js'), 'src/formulas.js');
copyFile(path.join(root, 'dist', 'unsubscribe.html'), 'dist/unsubscribe.html');
copyFile(path.join(root, 'dist', 'BUILD'), 'dist/BUILD');
copyFile(path.join(root, 'LAN-PLAY.md'), 'LAN-PLAY.md');
copyFile(path.join(root, 'LAN-PLAY.md'), 'README.md');
/* The suites travel with it: the home-network check is the one that cannot run
   anywhere but a machine with a real private address, so it has to be runnable
   wherever the package lands. CHECKS.md says which need Playwright. */
copyDir(path.join(root, 'server', 'test'), 'server/test');
copyFile(path.join(root, 'lan', 'CHECKS.md'), 'CHECKS.md');
copyFile(path.join(root, 'package.json'), 'package.json');
copyFile(path.join(root, 'lan', 'Play-Unsubscribe-2087.sh'), 'Play-Unsubscribe-2087.sh', 0o755);
copyFile(path.join(root, 'lan', 'Play-Unsubscribe-2087.sh'), 'Play-Unsubscribe-2087.command', 0o755);
copyFile(path.join(root, 'lan', 'Play-Unsubscribe-2087.bat'), 'Play-Unsubscribe-2087.bat');

require(path.join(dest, 'server/lib/plaus.js'));

fs.mkdirSync(path.dirname(out), { recursive: true });
if (fs.existsSync(out)) fs.rmSync(out);
const zip = spawnSync('zip', ['-r', '-X', out, 'unsubscribe-2087-lan'], { cwd: stage, encoding: 'utf8' });
if (zip.status !== 0) {
  console.error(zip.stdout, zip.stderr);
  process.exit(zip.status || 1);
}
const hash = crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex');
console.log(out);
console.log(hash);
fs.rmSync(stage, { recursive: true, force: true });
