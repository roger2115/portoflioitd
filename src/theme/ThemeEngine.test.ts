/**
 * Theme Engine Unit Tests
 * Tests for Theme Engine implementation
 * 
 * Requirements: 1.1, 1.3
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DefaultThemeEngine, createThemeEngine } from './ThemeEngine';
import type { ColorPalette } from '../config/PortfolioConfig';

describe('ThemeEngine', () => {
  let themeEngine: DefaultThemeEngine;
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a fresh theme engine for each test
    themeEngine = new DefaultThemeEngine();
    
    // Create a mock element for testing
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
  });

  describe('initialization', () => {
    it('should initialize with default neon-cyberpunk color palette (Req 1.1)', () => {
      themeEngine.initialize();
      
      const palette = themeEngine.getColorPalette();
      
      // Verify neon-cyberpunk colors
      expect(palette.primary).toBe('#00f3ff');    // Electric blue
      expect(palette.secondary).toBe('#ff006e');  // Hot pink
      expect(palette.accent).toBe('#8b00ff');     // Purple
      expect(palette.background).toBe('#0a0a0f'); // Dark
      expect(palette.text).toBe('#e0e0e0');       // Light
      expect(palette.neonGlow).toBe('#00ffff');   // Cyan
    });

    it('should initialize with custom color palette', () => {
      const customPalette: ColorPalette = {
        primary: '#ff0000',
        secondary: '#00ff00',
        accent: '#0000ff',
        background: '#000000',
        text: '#ffffff',
        neonGlow: '#ffff00'
      };
      
      const customEngine = new DefaultThemeEngine(customPalette);
      customEngine.initialize();
      
      const palette = customEngine.getColorPalette();
      expect(palette.primary).toBe('#ff0000');
      expect(palette.secondary).toBe('#00ff00');
      expect(palette.accent).toBe('#0000ff');
    });

    it('should apply anime-style typography (Req 1.3)', () => {
      themeEngine.initialize();
      
      // Check body font (sans-serif)
      const bodyFont = themeEngine.getCSSVariable('--font-body');
      expect(bodyFont).toContain('sans-serif');
      expect(bodyFont.toLowerCase()).toMatch(/inter|roboto/);
      
      // Check heading font (stylized)
      const headingFont = themeEngine.getCSSVariable('--font-heading');
      expect(headingFont.toLowerCase()).toMatch(/orbitron|rajdhani/);
    });

    it('should set CSS variables for colors', () => {
      themeEngine.initialize();
      
      expect(themeEngine.getCSSVariable('--color-primary')).toBe('#00f3ff');
      expect(themeEngine.getCSSVariable('--color-secondary')).toBe('#ff006e');
      expect(themeEngine.getCSSVariable('--color-accent')).toBe('#8b00ff');
    });

    it('should set CSS variables for neon blur parameters', () => {
      themeEngine.initialize();
      
      const blurMin = themeEngine.getCSSVariable('--neon-blur-min');
      const blurMax = themeEngine.getCSSVariable('--neon-blur-max');
      
      expect(blurMin).toBe('10px');
      expect(blurMax).toBe('30px');
    });

    it('should set CSS variables for transition durations', () => {
      themeEngine.initialize();
      
      expect(themeEngine.getCSSVariable('--transition-fast')).toBe('200ms');
      expect(themeEngine.getCSSVariable('--transition-normal')).toBe('500ms');
      expect(themeEngine.getCSSVariable('--transition-slow')).toBe('800ms');
    });
  });

  describe('getCSSVariable', () => {
    it('should get CSS variable value with -- prefix', () => {
      themeEngine.setCSSVariable('--test-var', 'test-value');
      expect(themeEngine.getCSSVariable('--test-var')).toBe('test-value');
    });

    it('should get CSS variable value without -- prefix', () => {
      themeEngine.setCSSVariable('--test-var', 'test-value');
      expect(themeEngine.getCSSVariable('test-var')).toBe('test-value');
    });

    it('should return empty string for non-existent variable', () => {
      const value = themeEngine.getCSSVariable('--non-existent');
      expect(value).toBe('');
    });
  });

  describe('setCSSVariable', () => {
    it('should set CSS variable with -- prefix', () => {
      themeEngine.setCSSVariable('--custom-color', '#123456');
      expect(themeEngine.getCSSVariable('--custom-color')).toBe('#123456');
    });

    it('should set CSS variable without -- prefix', () => {
      themeEngine.setCSSVariable('custom-color', '#654321');
      expect(themeEngine.getCSSVariable('--custom-color')).toBe('#654321');
    });

    it('should update existing CSS variable', () => {
      themeEngine.setCSSVariable('--test-var', 'value1');
      expect(themeEngine.getCSSVariable('--test-var')).toBe('value1');
      
      themeEngine.setCSSVariable('--test-var', 'value2');
      expect(themeEngine.getCSSVariable('--test-var')).toBe('value2');
    });
  });

  describe('getColorPalette', () => {
    it('should return a copy of the color palette', () => {
      const palette1 = themeEngine.getColorPalette();
      const palette2 = themeEngine.getColorPalette();
      
      // Should be equal but not the same reference
      expect(palette1).toEqual(palette2);
      expect(palette1).not.toBe(palette2);
    });

    it('should not allow mutation of internal palette', () => {
      const palette = themeEngine.getColorPalette();
      palette.primary = '#000000';
      
      // Internal palette should remain unchanged
      const internalPalette = themeEngine.getColorPalette();
      expect(internalPalette.primary).toBe('#00f3ff');
    });
  });

  describe('applyTheme', () => {
    it('should apply theme colors to a specific element', () => {
      themeEngine.initialize();
      themeEngine.applyTheme(mockElement);
      
      const styles = mockElement.style;
      expect(styles.getPropertyValue('--color-primary')).toBe('#00f3ff');
      expect(styles.getPropertyValue('--color-secondary')).toBe('#ff006e');
      expect(styles.getPropertyValue('--color-accent')).toBe('#8b00ff');
    });

    it('should apply all color variables to element', () => {
      themeEngine.applyTheme(mockElement);
      
      const styles = mockElement.style;
      expect(styles.getPropertyValue('--color-background')).toBe('#0a0a0f');
      expect(styles.getPropertyValue('--color-text')).toBe('#e0e0e0');
      expect(styles.getPropertyValue('--color-neon-glow')).toBe('#00ffff');
    });
  });

  describe('createThemeEngine factory', () => {
    it('should create a theme engine with default palette', () => {
      const engine = createThemeEngine();
      const palette = engine.getColorPalette();
      
      expect(palette.primary).toBe('#00f3ff');
      expect(palette.secondary).toBe('#ff006e');
    });

    it('should create a theme engine with custom palette', () => {
      const customPalette: ColorPalette = {
        primary: '#aabbcc',
        secondary: '#ddeeff',
        accent: '#112233',
        background: '#445566',
        text: '#778899',
        neonGlow: '#aabbcc'
      };
      
      const engine = createThemeEngine(customPalette);
      const palette = engine.getColorPalette();
      
      expect(palette.primary).toBe('#aabbcc');
      expect(palette.secondary).toBe('#ddeeff');
    });
  });
});
