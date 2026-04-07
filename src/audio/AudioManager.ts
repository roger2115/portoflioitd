/**
 * Audio Manager
 * Manages audio playback, preloading, and synchronization using Web Audio API
 * 
 * Requirements: 3.1, 3.2, 3.4, 3.5, 3.6
 */

import type { AudioFile } from '../config/PortfolioConfig';

/**
 * Audio Manager Interface
 * Handles audio playback, preloading, and volume control
 */
export interface AudioManager {
  /** Initialize audio manager with preloading */
  initialize(audioFiles: AudioFile[]): Promise<void>;
  
  /** Play a sound effect */
  playSound(soundId: string, volume?: number): void;
  
  /** Play background music */
  playBackgroundMusic(trackId: string, loop: boolean): void;
  
  /** Stop background music */
  stopBackgroundMusic(): void;
  
  /** Fade out and stop background music */
  fadeOutBackgroundMusic(duration: number): Promise<void>;
  
  /** Set global volume */
  setVolume(volume: number): void;
  
  /** Mute or unmute audio */
  mute(muted: boolean): void;
  
  /** Check if audio is ready */
  isReady(): boolean;
  
  /** Get loading progress (0-1) */
  getLoadingProgress(): number;
  
  /** Get current music track ID */
  getCurrentMusicId(): string | null;
  
  /** Check if audio is muted */
  isMutedState(): boolean;
  
  /** Get current volume level */
  getVolume(): number;
}

/**
 * Audio buffer with metadata
 */
interface AudioBufferData {
  id: string;
  buffer: AudioBuffer;
  type: 'effect' | 'music';
}

/**
 * Default Audio Manager Implementation using Web Audio API
 */
export class DefaultAudioManager implements AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBufferData> = new Map();
  private gainNode: GainNode | null = null;
  private currentMusicSource: AudioBufferSourceNode | null = null;
  private currentMusicId: string | null = null;
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private loadingProgress: number = 0;
  private totalFiles: number = 0;
  private loadedFiles: number = 0;

  /**
   * Initialize audio manager with preloading (Req 3.4)
   * @param audioFiles - Array of audio files to preload
   * @returns Promise that resolves when all audio is loaded
   */
  async initialize(audioFiles: AudioFile[]): Promise<void> {
    try {
      // Create AudioContext (Req 3.1, 3.6)
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain node for volume control (Req 3.2, 3.5)
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
      
      // Preload audio files with progress tracking
      this.totalFiles = audioFiles.filter(file => file.preload).length;
      this.loadedFiles = 0;
      this.loadingProgress = 0;
      
      const preloadPromises = audioFiles
        .filter(file => file.preload)
        .map(file => this.loadAudioFile(file));
      
      await Promise.all(preloadPromises);
      
      this.isInitialized = true;
      // If no files to load, progress is 100%, otherwise it's already set by loadAudioFile
      this.loadingProgress = this.totalFiles === 0 ? 1.0 : this.loadingProgress;
    } catch (error) {
      console.error('Failed to initialize Audio Manager:', error);
      // Graceful degradation - audio features will be disabled
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Load a single audio file
   * @private
   */
  private async loadAudioFile(audioFile: AudioFile): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    try {
      // Fetch audio file
      const response = await fetch(audioFile.url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode audio data (supports MP3 and OGG - Req 3.6)
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Store buffer
      this.audioBuffers.set(audioFile.id, {
        id: audioFile.id,
        buffer: audioBuffer,
        type: audioFile.type
      });
      
      // Update progress
      this.loadedFiles++;
      this.loadingProgress = this.totalFiles > 0 ? this.loadedFiles / this.totalFiles : 0;
    } catch (error) {
      console.error(`Failed to load audio file: ${audioFile.id}`, error);
      // Continue loading other files even if one fails
      this.loadedFiles++;
      this.loadingProgress = this.totalFiles > 0 ? this.loadedFiles / this.totalFiles : 0;
    }
  }

  /**
   * Play a sound effect with < 50ms reaction time (Req 3.1)
   * @param soundId - ID of the sound to play
   * @param volume - Optional volume override (0-1)
   */
  playSound(soundId: string, volume?: number): void {
    if (!this.isInitialized || !this.audioContext || !this.gainNode) {
      console.warn('Audio Manager not initialized');
      return;
    }

    const audioData = this.audioBuffers.get(soundId);
    if (!audioData) {
      console.warn(`Sound not found: ${soundId}`);
      return;
    }

    if (audioData.type !== 'effect') {
      console.warn(`Audio ${soundId} is not a sound effect`);
      return;
    }

    try {
      // Create buffer source for playback
      const source = this.audioContext.createBufferSource();
      source.buffer = audioData.buffer;
      
      // Create gain node for this sound
      const soundGain = this.audioContext.createGain();
      const effectiveVolume = volume !== undefined ? volume : 1.0;
      soundGain.gain.value = effectiveVolume;
      
      // Connect: source -> soundGain -> masterGain -> destination
      source.connect(soundGain);
      soundGain.connect(this.gainNode);
      
      // Start playback immediately (< 50ms reaction time - Req 3.1)
      source.start(0);
    } catch (error) {
      console.error(`Failed to play sound: ${soundId}`, error);
    }
  }

  /**
   * Play background music with loop and volume control (Req 3.2)
   * @param trackId - ID of the music track to play
   * @param loop - Whether to loop the music
   */
  playBackgroundMusic(trackId: string, loop: boolean): void {
    if (!this.isInitialized || !this.audioContext || !this.gainNode) {
      console.warn('Audio Manager not initialized');
      return;
    }

    const audioData = this.audioBuffers.get(trackId);
    if (!audioData) {
      console.warn(`Music track not found: ${trackId}`);
      return;
    }

    if (audioData.type !== 'music') {
      console.warn(`Audio ${trackId} is not a music track`);
      return;
    }

    try {
      // Stop current music if playing
      if (this.currentMusicSource) {
        this.stopBackgroundMusic();
      }

      // Create buffer source for music playback
      const source = this.audioContext.createBufferSource();
      source.buffer = audioData.buffer;
      source.loop = loop;
      
      // Connect to master gain node
      source.connect(this.gainNode);
      
      // Start playback
      source.start(0);
      
      // Store reference
      this.currentMusicSource = source;
      this.currentMusicId = trackId;
    } catch (error) {
      console.error(`Failed to play background music: ${trackId}`, error);
    }
  }

  /**
   * Fade out and stop background music
   * @param duration - Fade out duration in milliseconds
   */
  async fadeOutBackgroundMusic(duration: number): Promise<void> {
    if (!this.currentMusicSource || !this.gainNode || !this.audioContext) {
      return;
    }

    const startVolume = this.gainNode.gain.value;
    const startTime = this.audioContext.currentTime;
    const endTime = startTime + (duration / 1000);

    // Exponential fade out
    this.gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

    // Wait for fade to complete
    await new Promise(resolve => setTimeout(resolve, duration));

    // Stop music
    this.stopBackgroundMusic();

    // Restore volume
    if (this.gainNode) {
      this.gainNode.gain.value = startVolume;
    }
  }

  /**
   * Stop background music (Req 3.2)
   */
  stopBackgroundMusic(): void {
    if (this.currentMusicSource) {
      try {
        this.currentMusicSource.stop();
      } catch (error) {
        // Source might already be stopped
        console.debug('Music source already stopped');
      }
      this.currentMusicSource = null;
      this.currentMusicId = null;
    }
  }

  /**
   * Set global volume (Req 3.2)
   * @param volume - Volume level (0-1)
   */
  setVolume(volume: number): void {
    // Clamp volume between 0 and 1
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.gainNode && !this.isMuted) {
      this.gainNode.gain.value = this.volume;
    }
  }

  /**
   * Mute or unmute audio (Req 3.5)
   * @param muted - True to mute, false to unmute
   */
  mute(muted: boolean): void {
    this.isMuted = muted;
    
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : this.volume;
    }
  }

  /**
   * Check if audio is ready
   * @returns True if audio manager is initialized and ready
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get loading progress (Req 3.4)
   * @returns Progress value between 0 and 1
   */
  getLoadingProgress(): number {
    return this.loadingProgress;
  }

  /**
   * Get current music track ID
   * @returns Current music track ID or null
   */
  getCurrentMusicId(): string | null {
    return this.currentMusicId;
  }

  /**
   * Check if muted
   * @returns True if audio is muted
   */
  isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Get current volume
   * @returns Current volume (0-1)
   */
  getVolume(): number {
    return this.volume;
  }
}

/**
 * Create and return a new Audio Manager instance
 * @returns AudioManager instance
 */
export function createAudioManager(): AudioManager {
  return new DefaultAudioManager();
}
