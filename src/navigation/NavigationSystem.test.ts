/**
 * Navigation System Tests
 * Tests for navigation, smooth scrolling, and section highlighting
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DefaultNavigationSystem, type Section } from './NavigationSystem';

describe('NavigationSystem', () => {
  let navSystem: DefaultNavigationSystem;
  let mockSections: Section[];

  beforeEach(() => {
    navSystem = new DefaultNavigationSystem();
    
    // Create mock sections
    mockSections = [
      { id: 'about', title: 'About', element: document.createElement('section') },
      { id: 'gallery', title: 'Gallery', element: document.createElement('section') },
      { id: 'projects', title: 'Projects', element: document.createElement('section') },
      { id: 'contact', title: 'Contact', element: document.createElement('section') }
    ];

    mockSections.forEach(section => {
      section.element.id = section.id;
      document.body.appendChild(section.element);
    });

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      callback
    }));

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    navSystem.destroy();
    mockSections.forEach(section => {
      document.body.removeChild(section.element);
    });
  });

  describe('initialize', () => {
    it('should initialize with sections', () => {
      expect(() => navSystem.initialize(mockSections)).not.toThrow();
    });

    it('should set up Intersection Observer', () => {
      navSystem.initialize(mockSections);
      expect(global.IntersectionObserver).toHaveBeenCalled();
    });
  });

  describe('navigateTo', () => {
    beforeEach(() => {
      navSystem.initialize(mockSections);
    });

    it('should navigate to valid section', () => {
      const element = mockSections[0]?.element;
      navSystem.navigateTo('about', true);
      expect(element?.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      });
    });

    it('should handle invalid section gracefully', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo');
      navSystem.navigateTo('nonexistent', true);
      expect(scrollToSpy).toHaveBeenCalled();
    });

    it('should use smooth scroll when smooth=true', () => {
      const element = mockSections[1]?.element;
      navSystem.navigateTo('gallery', true);
      expect(element?.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      );
    });

    it('should use instant scroll when smooth=false', () => {
      const element = mockSections[2]?.element;
      navSystem.navigateTo('projects', false);
      expect(element?.scrollIntoView).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'auto' })
      );
    });
  });

  describe('getCurrentSection', () => {
    it('should return empty string initially', () => {
      expect(navSystem.getCurrentSection()).toBe('');
    });

    it('should return current section after navigation', () => {
      navSystem.initialize(mockSections);
      navSystem['setCurrentSection']('about');
      expect(navSystem.getCurrentSection()).toBe('about');
    });
  });

  describe('onSectionChange', () => {
    it('should register callback', () => {
      const callback = vi.fn();
      navSystem.onSectionChange(callback);
      
      navSystem.initialize(mockSections);
      navSystem['setCurrentSection']('gallery');
      
      expect(callback).toHaveBeenCalledWith('gallery');
    });

    it('should call multiple callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      navSystem.onSectionChange(callback1);
      navSystem.onSectionChange(callback2);
      
      navSystem.initialize(mockSections);
      navSystem['setCurrentSection']('projects');
      
      expect(callback1).toHaveBeenCalledWith('projects');
      expect(callback2).toHaveBeenCalledWith('projects');
    });
  });

  describe('toggleMobileMenu', () => {
    beforeEach(() => {
      // Create mobile menu elements
      const navMenu = document.createElement('ul');
      navMenu.className = 'nav-menu';
      document.body.appendChild(navMenu);

      const menuToggle = document.createElement('button');
      menuToggle.className = 'mobile-menu-toggle';
      document.body.appendChild(menuToggle);
    });

    it('should open mobile menu', () => {
      navSystem.toggleMobileMenu(true);
      const navMenu = document.querySelector('.nav-menu');
      expect(navMenu?.classList.contains('open')).toBe(true);
    });

    it('should close mobile menu', () => {
      navSystem.toggleMobileMenu(true);
      navSystem.toggleMobileMenu(false);
      const navMenu = document.querySelector('.nav-menu');
      expect(navMenu?.classList.contains('open')).toBe(false);
    });

    it('should update aria-expanded attribute', () => {
      navSystem.toggleMobileMenu(true);
      const menuToggle = document.querySelector('.mobile-menu-toggle');
      expect(menuToggle?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('destroy', () => {
    it('should disconnect observer and clear callbacks', () => {
      const mockDisconnect = vi.fn();
      navSystem['intersectionObserver'] = {
        disconnect: mockDisconnect,
        observe: vi.fn(),
        unobserve: vi.fn()
      } as any;

      const callback = vi.fn();
      navSystem.onSectionChange(callback);

      navSystem.destroy();

      expect(mockDisconnect).toHaveBeenCalled();
      expect(navSystem['intersectionObserver']).toBeNull();
      expect(navSystem['sectionChangeCallbacks']).toHaveLength(0);
    });
  });
});
