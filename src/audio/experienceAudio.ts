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
  | "chest-glow-soft"
  | "chest-rattle-soft"
  | "pouch-rustle"
  | "pouch-slip"
  | "magic-spill"
  | "chest-glow-strong"
  | "chest-rumble-heavy"
  | "chest-open"
  | "magic-burst"
  | "letter-write"
  | "letter-page";

type AudioContextWindow = Window & {
  readonly webkitAudioContext?: typeof AudioContext;
};

type MusicMood = "forest" | "tension" | "invitation";

type RabbitLeafSample = "rabbit-hop" | "rabbit-land";

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

const AMBIENCE_VOLUME = 0.055;
const FOREST_MUSIC_VOLUME = 0.045;
const TENSION_MUSIC_VOLUME = 0.062;
const INVITATION_MUSIC_VOLUME = 0.075;
const EFFECTS_VOLUME = 0.54;

const rabbitLeafPaths: Record<RabbitLeafSample, string> = {
  "rabbit-hop": "audio/rabbit-leaves-hop.mp3",
  "rabbit-land": "audio/rabbit-leaves-land.mp3",
};

class ExperienceAudioController {
  private context: AudioContext | null = null;
  private effectsBus: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private ambience: HTMLAudioElement | null = null;
  private forestMusic: HTMLAudioElement | null = null;
  private invitationMusic: HTMLAudioElement | null = null;
  private leafSampleData = new Map<RabbitLeafSample, ArrayBuffer>();
  private leafSampleLoads = new Map<RabbitLeafSample, Promise<ArrayBuffer>>();
  private leafSampleBuffers = new Map<RabbitLeafSample, AudioBuffer>();
  private leafSampleDecodes = new Map<RabbitLeafSample, Promise<AudioBuffer>>();
  private transientSources = new Set<AudioBufferSourceNode>();
  private mediaFadeFrames = new Map<HTMLAudioElement, number>();
  private musicMood: MusicMood = "forest";
  private started = false;
  private enabled = true;
  private hidden = false;

  preload() {
    if (typeof window === "undefined") {
      return;
    }

    this.getBackgroundMedia().forEach((media) => media.load());
    (Object.keys(rabbitLeafPaths) as RabbitLeafSample[]).forEach((cue) => {
      void this.loadLeafSampleData(cue).catch(() => undefined);
    });
  }

  async start() {
    if (!this.enabled || typeof window === "undefined") {
      return;
    }

    this.started = true;
    const context = this.ensureContext();
    const operations: Promise<unknown>[] = [];

    if (context?.state === "suspended") {
      operations.push(context.resume());
    }

    if (context) {
      (Object.keys(rabbitLeafPaths) as RabbitLeafSample[]).forEach((cue) => {
        operations.push(this.decodeLeafSample(cue, context));
      });
    }

    if (!this.hidden) {
      this.getBackgroundMedia().forEach((media) => {
        if (media.paused) {
          operations.push(media.play());
        }
      });
    }

    await Promise.allSettled(operations);

    if (!this.hidden) {
      this.fadeMediaTo(this.ensureAmbience(), AMBIENCE_VOLUME, 2200);
      this.applyMusicMood(1800);
    }

    this.setEffectsLevel(EFFECTS_VOLUME);
  }

  async setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (enabled) {
      await this.start();
      return;
    }

    this.getExistingBackgroundMedia().forEach((media) =>
      this.fadeMediaTo(media, 0, 420, true),
    );
    this.stopTransientAudio();
    this.setEffectsLevel(0);
  }

  async setDocumentHidden(hidden: boolean) {
    this.hidden = hidden;

    if (hidden) {
      this.getExistingBackgroundMedia().forEach((media) => {
        this.cancelMediaFade(media);
        media.volume = 0;
        media.pause();
      });
      this.stopTransientAudio();
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

    if (!context) {
      return;
    }

    if (context.state !== "running") {
      void context
        .resume()
        .then(() => {
          if (this.started && this.enabled && !this.hidden) {
            this.play(cue);
          }
        })
        .catch(() => undefined);
      return;
    }

    switch (cue) {
      case "rabbit-hop":
        this.playLeafSample(cue, 0.24, 0.98 + Math.random() * 0.05);
        break;
      case "rabbit-land":
        this.playLeafSample(cue, 0.27, 0.96 + Math.random() * 0.045);
        this.tone({
          frequency: 86,
          endFrequency: 64,
          duration: 0.1,
          volume: 0.006,
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
      case "chest-glow-soft":
        this.lightShimmer(0.9, 0.58);
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
        this.setMusicMood("tension");
        this.expectationRise(2.05);
        this.sparkles(1.65, 1);
        this.whoosh(1.3, 0.024, 2400, 680);
        break;
      case "chest-glow-strong":
        this.lightShimmer(1.9, 1);
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
        this.setMusicMood("invitation");
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
    this.getExistingBackgroundMedia().forEach((media) => {
      this.cancelMediaFade(media);
      media.pause();
    });
    this.stopTransientAudio();
    this.ambience = null;
    this.forestMusic = null;
    this.invitationMusic = null;
    this.leafSampleData.clear();
    this.leafSampleLoads.clear();
    this.leafSampleBuffers.clear();
    this.leafSampleDecodes.clear();
    this.mediaFadeFrames.clear();
    this.noiseBuffer = null;
    this.effectsBus = null;
    this.started = false;
    this.musicMood = "forest";

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

    this.ambience = this.createBackgroundAudio("audio/forest-ambience.mp3");

    return this.ambience;
  }

  private ensureForestMusic() {
    if (this.forestMusic) {
      return this.forestMusic;
    }

    this.forestMusic = this.createBackgroundAudio(
      "audio/music-forest-curiosity.mp3",
    );

    return this.forestMusic;
  }

  private ensureInvitationMusic() {
    if (this.invitationMusic) {
      return this.invitationMusic;
    }

    this.invitationMusic = this.createBackgroundAudio(
      "audio/music-invitation-warm.mp3",
    );

    return this.invitationMusic;
  }

  private createBackgroundAudio(path: string) {
    const media = new Audio(`${import.meta.env.BASE_URL}${path}`);
    media.loop = true;
    media.preload = "auto";
    media.volume = 0;
    media.setAttribute("playsinline", "");
    return media;
  }

  private getBackgroundMedia() {
    return [
      this.ensureAmbience(),
      this.ensureForestMusic(),
      this.ensureInvitationMusic(),
    ];
  }

  private getExistingBackgroundMedia() {
    return [this.ambience, this.forestMusic, this.invitationMusic].filter(
      (media): media is HTMLAudioElement => media !== null,
    );
  }

  private loadLeafSampleData(cue: RabbitLeafSample): Promise<ArrayBuffer> {
    const existing = this.leafSampleData.get(cue);

    if (existing) {
      return Promise.resolve(existing);
    }

    const pending = this.leafSampleLoads.get(cue);

    if (pending) {
      return pending;
    }

    const request = fetch(
      `${import.meta.env.BASE_URL}${rabbitLeafPaths[cue]}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load leaf sample: " + cue);
        }

        return response.arrayBuffer();
      })
      .then((data) => {
        this.leafSampleData.set(cue, data);
        this.leafSampleLoads.delete(cue);
        return data;
      })
      .catch((error: unknown) => {
        this.leafSampleLoads.delete(cue);
        throw error;
      });

    this.leafSampleLoads.set(cue, request);
    return request;
  }

  private decodeLeafSample(
    cue: RabbitLeafSample,
    context: AudioContext,
  ): Promise<AudioBuffer> {
    const existing = this.leafSampleBuffers.get(cue);

    if (existing) {
      return Promise.resolve(existing);
    }

    const pending = this.leafSampleDecodes.get(cue);

    if (pending) {
      return pending;
    }

    const decoding = this.loadLeafSampleData(cue)
      .then((data) => context.decodeAudioData(data.slice(0)))
      .then((buffer) => {
        this.leafSampleBuffers.set(cue, buffer);
        this.leafSampleDecodes.delete(cue);
        return buffer;
      })
      .catch((error: unknown) => {
        this.leafSampleDecodes.delete(cue);
        throw error;
      });

    this.leafSampleDecodes.set(cue, decoding);
    return decoding;
  }

  private playLeafSample(
    cue: RabbitLeafSample,
    volume: number,
    playbackRate: number,
  ) {
    const context = this.context;
    const output = this.effectsBus;

    if (!context || !output || context.state !== "running") {
      return;
    }

    const buffer = this.leafSampleBuffers.get(cue);

    if (!buffer) {
      void this.decodeLeafSample(cue, context)
        .then(() => {
          if (this.started && this.enabled && !this.hidden) {
            this.playLeafSample(cue, volume, playbackRate);
          }
        })
        .catch(() => undefined);
      return;
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    const cleanup = () => {
      source.disconnect();
      gain.disconnect();
      this.transientSources.delete(source);
    };

    source.buffer = buffer;
    source.playbackRate.setValueAtTime(playbackRate, context.currentTime);
    gain.gain.setValueAtTime(
      Math.max(0, Math.min(1, volume)),
      context.currentTime,
    );
    source.connect(gain).connect(output);
    source.addEventListener("ended", cleanup, { once: true });
    this.transientSources.add(source);
    source.start();
  }

  private stopTransientAudio() {
    this.transientSources.forEach((source) => {
      try {
        source.stop();
      } catch {
        source.disconnect();
      }
    });
    this.transientSources.clear();
  }

  private setMusicMood(mood: MusicMood) {
    const changed = mood !== this.musicMood;
    this.musicMood = mood;

    if (changed && mood === "invitation") {
      this.ensureInvitationMusic().currentTime = 0;
    }

    if (this.started && this.enabled && !this.hidden) {
      this.applyMusicMood(mood === "invitation" ? 1900 : 720);
    }
  }

  private applyMusicMood(duration: number) {
    const forestTarget =
      this.musicMood === "invitation"
        ? 0
        : this.musicMood === "tension"
          ? TENSION_MUSIC_VOLUME
          : FOREST_MUSIC_VOLUME;
    const invitationTarget =
      this.musicMood === "invitation" ? INVITATION_MUSIC_VOLUME : 0;
    const ambienceTarget =
      this.musicMood === "invitation"
        ? AMBIENCE_VOLUME * 0.72
        : this.musicMood === "tension"
          ? AMBIENCE_VOLUME * 0.82
          : AMBIENCE_VOLUME;

    this.fadeMediaTo(this.ensureForestMusic(), forestTarget, duration);
    this.fadeMediaTo(
      this.ensureInvitationMusic(),
      invitationTarget,
      duration,
    );
    this.fadeMediaTo(this.ensureAmbience(), ambienceTarget, duration);
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

  private fadeMediaTo(
    media: HTMLAudioElement,
    target: number,
    duration: number,
    pauseWhenSilent = false,
  ) {
    this.cancelMediaFade(media);

    const initialVolume = media.volume;
    const startedAt = performance.now();

    const update = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      media.volume = Math.max(
        0,
        Math.min(1, initialVolume + (target - initialVolume) * eased),
      );

      if (progress < 1) {
        this.mediaFadeFrames.set(
          media,
          window.requestAnimationFrame(update),
        );
      } else {
        this.mediaFadeFrames.delete(media);
        if (pauseWhenSilent && target === 0) {
          media.pause();
        }
      }
    };

    this.mediaFadeFrames.set(media, window.requestAnimationFrame(update));
  }

  private cancelMediaFade(media: HTMLAudioElement) {
    const frame = this.mediaFadeFrames.get(media);

    if (frame !== undefined) {
      window.cancelAnimationFrame(frame);
      this.mediaFadeFrames.delete(media);
    }
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

  private expectationRise(duration: number) {
    this.tone({
      frequency: 82,
      endFrequency: 174,
      duration,
      volume: 0.018,
      type: "sine",
    });
    this.tone({
      frequency: 164,
      endFrequency: 348,
      duration: duration * 0.82,
      volume: 0.009,
      delay: duration * 0.18,
      type: "triangle",
    });
    this.noise({
      duration,
      volume: 0.012,
      frequency: 360,
      endFrequency: 1480,
      filter: "bandpass",
      resonance: 1.1,
    });
  }

  private lightShimmer(duration: number, intensity: number) {
    this.tone({
      frequency: 784,
      endFrequency: 1046.5,
      duration,
      volume: 0.011 * intensity,
      type: "sine",
    });
    this.tone({
      frequency: 1174.66,
      endFrequency: 1567.98,
      duration: duration * 0.88,
      volume: 0.0065 * intensity,
      delay: duration * 0.08,
      type: "sine",
    });
    this.noise({
      duration,
      volume: 0.0035 * intensity,
      frequency: 4200,
      endFrequency: 6400,
      filter: "bandpass",
      resonance: 0.8,
    });

    const accents = Math.max(3, Math.round(duration * 4));

    for (let index = 0; index < accents; index += 1) {
      const frequency = 1500 + Math.random() * 1300;
      this.tone({
        frequency,
        endFrequency: frequency * 1.035,
        duration: 0.11 + Math.random() * 0.09,
        volume: (0.004 + Math.random() * 0.003) * intensity,
        delay: (index / accents) * duration,
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
