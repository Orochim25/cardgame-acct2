// audio.js — all sounds are synthesized with WebAudio. No audio files.
// The context is created on the first user gesture; every sound is a few oscillators.

let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export const sfx = {
  click() { tone(660, 0.06, 'sine', 0.12); },
  draw() { tone(520, 0.08, 'triangle', 0.10, 0, 780); },
  play() { tone(220, 0.12, 'triangle', 0.16, 0, 330); tone(440, 0.09, 'sine', 0.10, 0.05); },
  damage() { tone(160, 0.25, 'sawtooth', 0.18, 0, 60); },
  bigHit() { tone(120, 0.35, 'sawtooth', 0.22, 0, 45); tone(90, 0.3, 'square', 0.10, 0.02, 40); },
  turn() { tone(392, 0.07, 'sine', 0.10); tone(523, 0.07, 'sine', 0.10, 0.07); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.14, i * 0.11)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.25, 'sine', 0.12, i * 0.13)); },
};
