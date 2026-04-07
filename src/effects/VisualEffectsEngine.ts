/**
 * Visual Effects Engine
 * Manages visual effects, animations, and neon glow effects
 * 
 * Requirements: 1.4, 2.1, 2.3, 2.5
 */

/**
 * Visual Effects Engine Interface
 * Handles rendering of visual effects, animations, and particles
 */
export interface VisualEffectsEngine {
  /** Initialize the effects engine */
  initialize(canvas: HTMLCanvasElement): void;
  
  /** Apply neon glow effect to an element */
  applyNeonGlow(element: HTMLElement, intensity: number): void;
  
  /** Enable parallax scrolling effect */
  enableParallax(elements: HTMLElement[], speed: number): void;
  
  /** Render particle effects */
  renderParticles(config: ParticleConfig): void;
  
  /** Animate element fade-in with delay */
  fadeIn(element: HTMLElement, delay: number): Promise<void>;
  
  /** Stop all effects */
  stopAll(): void;
  
  /** Get current frames per second */
  getFPS(): number;
}

/**
 * Particle Configuration
 */
export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  lifetime: number;
}

/**
 * Particle instance for rendering
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  lifetime: number;
  age: number;
}

/**
 * Default Visual Effects Engine Implementation
 */
export class DefaultVisualEffectsEngine implements VisualEffectsEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private particleAnimationId: number | null = null;
  private fps: number = 60;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateTime: number = 0;
  private animationFrameId: number | null = null;
  private hoverListeners: Map<HTMLElement, () => void> = new Map();
  private parallaxElements: Map<HTMLElement, number> = new Map();
  private scrollHandler: (() => void) | null = null;
  private rafId: number | null = null;
  private ticking: boolean = false;

  /**
   * Initialize the visual effects engine
   * @param canvas - Canvas element for particle effects
   */
  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) {
      console.warn('Canvas 2D context not available');
      return;
    }
    
    // Set canvas size to match display size
    this.resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', () => this.resizeCanvas());
    
    // Start FPS monitoring
    this.startFPSMonitoring();
  }

  /**
   * Resize canvas to match display size
   * @private
   */
  private resizeCanvas(): void {
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * Apply neon glow effect to an element (Req 1.4, 2.1)
   * Blur radius between 10-30px, hover animation < 100ms
   * @param element - HTML element to apply glow to
   * @param intensity - Glow intensity (0-1), affects blur radius
   */
  applyNeonGlow(element: HTMLElement, intensity: number): void {
    // Clamp intensity between 0 and 1
    const clampedIntensity = Math.max(0, Math.min(1, intensity));
    
    // Calculate blur radius: 10px (min) to 30px (max) based on intensity (Req 1.4)
    const blurRadius = 10 + (clampedIntensity * 20);
    
    // Get neon glow color from CSS variable or use default
    const glowColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-neon-glow').trim() || '#00ffff';
    
    // Apply base glow effect
    element.style.boxShadow = `0 0 ${blurRadius}px ${glowColor}`;
    element.style.transition = `box-shadow var(--transition-fast, 200ms) var(--easing, ease)`;
    
    // Add hover animation with < 100ms response time (Req 2.1)
    const hoverHandler = () => {
      // Increase glow on hover
      const hoverBlur = Math.min(30, blurRadius * 1.5);
      element.style.boxShadow = `0 0 ${hoverBlur}px ${glowColor}, 0 0 ${hoverBlur * 0.5}px ${glowColor}`;
    };
    
    const leaveHandler = () => {
      // Restore original glow
      element.style.boxShadow = `0 0 ${blurRadius}px ${glowColor}`;
    };
    
    // Remove existing listeners if any
    if (this.hoverListeners.has(element)) {
      const oldHandler = this.hoverListeners.get(element);
      if (oldHandler) {
        element.removeEventListener('mouseenter', oldHandler);
        element.removeEventListener('mouseleave', oldHandler);
      }
    }
    
    // Add new listeners
    element.addEventListener('mouseenter', hoverHandler);
    element.addEventListener('mouseleave', leaveHandler);
    this.hoverListeners.set(element, hoverHandler);
  }

  /**
   * Enable parallax scrolling effect (Req 2.2)
   * Applies parallax effect to background elements with throttled scroll listener
   * @param elements - Elements to apply parallax to
   * @param speed - Parallax speed multiplier (0-1, where 0.5 = half scroll speed)
   */
  enableParallax(elements: HTMLElement[], speed: number): void {
    // Clamp speed between 0 and 1
    const clampedSpeed = Math.max(0, Math.min(1, speed));
    
    // Store elements with their speed
    elements.forEach(element => {
      this.parallaxElements.set(element, clampedSpeed);
      // Store initial position
      element.dataset.parallaxInitialY = element.offsetTop.toString();
    });
    
    // Remove existing scroll handler if any
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    
    // Create throttled scroll handler using RequestAnimationFrame
    this.scrollHandler = () => {
      if (!this.ticking) {
        this.ticking = true;
        this.rafId = requestAnimationFrame(() => {
          this.updateParallaxPositions();
          this.ticking = false;
        });
      }
    };
    
    // Add scroll listener
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    
    // Initial position update
    this.updateParallaxPositions();
  }
  
  /**
   * Update parallax element positions based on scroll
   * @private
   */
  private updateParallaxPositions(): void {
    const scrollY = window.scrollY || window.pageYOffset;
    
    this.parallaxElements.forEach((speed, element) => {
      // Calculate parallax offset
      const offset = scrollY * speed;
      
      // Apply transform for better performance (GPU accelerated)
      element.style.transform = `translate3d(0, ${-offset}px, 0)`;
      element.style.willChange = 'transform';
    });
  }

  /**
   * Render particle effects (Req 2.4)
   * Creates cyberpunk-style particle animations using Canvas API
   * @param config - Particle configuration
   */
  renderParticles(config: ParticleConfig): void {
    if (!this.canvas || !this.ctx) {
      console.warn('Canvas not initialized');
      return;
    }
    
    // Stop existing particle animation if running
    if (this.particleAnimationId !== null) {
      cancelAnimationFrame(this.particleAnimationId);
      this.particleAnimationId = null;
    }
    
    // Clear existing particles
    this.particles = [];
    
    // Create particles
    for (let i = 0; i < config.count; i++) {
      this.particles.push(this.createParticle(config));
    }
    
    // Start animation loop
    this.animateParticles(config);
  }

  /**
   * Create a single particle with random properties
   * @private
   */
  private createParticle(config: ParticleConfig): Particle {
    if (!this.canvas) {
      throw new Error('Canvas not initialized');
    }
    
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      size: config.size * (0.5 + Math.random() * 0.5), // Vary size ±50%
      color: config.color,
      alpha: 0.5 + Math.random() * 0.5, // Random alpha 0.5-1.0
      lifetime: config.lifetime,
      age: 0
    };
  }

  /**
   * Animate particles using RequestAnimationFrame
   * @private
   */
  private animateParticles(config: ParticleConfig): void {
    if (!this.canvas || !this.ctx) return;
    
    const animate = () => {
      if (!this.canvas || !this.ctx) return;
      
      // Clear canvas with fade effect for trails
      this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'; // Dark background with transparency
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        if (!particle) continue;
        
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.age += 16; // Approximate frame time (60fps = ~16ms)
        
        // Wrap around screen edges (cyberpunk continuous effect)
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        // Calculate alpha based on lifetime
        const lifetimeRatio = particle.age / particle.lifetime;
        const currentAlpha = particle.alpha * (1 - lifetimeRatio);
        
        // Remove dead particles and create new ones
        if (particle.age >= particle.lifetime) {
          this.particles.splice(i, 1);
          this.particles.push(this.createParticle(config));
          continue;
        }
        
        // Draw particle with glow effect
        this.ctx.save();
        
        // Outer glow
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = particle.color;
        
        // Draw particle
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner bright core
        this.ctx.shadowBlur = 5;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = currentAlpha * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      }
      
      // Continue animation
      this.particleAnimationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  /**
   * Animate element fade-in with staggered delay (Req 2.3)
   * Uses smooth transitions 200-500ms (Req 2.5)
   * @param element - Element to fade in
   * @param delay - Delay before animation starts (ms)
   * @returns Promise that resolves when animation completes
   */
  fadeIn(element: HTMLElement, delay: number): Promise<void> {
    return new Promise((resolve) => {
      // Set initial state
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = `opacity var(--transition-normal, 500ms) var(--easing, ease), 
                                   transform var(--transition-normal, 500ms) var(--easing, ease)`;
      
      // Apply fade-in after delay
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        
        // Resolve promise after transition completes
        // Use transition-normal duration (500ms) + small buffer
        setTimeout(() => resolve(), 500);
      }, delay);
    });
  }

  /**
   * Stop all effects and clean up
   */
  stopAll(): void {
    // Stop FPS monitoring
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Stop particle animation
    if (this.particleAnimationId !== null) {
      cancelAnimationFrame(this.particleAnimationId);
      this.particleAnimationId = null;
    }
    
    // Stop parallax RAF
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    // Remove scroll listener
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    
    // Clear parallax elements
    this.parallaxElements.clear();
    this.ticking = false;
    
    // Clear particles
    this.particles = [];
    
    // Clear canvas
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Remove all hover listeners
    this.hoverListeners.forEach((handler, element) => {
      element.removeEventListener('mouseenter', handler);
      element.removeEventListener('mouseleave', handler);
    });
    this.hoverListeners.clear();
  }

  /**
   * Get current frames per second
   * @returns Current FPS
   */
  getFPS(): number {
    return this.fps;
  }

  /**
   * Start FPS monitoring using RequestAnimationFrame
   * @private
   */
  private startFPSMonitoring(): void {
    const updateFPS = (timestamp: number) => {
      // Calculate time since last frame
      if (this.lastFrameTime > 0) {
        this.frameCount++;
        
        // Update FPS every second
        if (timestamp - this.fpsUpdateTime >= 1000) {
          this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.fpsUpdateTime));
          this.frameCount = 0;
          this.fpsUpdateTime = timestamp;
        }
      } else {
        this.fpsUpdateTime = timestamp;
      }
      
      this.lastFrameTime = timestamp;
      this.animationFrameId = requestAnimationFrame(updateFPS);
    };
    
    this.animationFrameId = requestAnimationFrame(updateFPS);
  }
}

/**
 * Create and return a new Visual Effects Engine instance
 * @returns VisualEffectsEngine instance
 */
export function createVisualEffectsEngine(): VisualEffectsEngine {
  return new DefaultVisualEffectsEngine();
}
