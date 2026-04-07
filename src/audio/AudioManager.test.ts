/**
 * Audio Manager Unit Tests
 * Tests for audio playback, preloading, and volume control
 * 
 * Requirements: 3.1, 3.2, 3.4, 3.5, 3.6
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DefaultAudioManager } from './AudioManager';
import type { AudioFile } from '../config/PortfolioConfig';

// Mock Web Audio API
class MockAudioContext {
  destination = {};
  state = 'running';
  
  createGain() {
    return {
      gain: { value: 1 },
      connect: vi.fn()
    };
  }
  
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
  }
  
  async decodeAudioData(_arrayBuffer: ArrayBuffer) {
    // Mock audio buffer
    return {
      duration: 1.0,
      length: 44100,
      numberOfChannels: 2,
      sampleRate: 44100
    };
  }
}

// Mock fetch
global.fetch = vi.fn(() => {
  return Promise.resolve({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
  } as Response);
}) as any;

// Setup Web Audio API mock
beforeEach(() => {
  (global as any).AudioContext = MockAudioContext;
  (global as any).webkitAudioContext = MockAudioContext;
});

describe('AudioManager', () => {
  describe('Initialization', () => {
    it('should initialize with empty audio files', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      expect(manager.isReady()).toBe(true);
      expect(manager.getLoadingProgress()).toBe(1.0); // 100% complete when no files to load
    });

    it('should preload audio files with progress tracking (Req 3.4)', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'click', url: '/sounds/click.mp3', type: 'effect', preload: true },
        { id: 'bgm', url: '/music/background.ogg', type: 'music', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      
      expect(manager.isReady()).toBe(true);
      expect(manager.getLoadingProgress()).toBe(1.0);
    });

    it('should skip non-preload files', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'click', url: '/sounds/click.mp3', type: 'effect', preload: true },
        { id: 'optional', url: '/sounds/optional.mp3', type: 'effect', preload: false }
      ];
      
      await manager.initialize(audioFiles);
      
      expect(manager.isReady()).toBe(true);
      // Only 1 file should be loaded (the preload one)
      expect(manager.getLoadingProgress()).toBe(1.0);
    });

    it('should support MP3 and OGG formats (Req 3.6)', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'mp3-sound', url: '/sounds/effect.mp3', type: 'effect', preload: true },
        { id: 'ogg-music', url: '/music/track.ogg', type: 'music', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      
      expect(manager.isReady()).toBe(true);
    });
  });

  describe('Sound Effects', () => {
    it('should play sound effect (Req 3.1)', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'click', url: '/sounds/click.mp3', type: 'effect', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      
      // Should not throw
      expect(() => manager.playSound('click')).not.toThrow();
    });

    it('should play sound with custom volume', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'click', url: '/sounds/click.mp3', type: 'effect', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      
      // Should not throw
      expect(() => manager.playSound('click', 0.5)).not.toThrow();
    });

    it('should handle missing sound gracefully', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      // Should not throw, just warn
      expect(() => manager.playSound('nonexistent')).not.toThrow();
    });
  });

  describe('Background Music', () => {
    it('should play background music with loop (Req 3.2)', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'bgm', url: '/music/background.mp3', type: 'music', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      
      expect(() => manager.playBackgroundMusic('bgm', true)).not.toThrow();
      expect(manager.getCurrentMusicId()).toBe('bgm');
    });

    it('should stop background music (Req 3.2)', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'bgm', url: '/music/background.mp3', type: 'music', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      manager.playBackgroundMusic('bgm', true);
      
      expect(() => manager.stopBackgroundMusic()).not.toThrow();
      expect(manager.getCurrentMusicId()).toBeNull();
    });

    it('should replace current music when playing new track', async () => {
      const manager = new DefaultAudioManager();
      const audioFiles: AudioFile[] = [
        { id: 'bgm1', url: '/music/track1.mp3', type: 'music', preload: true },
        { id: 'bgm2', url: '/music/track2.mp3', type: 'music', preload: true }
      ];
      
      await manager.initialize(audioFiles);
      manager.playBackgroundMusic('bgm1', true);
      manager.playBackgroundMusic('bgm2', true);
      
      expect(manager.getCurrentMusicId()).toBe('bgm2');
    });
  });

  describe('Volume Control', () => {
    it('should set global volume (Req 3.2)', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      manager.setVolume(0.5);
      expect(manager.getVolume()).toBe(0.5);
    });

    it('should clamp volume between 0 and 1', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      manager.setVolume(1.5);
      expect(manager.getVolume()).toBe(1.0);
      
      manager.setVolume(-0.5);
      expect(manager.getVolume()).toBe(0.0);
    });
  });

  describe('Mute/Unmute', () => {
    it('should mute audio (Req 3.5)', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      manager.mute(true);
      expect(manager.isMutedState()).toBe(true);
    });

    it('should unmute audio (Req 3.5)', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      manager.mute(true);
      manager.mute(false);
      expect(manager.isMutedState()).toBe(false);
    });

    it('should preserve volume when muting/unmuting', async () => {
      const manager = new DefaultAudioManager();
      await manager.initialize([]);
      
      manager.setVolume(0.7);
      manager.mute(true);
      manager.mute(false);
      
      expect(manager.getVolume()).toBe(0.7);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization failure gracefully', async () => {
      // Mock AudioContext to throw error
      (global as any).AudioContext = class {
        constructor() {
          throw new Error('AudioContext not supported');
        }
      };
      
      const manager = new DefaultAudioManager();
      
      await expect(manager.initialize([])).rejects.toThrow();
      expect(manager.isReady()).toBe(false);
    });

    it('should not play sound when not initialized', () => {
      const manager = new DefaultAudioManager();
      
      // Should not throw, just warn
      expect(() => manager.playSound('test')).not.toThrow();
    });

    it('should not play music when not initialized', () => {
      const manager = new DefaultAudioManager();
      
      // Should not throw, just warn
      expect(() => manager.playBackgroundMusic('test', true)).not.toThrow();
    });
  });
});
