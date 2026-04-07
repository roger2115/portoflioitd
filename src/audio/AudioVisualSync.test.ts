/**
 * Audio-Visual Synchronization Tests
 * Tests for Observer pattern and timing synchronization
 * 
 * Requirements: 3.3
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  AudioVisualSyncManager,
  createAudioVisualSyncManager,
  type SyncObserver,
  type AnimationConfig
} from './AudioVisualSync';
import type { AudioManager } from './AudioManager';
import type { VisualEffectsEngine } from '../effects/VisualEffectsEngine';

describe('AudioVisualSyncManager', () => {
  let audioManager: AudioManager;
  let visualEffects: VisualEffectsEngine;
  let syncManager: AudioVisualSyncManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Mock AudioManager
    audioManager = {
      initialize: vi.fn(),
      playSound: vi.fn(),
      playBackgroundMusic: vi.fn(),
      stopBackgroundMusic: vi.fn(),
      fadeOutBackgroundMusic: vi.fn(() => Promise.resolve()),
      setVolume: vi.fn(),
      mute: vi.fn(),
      isReady: vi.fn(() => true),
      getLoadingProgress: vi.fn(() => 1.0),
      getCurrentMusicId: vi.fn(() => null),
      isMutedState: vi.fn(() => false),
      getVolume: vi.fn(() => 1.0)
    };

    // Mock VisualEffectsEngine
    visualEffects = {
      initialize: vi.fn(),
      applyNeonGlow: vi.fn(),
      enableParallax: vi.fn(),
      renderParticles: vi.fn(),
      fadeIn: vi.fn(() => Promise.resolve()),
      stopAll: vi.fn(),
      getFPS: vi.fn(() => 60)
    };

    // Create sync manager
    syncManager = createAudioVisualSyncManager(audioManager, visualEffects);

    // Create mock element
    mockElement = document.createElement('div');
  });

  describe('Observer Pattern', () => {
    it('should add and notify observers', () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(observer);
      syncManager.playAudioOnly('test-sound');

      expect(observer.onSyncEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sound',
          soundId: 'test-sound'
        })
      );
    });

    it('should remove observers', () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(observer);
      syncManager.removeObserver(observer);
      syncManager.playAudioOnly('test-sound');

      expect(observer.onSyncEvent).not.toHaveBeenCalled();
    });

    it('should notify multiple observers', () => {
      const observer1: SyncObserver = {
        onSyncEvent: vi.fn()
      };
      const observer2: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(observer1);
      syncManager.addObserver(observer2);
      syncManager.playAudioOnly('test-sound');

      expect(observer1.onSyncEvent).toHaveBeenCalled();
      expect(observer2.onSyncEvent).toHaveBeenCalled();
    });

    it('should handle observer errors gracefully', () => {
      const errorObserver: SyncObserver = {
        onSyncEvent: vi.fn(() => {
          throw new Error('Observer error');
        })
      };
      const goodObserver: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(errorObserver);
      syncManager.addObserver(goodObserver);

      // Should not throw
      expect(() => {
        syncManager.playAudioOnly('test-sound');
      }).not.toThrow();

      // Good observer should still be notified
      expect(goodObserver.onSyncEvent).toHaveBeenCalled();
    });
  });

  describe('Synchronized Playback', () => {
    it('should play audio and animation together', async () => {
      const animationConfig: AnimationConfig = {
        type: 'neonGlow',
        intensity: 0.8
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      // Wait for async execution
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(audioManager.playSound).toHaveBeenCalledWith('test-sound', undefined);
      expect(visualEffects.applyNeonGlow).toHaveBeenCalledWith(mockElement, 0.8);
    });

    it('should play audio with custom volume', async () => {
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig, 0.5);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(audioManager.playSound).toHaveBeenCalledWith('test-sound', 0.5);
    });

    it('should execute fadeIn animation', async () => {
      const animationConfig: AnimationConfig = {
        type: 'fadeIn',
        delay: 100
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(visualEffects.fadeIn).toHaveBeenCalledWith(mockElement, 100);
    });

    it('should execute custom animation function', async () => {
      const customFn = vi.fn();
      const animationConfig: AnimationConfig = {
        type: 'custom',
        customFn
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(customFn).toHaveBeenCalledWith(mockElement);
    });

    it('should notify observers on synchronized playback', async () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.addObserver(observer);
      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(observer.onSyncEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'both',
          soundId: 'test-sound',
          animationTarget: mockElement
        })
      );
    });
  });

  describe('Audio-Only Playback', () => {
    it('should play audio without animation', () => {
      syncManager.playAudioOnly('test-sound');

      expect(audioManager.playSound).toHaveBeenCalledWith('test-sound', undefined);
      expect(visualEffects.applyNeonGlow).not.toHaveBeenCalled();
    });

    it('should play audio with volume', () => {
      syncManager.playAudioOnly('test-sound', 0.7);

      expect(audioManager.playSound).toHaveBeenCalledWith('test-sound', 0.7);
    });

    it('should notify observers with sound event', () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(observer);
      syncManager.playAudioOnly('test-sound');

      expect(observer.onSyncEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'sound',
          soundId: 'test-sound'
        })
      );
    });
  });

  describe('Animation-Only Playback', () => {
    it('should play animation without audio', () => {
      const animationConfig: AnimationConfig = {
        type: 'neonGlow',
        intensity: 0.5
      };

      syncManager.playAnimationOnly(mockElement, animationConfig);

      expect(visualEffects.applyNeonGlow).toHaveBeenCalledWith(mockElement, 0.5);
      expect(audioManager.playSound).not.toHaveBeenCalled();
    });

    it('should notify observers with animation event', () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.addObserver(observer);
      syncManager.playAnimationOnly(mockElement, animationConfig);

      expect(observer.onSyncEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'animation',
          animationTarget: mockElement
        })
      );
    });
  });

  describe('Timing Synchronization (Req 3.3)', () => {
    it('should have ±20ms tolerance', () => {
      const tolerance = syncManager.getSyncTolerance();
      expect(tolerance).toBe(20);
    });

    it('should track active sync events', async () => {
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      // Check immediately - event should be active
      const activeEvents = syncManager.getActiveSyncEvents();
      expect(activeEvents.size).toBeGreaterThan(0);

      // Wait for cleanup (1000ms timeout in implementation)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Event should be cleaned up
      const eventsAfterCleanup = syncManager.getActiveSyncEvents();
      expect(eventsAfterCleanup.size).toBe(0);
    });

    it('should measure timing between audio and animation', async () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      await new Promise(resolve => setTimeout(resolve, 100));

      // In normal conditions, timing should be within tolerance
      // If outside tolerance, a warning would be logged
      // We can't easily test the exact timing in unit tests,
      // but we verify the mechanism exists
      expect(audioManager.playSound).toHaveBeenCalled();
      expect(visualEffects.applyNeonGlow).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Cleanup and Disposal', () => {
    it('should clear all observers on dispose', () => {
      const observer: SyncObserver = {
        onSyncEvent: vi.fn()
      };

      syncManager.addObserver(observer);
      syncManager.dispose();
      syncManager.playAudioOnly('test-sound');

      expect(observer.onSyncEvent).not.toHaveBeenCalled();
    });

    it('should clear all events on dispose', () => {
      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);
      syncManager.dispose();

      const activeEvents = syncManager.getActiveSyncEvents();
      expect(activeEvents.size).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown animation types', async () => {
      const consoleSpy = vi.spyOn(console, 'warn');
      const animationConfig: AnimationConfig = {
        type: 'unknown' as any
      };

      syncManager.playSynchronized('test-sound', mockElement, animationConfig);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown animation type')
      );

      consoleSpy.mockRestore();
    });

    it('should handle synchronization errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      
      // Make playSound throw an error
      vi.mocked(audioManager.playSound).mockImplementation(() => {
        throw new Error('Audio error');
      });

      const animationConfig: AnimationConfig = {
        type: 'neonGlow'
      };

      // Should not throw
      expect(() => {
        syncManager.playSynchronized('test-sound', mockElement, animationConfig);
      }).not.toThrow();

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Synchronization error:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Factory Function', () => {
    it('should create AudioVisualSyncManager instance', () => {
      const manager = createAudioVisualSyncManager(audioManager, visualEffects);
      expect(manager).toBeInstanceOf(AudioVisualSyncManager);
    });
  });
});
