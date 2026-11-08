// Web Audio API Ringing Security Alarm for GMEC Super Admin Monitoring

class SecurityAlarmService {
  private audioCtx: AudioContext | null = null;
  private isRinging: boolean = false;
  private intervalId: number | null = null;
  private isMuted: boolean = false;
  private listeners: ((ringing: boolean, muted: boolean) => void)[] = [];

  constructor() {
    // Check if user previously muted
    if (typeof localStorage !== 'undefined') {
      this.isMuted = localStorage.getItem('gmec_security_alarm_muted') === 'true';
    }
  }

  public subscribe(fn: (ringing: boolean, muted: boolean) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isRinging, this.isMuted));
  }

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sawtooth') {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Volume envelope to prevent popping
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, this.audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio autoplay policy might defer until user gesture
    }
  }

  /**
   * Start ringing a persistent repeating emergency security alarm:
   * Alternates between 880Hz and 660Hz every 350ms to mimic an urgent operational siren.
   */
  public triggerAlarm() {
    if (this.isRinging) return;
    this.isRinging = true;
    this.notify();

    this.initAudioContext();

    // Play double beep immediately
    this.playTone(880, 0.22, 'sawtooth');
    setTimeout(() => this.playTone(660, 0.22, 'square'), 250);

    let high = true;
    this.intervalId = window.setInterval(() => {
      if (!this.isRinging) return;
      if (!this.isMuted) {
        this.playTone(high ? 880 : 660, 0.22, high ? 'sawtooth' : 'square');
        high = !high;
      }
    }, 550);
  }

  public stopAlarm() {
    this.isRinging = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gmec_security_alarm_muted', String(this.isMuted));
    }
    this.notify();
    return this.isMuted;
  }

  public isAlarmActive(): boolean {
    return this.isRinging;
  }

  public isAlarmMuted(): boolean {
    return this.isMuted;
  }
}

export const securityAlarm = new SecurityAlarmService();
