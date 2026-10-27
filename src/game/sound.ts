/**
 * Procedural WebAudio SFX Synthesizer for Eclipse Survivors.
 * Zero external MP3 dependencies — generates crisp, punchy retro-modern game audio on the fly.
 */
class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playHit(isCrit = false): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isCrit ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(isCrit ? 520 : 280, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.065);
    gain.gain.setValueAtTime(isCrit ? 0.14 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playGemPickup(comboPitch = 0): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const baseFreq = 580 + Math.min(comboPitch, 18) * 32;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.055);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.065);
  }

  playDash(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.14);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playLevelUp(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    });
  }

  playEvolutionChest(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const notes = [392, 493.88, 587.33, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.33);
    });
  }

  playBossWarning(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    for (let i = 0; i < 2; i++) {
      const now = ctx.currentTime + i * 0.28;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(145, now);
      osc.frequency.linearRampToValueAtTime(92, now + 0.24);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  }
}

export const sfx = new SoundEffectsEngine();
