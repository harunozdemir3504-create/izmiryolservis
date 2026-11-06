const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/Harun/.gemini/antigravity/scratch/izmir-yol-yardim';
const VA = ROOT + '/video-assets';
const VDIR = VA + '/voice-deep';

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

// Biquad Low-Shelf Filter for deep chest resonance
function makeLowShelf(sr, freq, gainDb) {
  const A = Math.pow(10, gainDb / 40);
  const w0 = 2 * Math.PI * freq / sr;
  const cosw = Math.cos(w0);
  const sinw = Math.sin(w0);
  const S = 1;
  const alpha = sinw / 2 * Math.sqrt((A + 1 / A) * (1 / S - 1) + 2);
  const b0 = A * ((A + 1) - (A - 1) * cosw + 2 * Math.sqrt(A) * alpha);
  const b1 = 2 * A * ((A - 1) - (A + 1) * cosw);
  const b2 = A * ((A + 1) - (A - 1) * cosw - 2 * Math.sqrt(A) * alpha);
  const a0 = (A + 1) + (A - 1) * cosw + 2 * Math.sqrt(A) * alpha;
  const a1 = -2 * ((A - 1) + (A + 1) * cosw);
  const a2 = (A + 1) + (A - 1) * cosw - 2 * Math.sqrt(A) * alpha;
  return { b0: b0/a0, b1: b1/a0, b2: b2/a0, a1: a1/a0, a2: a2/a0, x1: 0, x2: 0, y1: 0, y2: 0 };
}

// Biquad Peak Filter for voice body
function makePeak(sr, freq, gainDb, Q = 1.0) {
  const A = Math.pow(10, gainDb / 40);
  const w0 = 2 * Math.PI * freq / sr;
  const alpha = Math.sin(w0) / (2 * Q);
  const b0 = 1 + alpha * A;
  const b1 = -2 * Math.cos(w0);
  const b2 = 1 - alpha * A;
  const a0 = 1 + alpha / A;
  const a1 = -2 * Math.cos(w0);
  const a2 = 1 - alpha / A;
  return { b0: b0/a0, b1: b1/a0, b2: b2/a0, a1: a1/a0, a2: a2/a0, x1: 0, x2: 0, y1: 0, y2: 0 };
}

function processBiquad(f, x) {
  const y = f.b0 * x + f.b1 * f.x1 + f.b2 * f.x2 - f.a1 * f.y1 - f.a2 * f.y2;
  f.x2 = f.x1; f.x1 = x;
  f.y2 = f.y1; f.y1 = y;
  return y;
}

const SR = 48000;
const TIMINGS = [
  { id: 'd1_emre', start: 0.4 },
  { id: 'd2_mert', start: 3.3 },
  { id: 'd3_emre', start: 6.8 },
  { id: 'd4_mert', start: 15.3 },
  { id: 'd5_emre', start: 26.5 }
];

const totalDur = 35.0; // tight 35 seconds total
const totalSamples = Math.round(totalDur * SR);
const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Process each voice clip with Deep Male Voice DSP
TIMINGS.forEach(item => {
  const wav = readWav(path.join(VDIR, item.id + '.wav'));
  const resampled = resampleTo48k(wav.data, wav.sampleRate, SR);
  const startIdx = Math.round(item.start * SR);
  
  // DSP Filters: +9.5 dB low shelf at 135Hz, +4.0 dB peak at 210Hz
  const ls = makeLowShelf(SR, 135, 9.5);
  const pk = makePeak(SR, 210, 4.0, 1.1);
  const hs = makeLowShelf(SR, 5000, -2.5);

  const dsp = new Float32Array(resampled.length);
  let peak = 0;
  for (let i = 0; i < resampled.length; i++) {
    let v = resampled[i];
    v = processBiquad(ls, v);
    v = processBiquad(pk, v);
    v = processBiquad(hs, v);
    // Soft tape saturation: thickens and warms low-end
    v = Math.tanh(v * 1.35);
    dsp[i] = v;
    if (Math.abs(v) > peak) peak = Math.abs(v);
  }

  // Normalize voice clip to -0.8 dBFS for punchy broadcast volume
  const gain = peak > 0 ? 0.94 / peak : 1;
  const pan = item.id.includes('emre') ? -0.05 : 0.05;
  const panL = 1 - Math.max(0, pan);
  const panR = 1 + Math.min(0, pan);

  for (let i = 0; i < dsp.length; i++) {
    const idx = startIdx + i;
    if (idx < totalSamples) {
      const s = dsp[i] * gain;
      left[idx] += s * panL;
      right[idx] += s * panR;
    }
  }
});

// Sound effects: crisp typewriter/phone clicks during site typing (around 16.8s to 18.2s)
for (let t = 16.8; t < 18.2; t += 0.08) {
  const idx = Math.round(t * SR);
  for (let j = 0; j < 350; j++) {
    const env = (1 - j / 350) * 0.09;
    const sample = (Math.random() * 2 - 1) * env;
    if (idx + j < totalSamples) {
      left[idx + j] += sample;
      right[idx + j] += sample;
    }
  }
}

// Ding at 18.5s (clean harmonic chime)
const dingIdx = Math.round(18.5 * SR);
for (let j = 0; j < SR * 0.7; j++) {
  const env = Math.exp(-j / (SR * 0.16)) * 0.16;
  const s = (Math.sin(j * 2 * Math.PI * 1318.5 / SR) + 0.45 * Math.sin(j * 2 * Math.PI * 1975.5 / SR)) * env;
  if (dingIdx + j < totalSamples) {
    left[dingIdx + j] += s;
    right[dingIdx + j] += s;
  }
}

// Master Limiter to prevent clipping
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
console.log('Deep voice master WAV written successfully:', outWav, (wavBuf.length / 1024 / 1024).toFixed(2), 'MB');
