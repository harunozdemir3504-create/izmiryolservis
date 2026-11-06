// Builds video-assets/assets.js : embeds scene images (data URIs) + processed voice PCM + timing metadata
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

function readWav(file) {
  const b = fs.readFileSync(file);
  const sr = b.readUInt32LE(24);
  let off = 12, dataOff = 0, dataLen = 0;
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4); const len = b.readUInt32LE(off + 4);
    if (id === 'data') { dataOff = off + 8; dataLen = len; break; }
    off += 8 + len;
  }
  const n = dataLen / 2;
  const s = new Float32Array(n);
  for (let i = 0; i < n; i++) s[i] = b.readInt16LE(dataOff + i * 2) / 32768;
  return { sr, s };
}

function processVoice(file) {
  const { sr, s } = readWav(file);
  const win = Math.round(sr * 0.01);
  const env = [];
  for (let i = 0; i + win <= s.length; i += win) {
    let a = 0; for (let j = 0; j < win; j++) a += s[i + j] * s[i + j];
    env.push(Math.sqrt(a / win));
  }
  const peak = Math.max(...env);
  const thr = peak * 0.05;
  const segs = []; let cur = null, sil = 0;
  env.forEach((v, k) => {
    if (v > thr) { if (!cur) cur = { s: k, e: k + 1 }; cur.e = k + 1; sil = 0; }
    else if (cur) { sil++; if (sil >= 13) { segs.push(cur); cur = null; sil = 0; } }
  });
  if (cur) segs.push(cur);

  // Rebuild: keep each segment with padding, compress gaps between segments to max 0.26s
  const PADS = 0.04, PADE = 0.09, MAXGAP = 0.26;
  const pieces = []; const newSegs = []; let t = 0; let total = [];
  segs.forEach((sg, idx) => {
    const a = Math.max(0, Math.round((sg.s * 0.01 - PADS) * sr));
    const bEnd = Math.min(s.length, Math.round((sg.e * 0.01 + PADE) * sr));
    if (idx > 0) {
      const prev = segs[idx - 1];
      const gap = (sg.s - prev.e) * 0.01 - PADS - PADE;
      const g = Math.max(0, Math.min(gap, MAXGAP));
      const gs = Math.round(g * sr);
      total.push(new Float32Array(gs)); t += gs;
    }
    const chunk = s.slice(a, bEnd);
    // tiny fades to avoid clicks
    const f = Math.min(80, chunk.length >> 2);
    for (let i = 0; i < f; i++) { chunk[i] *= i / f; chunk[chunk.length - 1 - i] *= i / f; }
    newSegs.push([+((t + (sg.s * 0.01 - a / sr) * sr) / sr).toFixed(3), +((t + (sg.e * 0.01 - a / sr) * sr) / sr).toFixed(3)]);
    total.push(chunk); t += chunk.length;
  });
  const out = new Int16Array(t); let o = 0;
  // normalize to -1.5 dBFS peak
  let pk = 0; total.forEach(c => c.forEach(v => { if (Math.abs(v) > pk) pk = Math.abs(v); }));
  const gain = pk > 0 ? 0.84 / pk : 1;
  total.forEach(c => { for (let i = 0; i < c.length; i++) out[o++] = Math.max(-32767, Math.min(32767, Math.round(c[i] * gain * 32767))); });
  return { sr, dur: +(t / sr).toFixed(3), segs: newSegs, b64: Buffer.from(out.buffer).toString('base64') };
}

const asset = { img: {}, voice: {} };
for (const [k, f] of Object.entries(images)) {
  if (!fs.existsSync(f)) { console.error('MISSING IMAGE', k, f); process.exit(1); }
  const ext = path.extname(f).toLowerCase() === '.png' ? 'png' : 'jpeg';
  asset.img[k] = `data:image/${ext};base64,` + fs.readFileSync(f).toString('base64');
}
const vdir = VA + '/voice';
for (const f of fs.readdirSync(vdir).filter(f => f.endsWith('.wav'))) {
  const id = f.replace('.wav', '');
  asset.voice[id] = processVoice(path.join(vdir, f));
  console.log(id, asset.voice[id].dur + 's', JSON.stringify(asset.voice[id].segs));
}
fs.writeFileSync(VA + '/assets.js', 'window.ASSETS = ' + JSON.stringify(asset) + ';');
console.log('assets.js written', (fs.statSync(VA + '/assets.js').size / 1048576).toFixed(1) + ' MB');
