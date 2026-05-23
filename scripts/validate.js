const assert = require('assert');
const cp = require('child_process');
const fs = require('fs');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function assertFile(file) {
  fs.accessSync(file);
}

function assertPngIcon(file) {
  const bytes = fs.readFileSync(file);
  assert(bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), `${file} must be a PNG.`);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert(width >= 128 && height >= 128, `${file} must be at least 128x128.`);
}

const manifest = readJson('package.json');

assert.strictEqual(manifest.name, 'goland-go-formatter');
assert.strictEqual(manifest.publisher, 'sagaryadaviitk');
assert.strictEqual(manifest.license, 'MIT');
assert.strictEqual(manifest.icon, 'resources/icon.png');
assert.deepStrictEqual(manifest.extensionKind, ['workspace']);
assert(manifest.repository && manifest.repository.url, 'repository.url is required.');
assert(manifest.bugs && manifest.bugs.url, 'bugs.url is required.');
assert(manifest.galleryBanner && /^#[0-9a-fA-F]{6}$/.test(manifest.galleryBanner.color), 'galleryBanner.color is required.');
assert(['dark', 'light'].includes(manifest.galleryBanner.theme), 'galleryBanner.theme is required.');
assert(Array.isArray(manifest.keywords) && manifest.keywords.length <= 30, 'Marketplace allows at most 30 keywords.');
assert(manifest.capabilities && manifest.capabilities.untrustedWorkspaces.supported === false, 'untrusted workspace support must be declared.');
assert(manifest.capabilities && manifest.capabilities.virtualWorkspaces === false, 'virtual workspace support must be declared.');
assert.strictEqual(Object.prototype.hasOwnProperty.call(manifest, 'files'), false, 'Use .vscodeignore instead of package.json files.');

for (const file of ['README.md', 'CHANGELOG.md', 'LICENSE', 'SUPPORT.md', '.vscodeignore', 'resources/icon.png', 'extension.js']) {
  assertFile(file);
}

assertPngIcon(manifest.icon);
cp.execFileSync(process.execPath, ['-c', 'extension.js'], { stdio: 'inherit' });

console.log('ok');
