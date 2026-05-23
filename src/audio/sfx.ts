type SfxName = 'select' | 'move' | 'capture' | 'check' | 'checkmate' | 'menu' | 'reset';

let audioContext: AudioContext | null = null;
let enabled = true;

const getContext = () => {
  if (!enabled || typeof window === 'undefined') {
    return null;
  }

  audioContext ??= new AudioContext();
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }

  return audioContext;
};

const tone = (
  frequency: number,
  duration = 0.12,
  type: OscillatorType = 'sine',
  gain = 0.045,
  delay = 0,
) => {
  const context = getContext();
  if (!context) {
    return;
  }

  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(frequency * 2.7, start);
  volume.gain.setValueAtTime(0.0001, start);
  volume.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  filter.connect(volume);
  volume.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.025);
};

const hit = (duration = 0.16, gain = 0.04) => {
  const context = getContext();
  if (!context) {
    return;
  }

  const start = context.currentTime;
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const volume = context.createGain();

  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(900, start);
  filter.Q.setValueAtTime(1.6, start);
  volume.gain.setValueAtTime(gain, start);
  volume.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(volume);
  volume.connect(context.destination);
  source.start(start);
};

export const playSfx = (name: SfxName) => {
  if (!enabled) {
    return;
  }

  if (name === 'select') {
    tone(640, 0.07, 'triangle', 0.035);
  }

  if (name === 'move') {
    tone(220, 0.08, 'sine', 0.035);
    tone(440, 0.1, 'triangle', 0.03, 0.055);
  }

  if (name === 'capture') {
    hit(0.18, 0.055);
    tone(110, 0.16, 'sawtooth', 0.035);
    tone(740, 0.08, 'square', 0.026, 0.06);
  }

  if (name === 'check') {
    tone(523.25, 0.1, 'triangle', 0.04);
    tone(783.99, 0.13, 'triangle', 0.04, 0.075);
  }

  if (name === 'checkmate') {
    hit(0.28, 0.06);
    tone(196, 0.2, 'sawtooth', 0.04);
    tone(392, 0.18, 'triangle', 0.04, 0.12);
    tone(783.99, 0.26, 'sine', 0.04, 0.28);
  }

  if (name === 'menu') {
    tone(330, 0.08, 'triangle', 0.032);
    tone(660, 0.12, 'sine', 0.032, 0.055);
  }

  if (name === 'reset') {
    tone(740, 0.08, 'triangle', 0.035);
    tone(370, 0.11, 'sine', 0.03, 0.07);
  }
};

export const setSfxEnabled = (nextEnabled: boolean) => {
  if (enabled && !nextEnabled) {
    playSfx('select');
  }

  enabled = nextEnabled;
};
