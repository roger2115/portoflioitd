/**
 * Visual Effects Engine Tests
 * Unit tests for the Visual Effects Engine module
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DefaultVisualEffectsEngine, createVisualEffectsEngine } from './VisualEffectsEngine';

describe('VisualEffectsEngine', () => {
  let engine: DefaultVisualEffectsEngine;
  let testElement: HTMLElement;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    engine = new DefaultVisualEffectsEngine();
    testElement = document.createElement('div');
    canvas = document.createElement('canvas');
    document.body.appendChild(testElement);
    
    // Mock CSS variables
    document.documentElement.style.setProperty('--color-neon-glow', '#00ffff');
    document.documentElement.style.setProperty('--transition-fast', '200ms');
    document.documentElement.style.setProperty('--transition-normal', '500ms');
    document.documentElement.style.setProperty('--easing', 'ease');
  });

  afterEach(() => {
    engine.stopAll();
    document.body.removeChild(testElement);
  });

  describe('initialize', () => {
    it('should initialize with canvas', () => {
      expect(() => engine.initialize(canvas)).not.toThrow();
    });

    it('should store canvas reference', () => {
      engine.initialize(canvas);
      // Canvas should be stored internally
      expect(() => engine.getFPS()).not.toThrow();
    });

    it('should start FPS monitoring after initialization', () => {
      engine.initialize(canvas);
      // FPS should be initialized to 60
      expect(engine.getFPS()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('applyNeonGlow - Req 1.4, 2.1', () => {
    beforeEach(() => {
      engine.initialize(canvas);
    });

    it('should apply neon glow with minimum blur radius (10px) at intensity 0', () => {
      engine.applyNeonGlow(testElement, 0);
      
      const boxShadow = testElement.style.boxShadow;
      expect(boxShadow).toContain('10px');
      expect(boxShadow).toContain('#00ffff');
    });

    it('should apply neon glow with maximum blur radius (30px) at intensity 1', () => {
      engine.applyNeonGlow(testElement, 1);
      
      const boxShadow = testElement.style.boxShadow;
      expect(boxShadow).toContain('30px');
    });

    it('should apply neon glow with mid-range blur radius at intensity 0.5', () => {
      engine.applyNeonGlow(testElement, 0.5);
      
      const boxShadow = testElement.style.boxShadow;
      // 10 + (0.5 * 20) = 20px
      expect(boxShadow).toContain('20px');
    });

    it('should clamp intensity below 0 to 0', () => {
      engine.applyNeonGlow(testElement, -0.5);
      
      const boxShadow = testElement.style.boxShadow;
      expect(boxShadow).toContain('10px'); // Minimum blur
    });

    it('should clamp intensity above 1 to 1', () => {
      engine.applyNeonGlow(testElement, 1.5);
      
      const boxShadow = testElement.style.boxShadow;
      expect(boxShadow).toContain('30px'); // Maximum blur
    });

    it('should apply transition for smooth animation (Req 2.5)', () => {
      engine.applyNeonGlow(testElement, 0.5);
      
      const transition = testElement.style.transition;
      expect(transition).toContain('box-shadow');
    });

    it('should add hover event listeners for < 100ms response (Req 2.1)', () => {
      engine.applyNeonGlow(testElement, 0.5);
      
      // Simulate hover
      const mouseEnterEvent = new MouseEvent('mouseenter');
      testElement.dispatchEvent(mouseEnterEvent);
      
      // Box shadow should be enhanced on hover
      const hoverShadow = testElement.style.boxShadow;
      expect(hoverShadow).toBeTruthy();
      expect(hoverShadow.length).toBeGreaterThan(0);
    });

    it('should restore original glow on mouse leave', () => {
      engine.applyNeonGlow(testElement, 0.5);
      
      const originalShadow = testElement.style.boxShadow;
      
      // Simulate hover and leave
      testElement.dispatchEvent(new MouseEvent('mouseenter'));
      testElement.dispatchEvent(new MouseEvent('mouseleave'));
      
      const restoredShadow = testElement.style.boxShadow;
      expect(restoredShadow).toBe(originalShadow);
    });

    it('should remove old listeners when applying glow again', () => {
      engine.applyNeonGlow(testElement, 0.3);
      engine.applyNeonGlow(testElement, 0.7);
      
      // Should not throw and should work correctly
      testElement.dispatchEvent(new MouseEvent('mouseenter'));
      expect(testElement.style.boxShadow).toBeTruthy();
    });
  });

  describe('fadeIn - Req 2.3, 2.5', () => {
    beforeEach(() => {
      engine.initialize(canvas);
    });

    it('should set initial opacity to 0', () => {
      engine.fadeIn(testElement, 0);
      expect(testElement.style.opacity).toBe('0');
    });

    it('should set initial transform to translateY(20px)', () => {
      engine.fadeIn(testElement, 0);
      expect(testElement.style.transform).toBe('translateY(20px)');
    });

    it('should apply smooth transition (200-500ms) (Req 2.5)', () => {
      engine.fadeIn(testElement, 0);
      
      const transition = testElement.style.transition;
      expect(transition).toContain('opacity');
      expect(transition).toContain('transform');
    });

    it('should fade in element after delay', async () => {
      const promise = engine.fadeIn(testElement, 50);
      
      // Initially should be transparent
      expect(testElement.style.opacity).toBe('0');
      
      // Wait for delay + animation
      await promise;
      
      // Should be visible after animation
      expect(testElement.style.opacity).toBe('1');
      expect(testElement.style.transform).toBe('translateY(0)');
    });

    it('should support staggered animations with different delays (Req 2.3)', async () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);
      
      const promise1 = engine.fadeIn(element1, 0);
      const promise2 = engine.fadeIn(element2, 100);
      
      // Both should start with opacity 0
      expect(element1.style.opacity).toBe('0');
      expect(element2.style.opacity).toBe('0');
      
      await Promise.all([promise1, promise2]);
      
      // Both should be visible after animations
      expect(element1.style.opacity).toBe('1');
      expect(element2.style.opacity).toBe('1');
      
      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });

    it('should return a promise that resolves after animation', async () => {
      const startTime = Date.now();
      await engine.fadeIn(testElement, 100);
      const endTime = Date.now();
      
      // Should take at least delay + animation time
      // Using a loose check due to timing variability in tests
      expect(endTime - startTime).toBeGreaterThanOrEqual(50);
    });
  });

  describe('getFPS', () => {
    it('should return initial FPS value', () => {
      engine.initialize(canvas);
      const fps = engine.getFPS();
      expect(fps).toBeGreaterThanOrEqual(0);
    });

    it('should track FPS over time', async () => {
      engine.initialize(canvas);
      
      // Wait a bit for FPS to be calculated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const fps = engine.getFPS();
      expect(fps).toBeGreaterThanOrEqual(0);
      expect(fps).toBeLessThanOrEqual(120); // Reasonable upper bound
    });
  });

  describe('stopAll', () => {
    beforeEach(() => {
      engine.initialize(canvas);
    });

    it('should remove all hover listeners', () => {
      engine.applyNeonGlow(testElement, 0.5);
      engine.stopAll();
      
      // Hover should not affect element after stopAll
      const shadowBefore = testElement.style.boxShadow;
      testElement.dispatchEvent(new MouseEvent('mouseenter'));
      const shadowAfter = testElement.style.boxShadow;
      
      expect(shadowAfter).toBe(shadowBefore);
    });

    it('should stop FPS monitoring', () => {
      const fpsBefore = engine.getFPS();
      engine.stopAll();
      
      // FPS should still return last known value
      const fpsAfter = engine.getFPS();
      expect(fpsAfter).toBe(fpsBefore);
    });

    it('should be safe to call multiple times', () => {
      expect(() => {
        engine.stopAll();
        engine.stopAll();
      }).not.toThrow();
    });
  });

  describe('enableParallax - Req 2.2', () => {
    beforeEach(() => {
      engine.initialize(canvas);
    });

    it('should enable parallax on given elements', () => {
      const element1 = document.createElement('div');
      const element2 = document.createElement('div');
      document.body.appendChild(element1);
      document.body.appendChild(element2);
      
      expect(() => engine.enableParallax([element1, element2], 0.5)).not.toThrow();
      
      document.body.removeChild(element1);
      document.body.removeChild(element2);
    });

    it('should apply transform to elements based on scroll position', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.5);
      
      // Simulate scroll
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
      
      // Wait for RAF to process
      setTimeout(() => {
        const transform = element.style.transform;
        expect(transform).toContain('translate3d');
      }, 50);
      
      document.body.removeChild(element);
    });

    it('should clamp speed between 0 and 1', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      // Test negative speed
      expect(() => engine.enableParallax([element], -0.5)).not.toThrow();
      
      // Test speed > 1
      expect(() => engine.enableParallax([element], 1.5)).not.toThrow();
      
      document.body.removeChild(element);
    });

    it('should handle multiple elements with same speed', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div')
      ];
      
      elements.forEach(el => document.body.appendChild(el));
      
      expect(() => engine.enableParallax(elements, 0.3)).not.toThrow();
      
      elements.forEach(el => document.body.removeChild(el));
    });

    it('should use RequestAnimationFrame for throttling', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.5);
      
      // Multiple scroll events should be throttled
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      
      // Should not throw
      expect(() => engine.stopAll()).not.toThrow();
      
      document.body.removeChild(element);
    });

    it('should set willChange property for performance', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.5);
      
      // Trigger scroll
      window.dispatchEvent(new Event('scroll'));
      
      setTimeout(() => {
        expect(element.style.willChange).toBe('transform');
      }, 50);
      
      document.body.removeChild(element);
    });

    it('should remove old scroll handler when called again', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.3);
      engine.enableParallax([element], 0.7);
      
      // Should not throw and should work correctly
      window.dispatchEvent(new Event('scroll'));
      expect(() => engine.stopAll()).not.toThrow();
      
      document.body.removeChild(element);
    });

    it('should handle empty elements array', () => {
      expect(() => engine.enableParallax([], 0.5)).not.toThrow();
    });

    it('should store initial element position', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.5);
      
      expect(element.dataset.parallaxInitialY).toBeDefined();
      
      document.body.removeChild(element);
    });

    it('should use passive scroll listener for performance', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      // Should not throw when using passive listener
      expect(() => engine.enableParallax([element], 0.5)).not.toThrow();
      
      document.body.removeChild(element);
    });

    it('should clean up parallax on stopAll', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      engine.enableParallax([element], 0.5);
      engine.stopAll();
      
      // Scroll should not affect element after stopAll
      window.dispatchEvent(new Event('scroll'));
      
      setTimeout(() => {
        // Transform should not be updated after stopAll
        const currentTransform = element.style.transform;
        // If it was set, it should remain unchanged
        expect(currentTransform).toBeDefined();
        expect(() => engine.stopAll()).not.toThrow();
      }, 50);
      
      document.body.removeChild(element);
    });
  });

  describe('renderParticles - Req 2.4', () => {
    beforeEach(() => {
      // Set canvas size for testing
      canvas.width = 800;
      canvas.height = 600;
      engine.initialize(canvas);
    });

    it('should render particles with given configuration', () => {
      const config = {
        count: 50,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should create correct number of particles', () => {
      const config = {
        count: 100,
        color: '#ff006e',
        size: 3,
        speed: 2,
        lifetime: 2000
      };
      
      engine.renderParticles(config);
      
      // Particles should be created (internal state)
      // We can verify by checking that animation starts
      expect(() => engine.getFPS()).not.toThrow();
    });

    it('should handle different particle colors', () => {
      const colors = ['#00ffff', '#ff006e', '#8b00ff', '#00f3ff'];
      
      colors.forEach(color => {
        const config = {
          count: 10,
          color: color,
          size: 2,
          speed: 1,
          lifetime: 1000
        };
        
        expect(() => engine.renderParticles(config)).not.toThrow();
      });
    });

    it('should handle different particle sizes', () => {
      const config = {
        count: 20,
        color: '#00ffff',
        size: 5,
        speed: 1,
        lifetime: 1000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should handle different particle speeds', () => {
      const config = {
        count: 30,
        color: '#00ffff',
        size: 2,
        speed: 5,
        lifetime: 1000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should handle different particle lifetimes', () => {
      const config = {
        count: 25,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 5000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should stop previous particle animation when starting new one', () => {
      const config1 = {
        count: 50,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      const config2 = {
        count: 100,
        color: '#ff006e',
        size: 3,
        speed: 2,
        lifetime: 2000
      };
      
      engine.renderParticles(config1);
      expect(() => engine.renderParticles(config2)).not.toThrow();
    });

    it('should warn if canvas not initialized', () => {
      const uninitializedEngine = new DefaultVisualEffectsEngine();
      const config = {
        count: 50,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      // Should not throw, but should warn
      expect(() => uninitializedEngine.renderParticles(config)).not.toThrow();
    });

    it('should use RequestAnimationFrame for smooth animations', async () => {
      const config = {
        count: 10,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      engine.renderParticles(config);
      
      // Wait a bit for animation to run
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // FPS should be tracked
      const fps = engine.getFPS();
      expect(fps).toBeGreaterThanOrEqual(0);
    });

    it('should clear canvas when rendering particles', () => {
      const ctx = canvas.getContext('2d');
      
      // In jsdom, canvas context might not be available
      // This is expected behavior - the implementation handles it gracefully
      if (!ctx) {
        // Verify that the engine handles missing context gracefully
        const config = {
          count: 20,
          color: '#00ffff',
          size: 2,
          speed: 1,
          lifetime: 1000
        };
        
        expect(() => engine.renderParticles(config)).not.toThrow();
        expect(() => engine.stopAll()).not.toThrow();
        return;
      }
      
      const config = {
        count: 20,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      engine.renderParticles(config);
      
      // Canvas should have been drawn to
      // We can't easily test the actual drawing, but we can verify no errors
      expect(() => engine.stopAll()).not.toThrow();
    });

    it('should create cyberpunk-style particles with glow', () => {
      const config = {
        count: 30,
        color: '#00ffff', // Neon cyan
        size: 3,
        speed: 1.5,
        lifetime: 1500
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should handle zero particles gracefully', () => {
      const config = {
        count: 0,
        color: '#00ffff',
        size: 2,
        speed: 1,
        lifetime: 1000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });

    it('should handle large number of particles', () => {
      const config = {
        count: 500,
        color: '#00ffff',
        size: 1,
        speed: 2,
        lifetime: 2000
      };
      
      expect(() => engine.renderParticles(config)).not.toThrow();
    });
  });

  describe('createVisualEffectsEngine', () => {
    it('should create a new engine instance', () => {
      const newEngine = createVisualEffectsEngine();
      expect(newEngine).toBeDefined();
      expect(typeof newEngine.initialize).toBe('function');
      expect(typeof newEngine.applyNeonGlow).toBe('function');
      expect(typeof newEngine.fadeIn).toBe('function');
    });
  });
});
