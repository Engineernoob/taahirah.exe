// ─── Web Audio synthesis engine ──────────────────────────────────────────────
// All sounds are synthesised in-browser — no audio files required.
// AudioContext is created lazily and must be unlocked by a user gesture first.

let _ctx: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return _ctx;
  } catch {
    return null;
  }
}

/** Call this inside any user-gesture handler to unlock the AudioContext. */
export function unlockAudio() {
  const c = ctx();
  if (c && c.state === "suspended") c.resume();
}

// ─── Low-level primitive ─────────────────────────────────────────────────────

type OscType = OscillatorType;

function tone(
  c: AudioContext,
  freq: number,
  offsetSec: number,
  dur: number,
  vol: number,
  type: OscType = "sine",
  attackSec = 0.01,
  destination: AudioNode = c.destination
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(destination);
  osc.type = type;
  osc.frequency.value = freq;
  const t = c.currentTime + offsetSec;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.linearRampToValueAtTime(vol, t + attackSec);
  gain.gain.setValueAtTime(vol, Math.max(t + attackSec, t + dur - 0.06));
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

// ─── Shimmer note: three detuned sines for a rich "chorus" quality ───────────

function shimmer(
  c: AudioContext,
  freq: number,
  offsetSec: number,
  dur: number,
  vol: number,
  destination: AudioNode = c.destination
) {
  // cents offsets + relative volumes
  const voices: [number, number][] = [
    [0, 1.0],
    [7, 0.38],
    [-7, 0.38],
    [14, 0.18],
  ];
  for (const [cents, vRatio] of voices) {
    tone(
      c,
      freq * Math.pow(2, cents / 1200),
      offsetSec,
      dur,
      vol * vRatio,
      "sine",
      0.06,
      destination
    );
  }
}

// ─── Public sound functions ───────────────────────────────────────────────────

/** Single PC-speaker POST beep (square wave, ≈ 200 ms). */
export function playBiosBeep() {
  const c = ctx();
  if (!c) return;
  tone(c, 750, 0, 0.22, 0.22, "square", 0.005);
}

/** Short tactile click for button presses. */
export function playClick() {
  const c = ctx();
  if (!c) return;
  tone(c, 1400, 0, 0.028, 0.055, "square", 0.003);
}

/** Two-note ascending "open" sound. */
export function playWindowOpen() {
  const c = ctx();
  if (!c) return;
  tone(c, 523.25, 0.0, 0.08, 0.09, "sine", 0.008); // C5
  tone(c, 659.26, 0.07, 0.12, 0.07, "sine", 0.008); // E5
}

/** Two-note descending "close" sound. */
export function playWindowClose() {
  const c = ctx();
  if (!c) return;
  tone(c, 659.26, 0.0, 0.07, 0.08, "sine", 0.008); // E5
  tone(c, 523.25, 0.06, 0.13, 0.06, "sine", 0.008); // C5
}

/** Classic Win95 "exclamation" error ding. */
export function playError() {
  const c = ctx();
  if (!c) return;
  tone(c, 880, 0.0, 0.14, 0.18, "sine", 0.01);
  tone(c, 660, 0.12, 0.2, 0.14, "sine", 0.01);
}

/**
 * Win95-inspired startup jingle.
 *
 * Approximates Brian Eno's "The Microsoft Sound" using layered shimmer tones
 * with slow attacks and overlapping sustains — total duration ≈ 3.2 s.
 */
export function playStartup() {
  const c = ctx();
  if (!c) return;

  // [freq Hz, start sec, duration sec, volume]
  const notes: [number, number, number, number][] = [
    [196.0, 0.0, 0.65, 0.11],  // G3
    [261.6, 0.18, 0.72, 0.10],  // C4
    [329.6, 0.40, 0.68, 0.09],  // E4
    [392.0, 0.62, 0.78, 0.09],  // G4
    [523.3, 0.88, 0.95, 0.08],  // C5
    [659.3, 1.14, 1.05, 0.07],  // E5
    [783.9, 1.38, 1.20, 0.06],  // G5  ← peak
    [523.3, 1.78, 1.45, 0.05],  // C5  (resolving tail)
    [392.0, 2.10, 1.20, 0.04],  // G4  (fade-out)
  ];

  for (const [freq, start, dur, vol] of notes) {
    shimmer(c, freq, start, dur, vol);
  }
}
