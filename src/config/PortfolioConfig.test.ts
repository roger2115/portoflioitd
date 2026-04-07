import { describe, it, expect } from 'vitest';
import { getConfig, defaultConfig } from './PortfolioConfig';

describe('PortfolioConfig', () => {
  it('should return default configuration', () => {
    const config = getConfig();
    expect(config).toBeDefined();
    expect(config).toEqual(defaultConfig);
  });

  it('should have valid color palette', () => {
    const config = getConfig();
    expect(config.theme.colorPalette.primary).toBe('#00f3ff');
    expect(config.theme.colorPalette.secondary).toBe('#ff006e');
    expect(config.theme.colorPalette.accent).toBe('#8b00ff');
  });

  it('should have animation durations within spec', () => {
    const config = getConfig();
    expect(config.theme.animations.duration.fast).toBe(200);
    expect(config.theme.animations.duration.normal).toBe(500);
    expect(config.theme.animations.duration.slow).toBe(800);
  });

  it('should have all required sections', () => {
    const config = getConfig();
    const sectionIds = config.sections.map(s => s.id);
    expect(sectionIds).toContain('about');
    expect(sectionIds).toContain('gallery');
    expect(sectionIds).toContain('projects');
    expect(sectionIds).toContain('contact');
  });

  it('should have legal information with current year', () => {
    const config = getConfig();
    const currentYear = new Date().getFullYear();
    expect(config.legal.copyrightYear).toBe(currentYear);
    expect(config.legal.attributions.length).toBeGreaterThan(0);
  });

  it('should have font attributions', () => {
    const config = getConfig();
    const fontAttributions = config.legal.attributions.filter(a => a.type === 'font');
    expect(fontAttributions.length).toBeGreaterThanOrEqual(2);
  });
});
