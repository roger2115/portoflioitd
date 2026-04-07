/**
 * Navigation System
 * Manages navigation between sections with smooth scrolling and active section highlighting
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.5, 4.3, 5.3, 7.4
 */

export interface Section {
  id: string;
  title: string;
  element: HTMLElement;
}

export interface NavigationSystem {
  initialize(sections: Section[]): void;
  navigateTo(sectionId: string, smooth: boolean): void;
  getCurrentSection(): string;
  onSectionChange(callback: (sectionId: string) => void): void;
  toggleMobileMenu(show: boolean): void;
}

export class DefaultNavigationSystem implements NavigationSystem {
  private sections: Section[] = [];
  private currentSection: string = '';
  private sectionChangeCallbacks: Array<(sectionId: string) => void> = [];
  private intersectionObserver: IntersectionObserver | null = null;
  private mobileMenuOpen: boolean = false;

  initialize(sections: Section[]): void {
    this.sections = sections;
    
    // Set up Intersection Observer for active section detection (Req 7.3)
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            this.setCurrentSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all sections
    sections.forEach(section => {
      this.intersectionObserver?.observe(section.element);
    });

    // Set up navigation links
    this.setupNavigationLinks();
    
    // Set up mobile menu
    this.setupMobileMenu();
  }

  navigateTo(sectionId: string, smooth: boolean = true): void {
    const section = this.sections.find(s => s.id === sectionId);
    if (!section) {
      console.warn(`Section not found: ${sectionId}`);
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      return;
    }

    // Smooth scroll with <= 800ms duration (Req 7.2)
    section.element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start'
    });

    // Close mobile menu after navigation
    if (this.mobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }

  getCurrentSection(): string {
    return this.currentSection;
  }

  onSectionChange(callback: (sectionId: string) => void): void {
    this.sectionChangeCallbacks.push(callback);
  }

  toggleMobileMenu(show: boolean): void {
    this.mobileMenuOpen = show;
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navMenu) {
      if (show) {
        navMenu.classList.add('open');
      } else {
        navMenu.classList.remove('open');
      }
    }
    
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', show.toString());
    }
  }

  private setCurrentSection(sectionId: string): void {
    if (this.currentSection === sectionId) return;
    
    this.currentSection = sectionId;
    
    // Update active link highlighting (Req 7.3)
    this.updateActiveLink(sectionId);
    
    // Notify callbacks
    this.sectionChangeCallbacks.forEach(callback => callback(sectionId));
  }

  private updateActiveLink(sectionId: string): void {
    // Remove active class from all links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current section link
    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  private setupNavigationLinks(): void {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const sectionId = href.substring(1);
          this.navigateTo(sectionId, true);
        }
      });
    });
  }

  private setupMobileMenu(): void {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        this.toggleMobileMenu(!this.mobileMenuOpen);
      });
    }
  }

  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    this.sectionChangeCallbacks = [];
  }
}

export function createNavigationSystem(): NavigationSystem {
  return new DefaultNavigationSystem();
}
