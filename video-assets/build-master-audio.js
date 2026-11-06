const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/Harun/.gemini/antigravity/scratch/izmir-yol-yardim';
const VA = ROOT + '/video-assets';
const VDIR = VA + '/voice-pro';

function readWav(filePath) {
  const b = fs.readFileSync(filePath);
  const channels = b.readUInt16LE(22);
  const sampleRate = b.readUInt32LE(24);
  let off = 12;
  while (off < b.length) {
    const id = b.toString('ascii', off, off + 4);
    const len = b.readUInt32LE(off + 4);
    if (id === 'data') {
      const numSamples = len / 2;
      const data = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        data[i] = b.readInt16LE(off + 8 + i * 2) / 32768;
      }
      return { sampleRate, channels, data };
    }
    off += 8 + len;
  }
  throw new Error('No data chunk in ' + filePath);
}

// Resample from 16kHz to 48kHz with smooth linear interpolation
function resampleTo48k(data, fromSr, toSr = 48000) {
  const ratio = toSr / fromSr;
  const outLen = Math.round(data.length * ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcPos = i / ratio;
    const idx = Math.floor(srcPos);
    const frac = srcPos - idx;
    const s1 = data[idx] || 0;
    const s2 = data[idx + 1] || s1;
    out[i] = s1 + frac * (s2 - s1);
  }
  return out;
}

// 48kHz timeline
const SR = 48000;
const TIMINGS = [
  { id: 'd1_emre', start: 0.8 },
  { id: 'd2_mert', start: 4.4 },
  { id: 'd3_emre', start: 8.8 },
  { id: 'd4_mert', start: 20.8 },
  { id: 'd5_emre', start: 34.5 }
];

const totalDur = 44.0; // 44 seconds total video
const totalSamples = Math.round(totalDur * SR);
const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Mix voices
TIMINGS.forEach(item => {
  const wav = readWav(path.join(VDIR, item.id + '.wav'));
  const resampled = resampleTo48k(wav.data, wav.sampleRate, SR);
  const startIdx = Math.round(item.start * SR);
  
  // Normalize clip to -1.0 dBFS
  let peak = 0;
  for (let i = 0; i < resampled.length; i++) {
    const a = Math.abs(resampled[i]);
    if (a > peak) peak = a;
  }
  const gain = peak > 0 ? 0.92 / peak : 1;
  const pan = item.id.includes('emre') ? -0.08 : 0.08;
  const panL = 1 - Math.max(0, pan);
  const panR = 1 + Math.min(0, pan);

  for (let i = 0; i < resampled.length; i++) {
    const idx = startIdx + i;
    if (idx < totalSamples) {
      const s = resampled[i] * gain;
      left[idx] += s * panL;
      right[idx] += s * panR;
    }
  }
});

// Sound effects: crisp typewriter/phone clicks during site typing (around 22.8s to 24.5s)
for (let t = 22.8; t < 24.8; t += 0.085) {
  const idx = Math.round(t * SR);
  for (let j = 0; j < 400; j++) {
    const env = (1 - j / 400) * 0.08;
    const sample = (Math.random() * 2 - 1) * env;
    if (idx + j < totalSamples) {
      left[idx + j] += sample;
      right[idx + j] += sample;
    }
  }
}

// Ding at 25.0s (clean sine harmonic chime)
const dingIdx = Math.round(25.0 * SR);
for (let j = 0; j < SR * 0.8; j++) {
  const env = Math.exp(-j / (SR * 0.18)) * 0.15;
  const s = (Math.sin(j * 2 * Math.PI * 1318.5 / SR) + 0.5 * Math.sin(j * 2 * Math.PI * 1975.5 / SR)) * env;
  if (dingIdx + j < totalSamples) {
    left[dingIdx + j] += s;
    right[dingIdx + j] += s;
  }
}

// Master Limiter / Soft Clipper to avoid any distortion
let maxPeak = 0;
for (let i = 0; i < totalSamples; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(left[i]), Math.abs(right[i]));
}
console.log('Peak before normalization:', maxPeak.toFixed(2));
const normGain = maxPeak > 0.98 ? 0.95 / maxPeak : 0.95;

// Write master WAV file (16-bit PCM 48kHz Stereo)
const dataLen = totalSamples * 4;
const wavBuf = Buffer.alloc(44 + dataLen);
wavBuf.write('RIFF', 0);
wavBuf.writeUInt32LE(36 + dataLen, 4);
wavBuf.write('WAVE', 8);
wavBuf.write('fmt ', 12);
wavBuf.writeUInt32LE(16, 16);
wavBuf.writeUInt16LE(1, 20); // PCM
wavBuf.writeUInt16LE(2, 22); // Stereo
wavBuf.writeUInt32LE(SR, 24);
wavBuf.writeUInt32LE(SR * 4, 28); // byte rate
wavBuf.writeUInt16LE(4, 32); // block align
wavBuf.writeUInt16LE(16, 34); // bits per sample
wavBuf.write('data', 36);
wavBuf.writeUInt32LE(dataLen, 40);

let o = 44;
for (let i = 0; i < totalSamples; i++) {
  const l = Math.max(-32767, Math.min(32767, Math.round(left[i] * normGain * 32767)));
  const r = Math.max(-32767, Math.min(32767, Math.round(right[i] * normGain * 32767)));
  wavBuf.writeInt16LE(l, o);
  wavBuf.writeInt16LE(r, o + 2);
  o += 4;
}

const outWav = path.join(VA, 'master-soundtrack.wav');
fs.writeFileSync(outWav, wavBuf);
console.log('Master WAV written successfully:', outWav, (wavBuf.length / 1024 / 1024).toFixed(2), 'MB');
