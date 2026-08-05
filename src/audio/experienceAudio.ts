export type ExperienceSoundCue =
  | "rabbit-hop"
  | "rabbit-land"
  | "rabbit-look"
  | "scene-transition"
  | "scene-approach"
  | "fairy-idea"
  | "fairy-takeoff"
  | "fairy-flight"
  | "magic-sprinkle-soft"
  | "chest-rattle-soft"
  | "pouch-rustle"
  | "pouch-slip"
  | "magic-spill"
  | "chest-rumble-heavy"
  | "chest-open"
  | "magic-burst"
  | "letter-write"
  | "letter-page";

type AudioContextWindow = Window & {
  readonly webkitAudioContext?: typeof AudioContext;
};

interface ToneOptions {
  readonly frequency: number;
  readonly endFrequency?: number;
  readonly duration: number;
  readonly volume: number;
  readonly delay?: number;
  readonly type?: OscillatorType;
}

interface NoiseOptions {
  readonly duration: number;
  readonly volume: number;
  readonly frequency: number;
  readonly endFrequency?: number;
  readonly delay?: number;
  readonly filter?: BiquadFilterType;
  readonly resonance?: number;
}

const AMBIENCE_VOLUME = 0.13;
const EFFECTS_VOLUME = 0.72;

class ExperienceAudioController {
  private context: AudioContext | null = null;
  private effectsBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambience: HTMLAudioElement | null = null;
  private ambienceFadeFrame: number | null = null;
  private started = false;
  private enabled = true;
  private hidden = false;

  preload() {
    if (typeof window === "undefined") {
      return;
    }

    this.ensureAmbience().load();
  }

  async start() {
    if (!this.enabled || typeof window === "undefined") {
      return;
    }

    this.started = true;
    const context = this.ensureContext();
    const ambience = this.ensureAmbience();
    const operations: Promise<unknown>[] = [];

    if (context?.state === "suspended") {
      operations.push(context.resume());
    }

    if (!this.hidden && ambience.paused) {
      operations.push(ambience.play());
    }

    await Promise.allSettled(operations);

    if (!this.hidden) {
      this.fadeAmbienceTo(AMBIENCE_VOLUME, 1600);
    }

    this.setEffectsLevel(EFFECTS_VOLUME);
  }

  async setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (enabled) {
      await this.start();
      return;
    }

    this.fadeAmbienceTo(0, 420);
    this.setEffectsLevel(0);
  }

  async setDocumentHidden(hidden: boolean) {
    this.hidden = hidden;

    if (hidden) {
      if (this.ambienceFadeFrame !== null) {
        window.cancelAnimationFrame(this.ambienceFadeFrame);
        this.ambienceFadeFrame = null;
      }
      if (this.ambience) {
        this.ambience.volume = 0;
        this.ambience.pause();
      }
      if (this.context?.state === "running") {
        await this.context.suspend();
      }
      return;
    }

    if (this.started && this.enabled) {
      await this.start();
    }
  }

  play(cue: ExperienceSoundCue) {
    if (!this.started || !this.enabled || this.hidden) {
      return;
    }

    const context = this.ensureContext();

    if (!context || context.state !== "running") {
      return;
    }

    switch (cue) {
      case "rabbit-hop":
        this.noise({
          duration: 0.16,
          volume: 0.016,
          frequency: 1450,
          filter: "bandpass",
          resonance: 0.8,
        });
        this.tone({
          frequency: 145,
          endFrequency: 105,
          duration: 0.09,
          volume: 0.012,
          type: "triangle",
        });
        break;
      case "rabbit-land":
        this.noise({
          duration: 0.18,
          volume: 0.025,
          frequency: 520,
          filter: "lowpass",
        });
        this.tone({
          frequency: 92,
          endFrequency: 66,
          duration: 0.12,
          volume: 0.018,
          type: "sine",
        });
        break;
      case "rabbit-look":
        this.noise({
          duration: 0.24,
          volume: 0.012,
          frequency: 1850,
          filter: "highpass",
        });
        break;
      case "scene-transition":
        this.whoosh(1.1, 0.026, 720, 1550);
        break;
      case "scene-approach":
        this.whoosh(1.2, 0.022, 520, 1180);
        break;
      case "fairy-idea":
        this.chime([880, 1320, 1760], 0.045, 0.32);
        break;
      case "fairy-takeoff":
        this.whoosh(0.95, 0.025, 1050, 2800);
        this.tone({
          frequency: 420,
          endFrequency: 980,
          duration: 0.7,
          volume: 0.018,
          type: "sine",
        });
        break;
      case "fairy-flight":
        this.whoosh(1.45, 0.014, 1700, 2800);
        break;
      case "magic-sprinkle-soft":
        this.sparkles(1.45, 0.62);
        break;
      case "chest-rattle-soft":
        this.rumble(0.76, 0.42);
        break;
      case "pouch-rustle":
        this.noise({
          duration: 0.62,
          volume: 0.02,
          frequency: 1200,
          endFrequency: 2100,
          filter: "bandpass",
        });
        break;
      case "pouch-slip":
        this.tone({
          frequency: 760,
          endFrequency: 235,
          duration: 0.58,
          volume: 0.026,
          type: "sine",
        });
        this.noise({
          duration: 0.5,
          volume: 0.018,
          frequency: 1700,
          endFrequency: 620,
          filter: "bandpass",
        });
        break;
      case "magic-spill":
        this.sparkles(1.65, 1);
        this.whoosh(1.3, 0.024, 2400, 680);
        break;
      case "chest-rumble-heavy":
        this.rumble(1.62, 1);
        break;
      case "chest-open":
        this.noise({
          duration: 0.42,
          volume: 0.04,
          frequency: 430,
          endFrequency: 1250,
          filter: "bandpass",
          resonance: 1.3,
        });
        this.tone({
          frequency: 86,
          endFrequency: 54,
          duration: 0.3,
          volume: 0.05,
          type: "triangle",
        });
        break;
      case "magic-burst":
        this.whoosh(1.55, 0.055, 620, 3600);
        this.chime([392, 523.25, 659.25, 783.99], 0.055, 1.05);
        break;
      case "letter-write": {
        const pitch = 970 + Math.random() * 620;
        this.tone({
          frequency: pitch,
          endFrequency: pitch * 1.08,
          duration: 0.085,
          volume: 0.008,
          type: "sine",
        });
        break;
      }
      case "letter-page":
        this.chime([523.25, 783.99, 1046.5], 0.035, 0.42);
        this.whoosh(0.48, 0.012, 900, 1900);
        break;
    }
  }

  stop() {
    if (this.ambienceFadeFrame !== null) {
      window.cancelAnimationFrame(this.ambienceFadeFrame);
      this.ambienceFadeFrame = null;
    }

    this.ambience?.pause();
    this.ambience = null;
    this.noiseBuffer = null;
    this.effectsBus = null;
    this.started = false;

    if (this.context && this.context.state !== "closed") {
      void this.context.close();
    }

    this.context = null;
  }

  private ensureContext() {
    if (this.context) {
      return this.context;
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (window as AudioContextWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    this.context = new AudioContextConstructor();
    this.effectsBus = this.context.createGain();
    this.effectsBus.gain.value = this.enabled ? EFFECTS_VOLUME : 0;
    this.effectsBus.connect(this.context.destination);

    return this.context;
  }

  private ensureAmbience() {
    if (this.ambience) {
      return this.ambience;
    }

    const ambience = new Audio(
      `${import.meta.env.BASE_URL}audio/forest-ambience.mp3`,
    );
    ambience.loop = true;
    ambience.preload = "auto";
    ambience.volume = 0;
    ambience.setAttribute("playsinline", "");
    this.ambience = ambience;

    return ambience;
  }

  private setEffectsLevel(level: number) {
    const context = this.context;
    const bus = this.effectsBus;

    if (!context || !bus) {
      return;
    }

    const now = context.currentTime;
    bus.gain.cancelScheduledValues(now);
    bus.gain.setTargetAtTime(level, now, 0.045);
  }

  private fadeAmbienceTo(
    target: number,
    duration: number,
    pauseWhenSilent = false,
  ) {
    const ambience = this.ambience;

    if (!ambience) {
      return;
    }

    if (this.ambienceFadeFrame !== null) {
      window.cancelAnimationFrame(this.ambienceFadeFrame);
    }

    const initialVolume = ambience.volume;
    const startedAt = performance.now();

    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      ambience.volume = Math.max(
        0,
        Math.min(1, initialVolume + (target - initialVolume) * eased),
      );

      if (progress < 1) {
        this.ambienceFadeFrame = window.requestAnimationFrame(update);
      } else {
        this.ambienceFadeFrame = null;
        if (pauseWhenSilent && target === 0) {
          ambience.pause();
        }
      }
    };

    this.ambienceFadeFrame = window.requestAnimationFrame(update);
  }

  private getNoiseBuffer(context: AudioContext) {
    if (this.noiseBuffer?.sampleRate === context.sampleRate) {
      return this.noiseBuffer;
    }

    const length = context.sampleRate * 2;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let index = 0; index < length; index += 1) {
      channel[index] = Math.random() * 2 - 1;
    }

    this.noiseBuffer = buffer;
    return buffer;
  }

  private tone(options: ToneOptions) {
    const context = this.context;
    const output = this.effectsBus;

    if (!context || !output) {
      return;
    }

    const startsAt = context.currentTime + (options.delay ?? 0) + 0.01;
    const endsAt = startsAt + options.duration;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = options.type ?? "sine";
    oscillator.frequency.setValueAtTime(options.frequency, startsAt);

    if (options.endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(1, options.endFrequency),
        endsAt,
      );
    }

    gain.gain.setValueAtTime(0.0001, startsAt);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, options.volume),
      startsAt + Math.min(0.025, options.duration * 0.22),
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);

    oscillator.connect(gain).connect(output);
    oscillator.start(startsAt);
    oscillator.stop(endsAt + 0.02);
  }

  private noise(options: NoiseOptions) {
    const context = this.context;
    const output = this.effectsBus;

    if (!context || !output) {
      return;
    }

    const startsAt = context.currentTime + (options.delay ?? 0) + 0.01;
    const endsAt = startsAt + options.duration;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = this.getNoiseBuffer(context);
    filter.type = options.filter ?? "bandpass";
    filter.Q.value = options.resonance ?? 0.7;
    filter.frequency.setValueAtTime(options.frequency, startsAt);

    if (options.endFrequency) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(1, options.endFrequency),
        endsAt,
      );
    }

    gain.gain.setValueAtTime(0.0001, startsAt);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, options.volume),
      startsAt + Math.min(0.05, options.duration * 0.25),
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, endsAt);

    source.connect(filter).connect(gain).connect(output);
    source.start(startsAt, Math.random() * 1.2);
    source.stop(endsAt + 0.02);
  }

  private whoosh(
    duration: number,
    volume: number,
    frequency: number,
    endFrequency: number,
  ) {
    this.noise({
      duration,
      volume,
      frequency,
      endFrequency,
      filter: "bandpass",
      resonance: 0.9,
    });
  }

  private chime(
    frequencies: readonly number[],
    volume: number,
    duration: number,
  ) {
    frequencies.forEach((frequency, index) => {
      this.tone({
        frequency,
        endFrequency: frequency * 1.012,
        duration,
        volume: volume / Math.sqrt(frequencies.length),
        delay: index * 0.07,
        type: index % 2 === 0 ? "sine" : "triangle",
      });
    });
  }

  private sparkles(duration: number, intensity: number) {
    const count = Math.round(9 + duration * 5);

    for (let index = 0; index < count; index += 1) {
      const delay = (index / count) * duration + Math.random() * 0.08;
      const frequency = 980 + Math.random() * 1950;
      this.tone({
        frequency,
        endFrequency: frequency * (1.04 + Math.random() * 0.08),
        duration: 0.07 + Math.random() * 0.12,
        volume: (0.008 + Math.random() * 0.009) * intensity,
        delay,
        type: "sine",
      });
    }
  }

  private rumble(duration: number, intensity: number) {
    this.noise({
      duration,
      volume: 0.055 * intensity,
      frequency: 230,
      endFrequency: 95,
      filter: "lowpass",
      resonance: 0.5,
    });
    this.tone({
      frequency: 58,
      endFrequency: 43,
      duration,
      volume: 0.035 * intensity,
      type: "sawtooth",
    });
  }
}

export const experienceAudio = new ExperienceAudioController();
