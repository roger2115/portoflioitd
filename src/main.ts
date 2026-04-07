/**
 * Main entry point for the anime-cyberpunk portfolio
 */

import { getConfig } from './config/PortfolioConfig';
import { createThemeEngine } from './theme/ThemeEngine';
import { createVisualEffectsEngine } from './effects/VisualEffectsEngine';
import { createAudioManager } from './audio/AudioManager';
import { createAudioVisualSyncManager } from './audio/AudioVisualSync';
import { ResponsiveLayoutControllerImpl } from './layout/ResponsiveLayoutController';
import { createNavigationSystem } from './navigation/NavigationSystem';
import { createContentGalleryManager } from './gallery/ContentGalleryManager';
import { createThemeToggle } from './theme/ThemeToggle';
import type { AudioFile } from './config/PortfolioConfig';
import type { GalleryItem } from './gallery/ContentGalleryManager';

/**
 * Initialize the application
 */
async function init(): Promise<void> {
  const config = getConfig();
  
  // Set copyright year
  const copyrightYearElement = document.getElementById('copyright-year');
  if (copyrightYearElement) {
    copyrightYearElement.textContent = config.legal.copyrightYear.toString();
  }
  
  // Initialize theme engine
  const themeEngine = createThemeEngine();
  themeEngine.initialize();
  console.log('✅ Theme Engine initialized');
  
  // Initialize responsive layout controller
  const layoutController = new ResponsiveLayoutControllerImpl();
  layoutController.initialize({
    mobile: 767,
    tablet: 1023,
    desktop: 1024,
  });
  console.log('✅ Responsive Layout initialized');
  console.log('   Device type:', layoutController.getDeviceType());
  console.log('   Touch device:', layoutController.isTouchDevice());
  
  // Initialize visual effects - zoptymalizowane dla wydajności
  const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
  const vfxEngine = createVisualEffectsEngine();
  if (canvas) {
    vfxEngine.initialize(canvas);
    
    // Start cyberpunk particle effects - zredukowane dla wydajności
    const deviceType = layoutController.getDeviceType();
    const particleCount = deviceType === 'mobile' ? 0 : 15;
    
    if (particleCount > 0) {
      // Opóźnij renderowanie o 2 sekundy
      setTimeout(() => {
        vfxEngine.renderParticles({
          count: particleCount,
          color: '#00ffff',
          size: 1.2,
          speed: 0.3,
          lifetime: 5000
        });
      }, 2000);
    }
    console.log('✅ Visual Effects initialized');
  }
  
  // Initialize audio manager (optional - graceful degradation)
  const audioManager = createAudioManager();
  
  // Zapisz referencję do audio managera globalnie
  (window as any).__audioManager = audioManager;
  
  console.log('🎵 Audio Manager created, waiting for user interaction');
  
  // Try to initialize audio manager anyway (for later use)
  // Ale nie uruchamiaj muzyki - to zrobi przycisk "Odwiedź Stronę"
  
  // Initialize audio-visual sync
  const syncManager = createAudioVisualSyncManager(audioManager, vfxEngine);
  console.log('✅ Audio-Visual Sync initialized');
  
  // Initialize navigation system
  const navSystem = createNavigationSystem();
  const sections = [
    { id: 'about', title: 'O mnie', element: document.getElementById('about') as HTMLElement },
    { id: 'skills', title: 'Umiejętności', element: document.getElementById('skills') as HTMLElement },
    { id: 'gallery', title: 'Galeria', element: document.getElementById('gallery') as HTMLElement },
    { id: 'contact', title: 'Kontakt', element: document.getElementById('contact') as HTMLElement }
  ].filter(s => s.element);
  
  navSystem.initialize(sections);
  console.log('✅ Navigation System initialized');
  
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Initialize gallery
  const galleryManager = createContentGalleryManager();
  const galleryItems: GalleryItem[] = [
    {
      id: 'transport-kolejowy',
      title: 'Transport Kolejowy',
      description: 'Projekt dla ziomka szturmowca66 - strona o pociągach z mapą i różnymi info',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      category: 'web',
      alt: 'Projekt Transport Kolejowy',
      link: 'https://roger2115.github.io/transportkolejowy/'
    },
    {
      id: 'biotechnologia',
      title: 'Biotechnologia',
      description: 'Projekt na biologię - prezentacja o biotech z interaktywnymi rzeczami',
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
      category: 'school',
      alt: 'Projekt Biotechnologia',
      link: 'https://roger2115.github.io/biotechnologia/'
    },
    {
      id: 'fibonacci',
      title: 'Fibonacci',
      description: 'Projekt na matmę - interaktywna prezentacja o ciągu fibonacciego z wizualizacjami',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
      category: 'school',
      alt: 'Projekt Fibonacci',
      link: 'https://roger2115.github.io/fibonacciprezentacja/'
    },
    {
      id: 'portfolio-cyberpunk',
      title: 'To Portfolio',
      description: 'Ta strona! Zrobiona w stylu anime z TypeScript i różnymi Web APIs',
      imageUrl: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=400&h=300&fit=crop',
      category: 'web',
      alt: 'Portfolio Cyberpunk',
      link: '#'
    }
  ];
  galleryManager.initialize(galleryItems);
  console.log('✅ Gallery Manager initialized');
  
  // Gallery filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      const galleryContainer = document.querySelector('.gallery-container');
      const items = galleryContainer?.querySelectorAll('.gallery-item');
      
      items?.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          (item as HTMLElement).style.display = 'block';
          setTimeout(() => {
            (item as HTMLElement).style.opacity = '1';
            (item as HTMLElement).style.transform = 'scale(1)';
          }, 10);
        } else {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'scale(0.8)';
          setTimeout(() => {
            (item as HTMLElement).style.display = 'none';
          }, 300);
        }
      });
      
      // Play sound on filter change
      if (audioManager.isReady()) {
        syncManager.playAudioOnly('click', 0.5);
      }
    });
  });
  
  // Apply neon glow to interactive elements
  const interactiveElements = document.querySelectorAll('.nav-link, button');
  interactiveElements.forEach(element => {
    vfxEngine.applyNeonGlow(element as HTMLElement, 0.5);
    
    // Add click sound
    element.addEventListener('click', () => {
      if (audioManager.isReady()) {
        syncManager.playAudioOnly('click', 0.7);
      }
    });
  });
  
  // Intersection Observer for smooth section transitions
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of section is visible
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Play sound when section becomes visible
        if (audioManager.isReady()) {
          syncManager.playAudioOnly('hover', 0.3);
        }
      }
    });
  }, observerOptions);
  
  // Observe all sections
  const allSections = document.querySelectorAll('.section');
  allSections.forEach((section) => {
    sectionObserver.observe(section);
  });
  
  // Make first section visible immediately
  const firstSection = allSections[0];
  if (firstSection) {
    firstSection.classList.add('visible');
  }
  
  // Parallax effect on scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero visual
        const heroVisual = document.querySelector('.hero-visual') as HTMLElement;
        if (heroVisual) {
          heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        // Parallax for anime cards
        const animeCards = document.querySelectorAll('.anime-card');
        animeCards.forEach((card, index) => {
          const speed = 0.1 + (index * 0.05);
          (card as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Parallax for cyber grid
        const cyberGrid = document.querySelector('.cyber-grid') as HTMLElement;
        if (cyberGrid) {
          cyberGrid.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
  
  console.log('🎨 Anime-Cyberpunk Portfolio fully initialized!');
  console.log('   FPS:', vfxEngine.getFPS());
  console.log('   Sections observed:', allSections.length);
  
  // Initialize theme toggle
  const themeToggle = createThemeToggle(audioManager);
  themeToggle.initialize();
  console.log('✅ Theme Toggle initialized');
  
  console.log('🎮 Steam Widget ready with static data');
}

// Loading screen animation
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const enterBtn = document.getElementById('enter-site-btn') as HTMLElement | null;
  
  if (!loadingScreen || !enterBtn) return;
  
  const btn = enterBtn as HTMLElement;
  
  // DVD screensaver - przycisk jeździ po ekranie
  let x = Math.random() * (window.innerWidth - 200);
  let y = Math.random() * (window.innerHeight - 60);
  let dx = 2.5;
  let dy = 2.0;
  let dvdAnimId: number;
  
  const colors: string[] = [
    'var(--color-primary)',
    'var(--color-secondary)',
    'var(--color-accent)',
    '#ff00ff',
    '#00ffff',
    '#ffff00'
  ];
  let colorIndex = 0;
  
  function dvdLoop() {
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    const maxX = window.innerWidth - btnW;
    const maxY = window.innerHeight - btnH;
    
    x += dx;
    y += dy;
    
    let bounced = false;
    if (x <= 0) { x = 0; dx = Math.abs(dx); bounced = true; }
    if (x >= maxX) { x = maxX; dx = -Math.abs(dx); bounced = true; }
    if (y <= 0) { y = 0; dy = Math.abs(dy); bounced = true; }
    if (y >= maxY) { y = maxY; dy = -Math.abs(dy); bounced = true; }
    
    if (bounced) {
      colorIndex = (colorIndex + 1) % colors.length;
      const c = colors[colorIndex] ?? '#ff0000';
      btn.style.borderColor = c;
      btn.style.boxShadow = `0 0 20px ${c}`;
      btn.style.color = c;
    }
    
    btn.style.left = x + 'px';
    btn.style.top = y + 'px';
    
    dvdAnimId = requestAnimationFrame(dvdLoop);
  }
  
  // Ustaw pozycję startową
  btn.style.left = x + 'px';
  btn.style.top = y + 'px';
  btn.style.visibility = 'visible';
  dvdLoop();
  
  // Obsługa przycisku wejścia
  btn.addEventListener('click', async () => {
    cancelAnimationFrame(dvdAnimId);
    
    // Ukryj loading screen
    loadingScreen.classList.add('hidden');
    
    // Usuń z DOM po animacji
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
    
    // Inicjalizuj audio po kliknięciu
    const audioManager = (window as any).__audioManager;
    if (audioManager && !audioManager.isReady()) {
      try {
        const audioFiles: AudioFile[] = [
          { id: 'background', url: '/assets/audio/background.mp3', type: 'music', preload: true },
          { id: 'bloodytheme', url: '/assets/audio/opium.mp3', type: 'music', preload: true },
          { id: 'diabolical', url: '/assets/audio/diabolical.mp3', type: 'effect', preload: true }
        ];
        
        await audioManager.initialize(audioFiles);
        audioManager.playBackgroundMusic('background', true);
        audioManager.setVolume(0.3);
        console.log('🎵 Audio started after user interaction');
      } catch (error) {
        console.warn('⚠️  Audio initialization failed:', error);
      }
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    init();
  });
} else {
  initLoadingScreen();
  init();
}

// Ghost AI Assistant - Beebub
function initGhostAssistant(): void {
  const ghost = document.getElementById('ghost-assistant');
  const ghostImg = document.getElementById('ghost-img');
  const chat = document.getElementById('ghost-chat');
  const closeBtn = document.getElementById('ghost-close');
  const input = document.getElementById('ghost-input') as HTMLInputElement;
  const sendBtn = document.getElementById('ghost-send');
  const messages = document.getElementById('ghost-messages');

  if (!ghost || !ghostImg || !chat || !closeBtn || !input || !sendBtn || !messages) return;

  const msgs = messages as HTMLElement;
  const g = ghost as HTMLElement;

  let x = 32;
  let y = window.innerHeight - 100;
  let dx = 0.6;
  let dy = 0.4;
  let isOpen = false;
  let isDragging = false;
  let dragOffX = 0;
  let dragOffY = 0;
  let velX = 0;
  let velY = 0;
  let lastX = 0;
  let lastY = 0;

  function wander(): void {
    if (isOpen || isDragging) { requestAnimationFrame(wander); return; }
    // Po rzuceniu - kontynuuj z prędkością
    if (Math.abs(velX) > 0.1 || Math.abs(velY) > 0.1) {
      x += velX; y += velY;
      velX *= 0.97; velY *= 0.97;
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      if (x <= 0 || x >= maxX) { velX = -velX; dx = velX; }
      if (y <= 0 || y >= maxY) { velY = -velY; dy = velY; }
      x = Math.max(0, Math.min(maxX, x));
      y = Math.max(0, Math.min(maxY, y));
    } else {
      // Normalny wander
      velX = 0; velY = 0;
      x += dx; y += dy;
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      if (x <= 0 || x >= maxX) dx = -dx;
      if (y <= 0 || y >= maxY) dy = -dy;
      x = Math.max(0, Math.min(maxX, x));
      y = Math.max(0, Math.min(maxY, y));
    }
    g.style.left = x + 'px';
    g.style.bottom = 'auto';
    g.style.top = y + 'px';
    requestAnimationFrame(wander);
  }
  wander();

  // Drag & throw
  ghostImg.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragOffX = e.clientX - x;
    dragOffY = e.clientY - y;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0; velY = 0;
    ghostImg.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    velX = e.clientX - lastX;
    velY = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    x = e.clientX - dragOffX;
    y = e.clientY - dragOffY;
    g.style.left = x + 'px';
    g.style.top = y + 'px';
  });

  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (!isDragging) return;
    isDragging = false;
    ghostImg.style.cursor = 'pointer';
    // Rzut - zachowaj prędkość
    dx = velX * 0.3 || 0.6;
    dy = velY * 0.3 || 0.4;
    // Kliknięcie bez przeciągania = otwórz chat
    if (Math.abs(velX) < 2 && Math.abs(velY) < 2) {
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      if (isOpen) input.focus();
    }
    e.preventDefault();
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chat.classList.remove('open');
  });

  function addMsg(text: string, isUser: boolean): void {
    const div = document.createElement('div');
    div.className = `ghost-msg ${isUser ? 'ghost-msg-user' : 'ghost-msg-bot'}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  const history: { role: string; content: string }[] = [];

  async function getAIResponse(userMsg: string): Promise<string> {
    history.push({ role: 'user', content: userMsg });
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer __OPENROUTER_KEY__',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://tenroger.pl',
          'X-Title': 'Beebub - ten_roger portfolio'
        },
        body: JSON.stringify({
          model: 'google/gemma-4-26b-a4b-it:free',
          messages: [
            {
              role: 'system',
              content: 'Jesteś Beebub - przyjazny duszek asystent na portfolio stronie ten_rogera. Odpowiadasz po polsku, krótko i z humorem. Wiesz że ta strona należy do Rogera - gracza, który lubi anime (Darling in the FRANXX, Death Note, Solo Leveling), programuje dla zabawy i jest uczniem. Jego kontakt: totenroger2115@gmail.com, github: roger2115, discord: ten_roger.'
            },
            ...history
          ],
          max_tokens: 200
        })
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('OpenRouter error:', res.status, err);
        return `Błąd API (${res.status}) 👻`;
      }
      const data = await res.json() as { choices?: { message?: { content?: string } }[] };
      const reply = data.choices?.[0]?.message?.content?.trim() ?? 'Ups, brak odpowiedzi 👻';
      history.push({ role: 'assistant', content: reply });
      return reply;
    } catch (e) {
      console.error('Fetch error:', e);
      return 'Nie mogę się połączyć 👻 Spróbuj później!';
    }
  }

  function handleSend(): void {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, true);
    input.value = '';
    const typing = document.createElement('div');
    typing.className = 'ghost-msg ghost-msg-bot ghost-msg-typing';
    typing.textContent = '...';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    getAIResponse(text).then(reply => {
      typing.remove();
      addMsg(reply, false);
    }).catch(() => {
      typing.remove();
      addMsg('Błąd połączenia 👻', false);
    });
  }

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGhostAssistant);
} else {
  initGhostAssistant();
}
