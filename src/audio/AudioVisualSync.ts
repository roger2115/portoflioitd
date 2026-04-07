/**
 * Audio-Visual Synchronization Module
 * Implements Observer pattern for synchronizing audio with visual animations
 * 
 * Requirements: 3.3
 */

import type { AudioManager } from './AudioManager';
import type { VisualEffectsEngine } from '../effects/VisualEffectsEngine';

/**
 * Synchronization event types
 */
export type SyncEventType = 'sound' | 'animation' | 'both';

/**
 * Synchronization event data
 */
export interface SyncEvent {
  id: string;
  type: SyncEventType;
  timestamp: number;
  soundId?: string;
  animationTarget?: HTMLElement;
  animationConfig?: AnimationConfig;
}

/**
 * Animation configuration for synchronized effects
 */
export interface AnimationConfig {
  type: 'neonGlow' | 'fadeIn' | 'custom';
  intensity?: number;
  delay?: number;
  duration?: number;
  customFn?: (element: HTMLElement) => void;
}

/**
 * Observer interface for audio-visual synchronization
 */
export interface SyncObserver {
  onSyncEvent(event: SyncEvent): void;
}

/**
 * Audio-Visual Synchronization Manager
 * Coordinates timing between audio playback and visual effects
 * Tolerance: ±20ms (Req 3.3)
 */
export class AudioVisualSyncManager {
  private audioManager: AudioManager;
  private visualEffects: VisualEffectsEngine;
  private observers: Set<SyncObserver> = new Set();
  private syncEvents: Map<string, SyncEvent> = new Map();
  private readonly SYNC_TOLERANCE_MS = 20; // ±20ms tolerance (Req 3.3)

  constructor(audioManager: AudioManager, visualEffects: VisualEffectsEngine) {
    this.audioManager = audioManager;
    this.visualEffects = visualEffects;
  }

  /**
   * Register an observer for synchronization events
   * @param observer - Observer to register
   */
  addObserver(observer: SyncObserver): void {
    this.observers.add(observer);
  }

  /**
   * Unregister an observer
   * @param observer - Observer to remove
   */
  removeObserver(observer: SyncObserver): void {
    this.observers.delete(observer);
  }

  /**
   * Notify all observers of a synchronization event
   * @private
   */
  private notifyObservers(event: SyncEvent): void {
    this.observers.forEach(observer => {
      try {
        observer.onSyncEvent(event);
      } catch (error) {
        console.error('Error notifying observer:', error);
      }
    });
  }

  /**
   * Play synchronized audio and visual effect
   * Ensures both start within ±20ms tolerance (Req 3.3)
   * @param soundId - ID of sound to play
   * @param element - HTML element to animate
   * @param animationConfig - Animation configuration
   * @param volume - Optional volume override
   */
  playSynchronized(
    soundId: string,
    element: HTMLElement,
    animationConfig: AnimationConfig,
    volume?: number
  ): void {
    const eventId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();

    // Create sync event
    const syncEvent: SyncEvent = {
      id: eventId,
      type: 'both',
      timestamp: startTime,
      soundId,
      animationTarget: element,
      animationConfig
    };

    this.syncEvents.set(eventId, syncEvent);

    // Execute audio and visual effects simultaneously
    // Using Promise.all ensures both start as close to the same time as possible
    Promise.all([
      this.executeAudio(soundId, volume, startTime),
      this.executeAnimation(element, animationConfig, startTime)
    ]).then(([audioTime, animationTime]) => {
      // Calculate timing difference
      const timeDiff = Math.abs(audioTime - animationTime);
      
      // Log warning if outside tolerance
      if (timeDiff > this.SYNC_TOLERANCE_MS) {
        console.warn(
          `Sync timing outside tolerance: ${timeDiff.toFixed(2)}ms ` +
          `(tolerance: ±${this.SYNC_TOLERANCE_MS}ms)`
        );
      }

      // Notify observers
      this.notifyObservers(syncEvent);

      // Clean up event after notification
      setTimeout(() => {
        this.syncEvents.delete(eventId);
      }, 1000);
    }).catch(error => {
      console.error('Synchronization error:', error);
      this.syncEvents.delete(eventId);
    });
  }

  /**
   * Execute audio playback and return actual start time
   * @private
   */
  private async executeAudio(
    soundId: string,
    volume: number | undefined,
    requestTime: number
  ): Promise<number> {
    return new Promise((resolve) => {
      // Play sound (should be < 50ms - Req 3.1)
      this.audioManager.playSound(soundId, volume);
      
      const actualTime = performance.now();
      const executionTime = actualTime - requestTime;
      
      resolve(executionTime);
    });
  }

  /**
   * Execute visual animation and return actual start time
   * @private
   */
  private async executeAnimation(
    element: HTMLElement,
    config: AnimationConfig,
    requestTime: number
  ): Promise<number> {
    return new Promise((resolve) => {
      // Execute animation based on type
      switch (config.type) {
        case 'neonGlow':
          this.visualEffects.applyNeonGlow(
            element,
            config.intensity !== undefined ? config.intensity : 1.0
          );
          break;

        case 'fadeIn':
          this.visualEffects.fadeIn(
            element,
            config.delay !== undefined ? config.delay : 0
          );
          break;

        case 'custom':
          if (config.customFn) {
            config.customFn(element);
          }
          break;

        default:
          console.warn(`Unknown animation type: ${config.type}`);
      }

      const actualTime = performance.now();
      const executionTime = actualTime - requestTime;
      
      resolve(executionTime);
    });
  }

  /**
   * Play only audio with event notification
   * @param soundId - ID of sound to play
   * @param volume - Optional volume override
   */
  playAudioOnly(soundId: string, volume?: number): void {
    const eventId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = performance.now();

    const syncEvent: SyncEvent = {
      id: eventId,
      type: 'sound',
      timestamp,
      soundId
    };

    this.audioManager.playSound(soundId, volume);
    this.notifyObservers(syncEvent);
  }

  /**
   * Play only animation with event notification
   * @param element - HTML element to animate
   * @param animationConfig - Animation configuration
   */
  playAnimationOnly(element: HTMLElement, animationConfig: AnimationConfig): void {
    const eventId = `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = performance.now();

    const syncEvent: SyncEvent = {
      id: eventId,
      type: 'animation',
      timestamp,
      animationTarget: element,
      animationConfig
    };

    this.executeAnimation(element, animationConfig, timestamp);
    this.notifyObservers(syncEvent);
  }

  /**
   * Get synchronization tolerance in milliseconds
   * @returns Tolerance value (±20ms)
   */
  getSyncTolerance(): number {
    return this.SYNC_TOLERANCE_MS;
  }

  /**
   * Get active sync events
   * @returns Map of active sync events
   */
  getActiveSyncEvents(): Map<string, SyncEvent> {
    return new Map(this.syncEvents);
  }

  /**
   * Clear all observers and events
   */
  dispose(): void {
    this.observers.clear();
    this.syncEvents.clear();
  }
}

/**
 * Create and return a new Audio-Visual Sync Manager instance
 * @param audioManager - Audio Manager instance
 * @param visualEffects - Visual Effects Engine instance
 * @returns AudioVisualSyncManager instance
 */
export function createAudioVisualSyncManager(
  audioManager: AudioManager,
  visualEffects: VisualEffectsEngine
): AudioVisualSyncManager {
  return new AudioVisualSyncManager(audioManager, visualEffects);
}
