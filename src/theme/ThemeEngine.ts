/**
 * Theme Engine
 * Manages visual theme, colors, and typography for the anime-cyberpunk portfolio
 * 
 * Requirements: 1.1, 1.3, 1.5
 */

import type { ColorPalette } from '../config/PortfolioConfig';

/**
 * Theme Engine Interface
 * Manages theme application and CSS variable manipulation
 */
export interface ThemeEngine {
  /** Initialize the theme engine */
  initialize(): void;
  
  /** Get a CSS variable value */
  getCSSVariable(name: string): string;
  
  /** Set a CSS variable value */
  setCSSVariable(name: string, value: string): void;
  
  /** Get the current color palette */
  getColorPalette(): ColorPalette;
  
  /** Apply theme to a specific element */
  applyTheme(element: HTMLElement): void;
}

/**
 * Default Theme Engine Implementation
 * Implements the ThemeEngine interface with neon-cyberpunk aesthetics
 */
export class DefaultThemeEngine implements ThemeEngine {
  private colorPalette: ColorPalette;
  private rootElement: HTMLElement;

  constructor(colorPalette?: ColorPalette) {
    // Anime color palette - blue and purple theme
    this.colorPalette = colorPalette ?? {
      primary: '#0074ff',      // Blue
      secondary: '#5d00ff',    // Purple
      accent: '#8b00ff',       // Purple accent
      background: '#0a0a0f',   // Dark background
      text: '#e0e0e0',         // Light text
      neonGlow: '#0074ff'      // Blue glow
    };
    
    this.rootElement = document.documentElement;
  }

  /**
   * Initialize the theme engine
   * Sets up CSS custom properties and applies anime-style typography (Req 1.3, 1.5)
   */
  initialize(): void {
    // Apply color palette to CSS variables
    this.setCSSVariable('--color-primary', this.colorPalette.primary);
    this.setCSSVariable('--color-secondary', this.colorPalette.secondary);
    this.setCSSVariable('--color-accent', this.colorPalette.accent);
    this.setCSSVariable('--color-background', this.colorPalette.background);
    this.setCSSVariable('--color-text', this.colorPalette.text);
    this.setCSSVariable('--color-neon-glow', this.colorPalette.neonGlow);

    // Apply anime-style typography (Req 1.3)
    // Sans-serif for body text
    this.setCSSVariable('--font-body', "'Inter', 'Roboto', sans-serif");
    // Stylized fonts for headings
    this.setCSSVariable('--font-heading', "'Orbitron', 'Rajdhani', sans-serif");
    
    // Set default font sizes
    this.setCSSVariable('--font-size-body', '16px');
    this.setCSSVariable('--font-size-heading-1', '3rem');
    this.setCSSVariable('--font-size-heading-2', '2.5rem');
    this.setCSSVariable('--font-size-heading-3', '2rem');
    
    // Apply neon glow parameters (Req 1.4)
    this.setCSSVariable('--neon-blur-min', '10px');
    this.setCSSVariable('--neon-blur-max', '30px');
    this.setCSSVariable('--neon-blur', '20px'); // Default blur
    
    // Apply transition durations (Req 2.5)
    this.setCSSVariable('--transition-fast', '200ms');
    this.setCSSVariable('--transition-normal', '500ms');
    this.setCSSVariable('--transition-slow', '800ms');
    
    // Apply easing function
    this.setCSSVariable('--easing', 'cubic-bezier(0.4, 0, 0.2, 1)');
  }

  /**
   * Get a CSS variable value from the root element
   * @param name - CSS variable name (with or without -- prefix)
   * @returns The CSS variable value
   */
  getCSSVariable(name: string): string {
    const varName = name.startsWith('--') ? name : `--${name}`;
    return getComputedStyle(this.rootElement).getPropertyValue(varName).trim();
  }

  /**
   * Set a CSS variable value on the root element
   * @param name - CSS variable name (with or without -- prefix)
   * @param value - CSS variable value
   */
  setCSSVariable(name: string, value: string): void {
    const varName = name.startsWith('--') ? name : `--${name}`;
    this.rootElement.style.setProperty(varName, value);
  }

  /**
   * Get the current color palette
   * @returns The color palette object
   */
  getColorPalette(): ColorPalette {
    return { ...this.colorPalette };
  }

  /**
   * Apply theme to a specific element
   * Useful for scoped theme application
   * @param element - HTML element to apply theme to
   */
  applyTheme(element: HTMLElement): void {
    // Apply color variables
    element.style.setProperty('--color-primary', this.colorPalette.primary);
    element.style.setProperty('--color-secondary', this.colorPalette.secondary);
    element.style.setProperty('--color-accent', this.colorPalette.accent);
    element.style.setProperty('--color-background', this.colorPalette.background);
    element.style.setProperty('--color-text', this.colorPalette.text);
    element.style.setProperty('--color-neon-glow', this.colorPalette.neonGlow);
  }
}

/**
 * Create and return a new Theme Engine instance
 * @param colorPalette - Optional custom color palette
 * @returns ThemeEngine instance
 */
export function createThemeEngine(colorPalette?: ColorPalette): ThemeEngine {
  return new DefaultThemeEngine(colorPalette);
}
