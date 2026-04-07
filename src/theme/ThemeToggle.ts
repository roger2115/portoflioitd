/**
 * Theme Toggle - Przełączanie między anime a krwawym motywem
 */

export class ThemeToggle {
  private isBloodyTheme: boolean = false;
  private audioManager: any;
  private gifRotationInterval: number | null = null;
  
  constructor(audioManager: any) {
    this.audioManager = audioManager;
  }
  
  initialize(): void {
    const toggleBtnNav = document.getElementById('themeToggleNav');
    
    console.log('🎨 ThemeToggle initializing...');
    console.log('   Toggle button (nav):', toggleBtnNav);
    
    if (toggleBtnNav) {
      toggleBtnNav.addEventListener('click', () => {
        console.log('🔄 Theme toggle clicked (nav)');
        this.toggleTheme();
      });
    }
    
    console.log('✅ ThemeToggle initialized');
  }
  
  private startGifRotation(): void {
    const gifs = document.querySelectorAll<HTMLElement>('.bloody-hero-gif');
    if (gifs.length === 0) {
      console.warn('⚠️  No GIFs found for rotation');
      return;
    }
    
    let currentIndex = 0;
    let hasCompletedCycle = false;
    
    // Pokaż pierwszy GIF
    gifs[0]?.classList.add('active');
    
    // Rotuj co 3 sekundy - ale tylko raz przez wszystkie
    this.gifRotationInterval = window.setInterval(() => {
      if (hasCompletedCycle) {
        // Zatrzymaj po jednym pełnym cyklu
        if (this.gifRotationInterval) {
          clearInterval(this.gifRotationInterval);
          this.gifRotationInterval = null;
        }
        return;
      }
      
      // Ukryj obecny
      gifs[currentIndex]?.classList.remove('active');
      
      // Następny
      currentIndex = (currentIndex + 1) % gifs.length;
      
      // Sprawdź czy wróciliśmy do początku
      if (currentIndex === 0) {
        hasCompletedCycle = true;
      }
      
      // Pokaż następny
      gifs[currentIndex]?.classList.add('active');
    }, 3000);
    
    console.log('🔄 GIF rotation started - will play once through all', gifs.length, 'images');
  }
  
  private stopGifRotation(): void {
    if (this.gifRotationInterval) {
      clearInterval(this.gifRotationInterval);
      this.gifRotationInterval = null;
      
      // Ukryj wszystkie GIFy
      const gifs = document.querySelectorAll('.bloody-hero-gif');
      gifs.forEach(gif => gif.classList.remove('active'));
      
      console.log('⏹️  GIF rotation stopped');
    }
  }
  
  toggleTheme(): void {
    this.isBloodyTheme = !this.isBloodyTheme;
    const body = document.body;
    
    if (this.isBloodyTheme) {
      console.log('🔴 Switching to BLOODY theme');
      
      if (this.audioManager.isReady()) {
        this.audioManager.fadeOutBackgroundMusic(1000);
        this.audioManager.playSound('diabolical', 0.7);
      }
      
      // Krok 1: Pokaż overlay (ekran staje się czarny) - jeszcze stary motyw widoczny
      body.classList.add('theme-transitioning');
      
      // Krok 2: W środku czarnego ekranu (po 1.5s) zmień motyw - nikt nie widzi
      setTimeout(() => {
        body.classList.add('bloody-theme');
        this.startGifRotation();
        console.log('✅ BLOODY theme activated (hidden under overlay)');
      }, 1500);
      
      // Krok 3: Usuń overlay - teraz widać nowy motyw
      setTimeout(() => {
        body.classList.remove('theme-transitioning');
        
        if (this.audioManager.isReady()) {
          setTimeout(() => {
            this.audioManager.playBackgroundMusic('bloodytheme', true);
            this.audioManager.setVolume(0.3);
          }, 100);
        }
      }, 3000);
      
    } else {
      console.log('🔵 Switching to ANIME theme');
      
      if (this.audioManager.isReady()) {
        this.audioManager.fadeOutBackgroundMusic(1000);
      }
      
      this.stopGifRotation();
      
      // Krok 1: Pokaż overlay
      body.classList.add('theme-transitioning');
      
      // Krok 2: W środku czarnego ekranu zmień motyw
      setTimeout(() => {
        body.classList.remove('bloody-theme');
        console.log('✅ ANIME theme activated (hidden under overlay)');
      }, 1500);
      
      // Krok 3: Usuń overlay
      setTimeout(() => {
        body.classList.remove('theme-transitioning');
        
        if (this.audioManager.isReady()) {
          setTimeout(() => {
            this.audioManager.playBackgroundMusic('background', true);
            this.audioManager.setVolume(0.3);
          }, 100);
        }
      }, 3000);
    }
  }
  
  // Unused methods - kept for compatibility
  createBloodDrips(): void {
    // Usunięte - nie używamy już efektów krwi
  }
  
  createBloodSplatters(): void {
    // Usunięte - nie używamy już efektów krwi
  }
}

export function createThemeToggle(audioManager: any): ThemeToggle {
  return new ThemeToggle(audioManager);
}
