/**
 * Content Gallery Manager
 * Manages gallery images with lazy loading, lightbox, and filtering
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 2.6
 */

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  alt: string;
  link?: string;
}

export interface ContentGalleryManager {
  initialize(items: GalleryItem[]): void;
  loadImages(viewport: HTMLElement): void;
  openLightbox(itemId: string): void;
  closeLightbox(): void;
  filterByCategory(category: string): void;
  getCategories(): string[];
}

export class DefaultContentGalleryManager implements ContentGalleryManager {
  private items: GalleryItem[] = [];
  private filteredItems: GalleryItem[] = [];
  private intersectionObserver: IntersectionObserver | null = null;
  private currentLightboxItem: string | null = null;
  private lightboxElement: HTMLElement | null = null;

  initialize(items: GalleryItem[]): void {
    this.items = items;
    this.filteredItems = [...items];
    
    // Set up Intersection Observer for lazy loading (Req 6.2)
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              // Load WebP with JPEG fallback (Req 6.1)
              this.loadImageWithFallback(img, src);
              this.intersectionObserver?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    // Create lightbox element
    this.createLightbox();
    
    // Set up keyboard navigation
    this.setupKeyboardNavigation();
    
    // Render gallery items
    this.renderGallery();
  }
  
  private renderGallery(): void {
    const container = document.querySelector('.gallery-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    this.filteredItems.forEach(item => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.setAttribute('data-category', item.category);
      galleryItem.style.transition = 'all 0.3s ease';
      
      galleryItem.innerHTML = `
        <img data-src="${item.thumbnailUrl}" alt="${item.alt}" />
        <div class="gallery-item-overlay">
          <h3 class="gallery-item-title">${item.title}</h3>
          ${item.link ? `<a href="${item.link}" class="gallery-link" target="_blank" rel="noopener">Zobacz Projekt →</a>` : ''}
        </div>
      `;
      
      galleryItem.addEventListener('click', (e) => {
        // If clicked on link, let it navigate
        if ((e.target as HTMLElement).classList.contains('gallery-link')) {
          return;
        }
        // Otherwise open lightbox
        this.openLightbox(item.id);
      });
      
      container.appendChild(galleryItem);
    });
    
    // Start lazy loading
    this.loadImages(container as HTMLElement);
  }

  loadImages(viewport: HTMLElement): void {
    const images = viewport.querySelectorAll('img[data-src]');
    images.forEach(img => {
      this.intersectionObserver?.observe(img);
    });
  }

  openLightbox(itemId: string): void {
    const item = this.items.find(i => i.id === itemId);
    if (!item || !this.lightboxElement) return;

    this.currentLightboxItem = itemId;
    
    // Update lightbox content
    const lightboxImg = this.lightboxElement.querySelector('.lightbox-image') as HTMLImageElement;
    const lightboxTitle = this.lightboxElement.querySelector('.lightbox-title');
    const lightboxDesc = this.lightboxElement.querySelector('.lightbox-description');
    
    if (lightboxImg) {
      lightboxImg.src = item.imageUrl;
      lightboxImg.alt = item.alt;
    }
    
    if (lightboxTitle) {
      lightboxTitle.textContent = item.title;
    }
    
    if (lightboxDesc) {
      lightboxDesc.textContent = item.description;
    }
    
    // Show lightbox
    this.lightboxElement.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    if (!this.lightboxElement) return;
    
    this.lightboxElement.classList.remove('active');
    document.body.style.overflow = '';
    this.currentLightboxItem = null;
  }

  filterByCategory(category: string): void {
    if (category === 'all') {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => item.category === category);
    }
  }

  getCategories(): string[] {
    const categories = new Set(this.items.map(item => item.category));
    return Array.from(categories);
  }

  private loadImageWithFallback(img: HTMLImageElement, src: string): void {
    // Try WebP first (Req 6.1)
    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    const webpImg = new Image();
    webpImg.onload = () => {
      img.src = webpSrc;
      img.classList.add('loaded');
    };
    webpImg.onerror = () => {
      // Fallback to original format
      img.src = src;
      img.classList.add('loaded');
    };
    webpImg.src = webpSrc;
  }

  private createLightbox(): void {
    this.lightboxElement = document.createElement('div');
    this.lightboxElement.className = 'lightbox';
    this.lightboxElement.innerHTML = `
      <div class="lightbox-overlay"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-caption">
          <h3 class="lightbox-title"></h3>
          <p class="lightbox-description"></p>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.lightboxElement);
    
    // Close button
    const closeBtn = this.lightboxElement.querySelector('.lightbox-close');
    closeBtn?.addEventListener('click', () => this.closeLightbox());
    
    // Close on overlay click
    const overlay = this.lightboxElement.querySelector('.lightbox-overlay');
    overlay?.addEventListener('click', () => this.closeLightbox());
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      if (!this.currentLightboxItem) return;
      
      if (e.key === 'Escape') {
        this.closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        this.navigateLightbox(-1);
      } else if (e.key === 'ArrowRight') {
        this.navigateLightbox(1);
      }
    });
  }

  private navigateLightbox(direction: number): void {
    if (!this.currentLightboxItem) return;
    
    const currentIndex = this.filteredItems.findIndex(
      item => item.id === this.currentLightboxItem
    );
    
    if (currentIndex === -1) return;
    
    const newIndex = currentIndex + direction;
    const newItem = this.filteredItems[newIndex];
    if (newIndex >= 0 && newIndex < this.filteredItems.length && newItem) {
      this.openLightbox(newItem.id);
    }
  }

  destroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
    
    if (this.lightboxElement) {
      this.lightboxElement.remove();
      this.lightboxElement = null;
    }
  }
}

export function createContentGalleryManager(): ContentGalleryManager {
  return new DefaultContentGalleryManager();
}
