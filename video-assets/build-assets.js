const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/Harun/.gemini/antigravity/scratch/izmir-yol-yardim';
const VA = ROOT + '/video-assets';

const images = {
  s01: VA + '/scene01_wide.jpg',
  s02: VA + '/scene02_emre_sigh.jpg',
  s03: VA + '/scene03_mert_asks.jpg',
  s04: VA + '/scene04_emre_explains.jpg',
  s05: VA + '/scene05_sanayi_queue.jpg',
  s06: VA + '/scene06_dashboard.jpg',
  s07: VA + '/scene07_mert_suggests.jpg',
  s08: VA + '/scene08_mechanic_arrives.jpg',
  s09: VA + '/scene09_mechanic_working.jpg',
  s10: VA + '/scene10_emre_happy.jpg',
  kapida: ROOT + '/images/hero-kapida-tamir-wide.jpg',
  usta: ROOT + '/images/hero-mobil-servis-usta-wide.jpg'
};

const asset = { img: {} };
for (const [k, f] of Object.entries(images)) {
  if (!fs.existsSync(f)) { console.error('MISSING IMAGE', k, f); process.exit(1); }
  const ext = path.extname(f).toLowerCase() === '.png' ? 'png' : 'jpeg';
  asset.img[k] = `data:image/${ext};base64,` + fs.readFileSync(f).toString('base64');
}

// Master audio track
const masterWav = VA + '/master-soundtrack.wav';
asset.soundtrack = fs.readFileSync(masterWav).toString('base64');

fs.writeFileSync(VA + '/assets.js', 'window.ASSETS = ' + JSON.stringify(asset) + ';');
console.log('assets.js written successfully:', (fs.statSync(VA + '/assets.js').size / 1048576).toFixed(1) + ' MB');
