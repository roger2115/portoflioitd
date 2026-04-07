# Optymalizacje Wydajności

## Zaimplementowane Optymalizacje

### 1. Vite Build Configuration
- **Code Splitting**: Automatyczny podział kodu na chunki (vendor, theme, audio, effects, gallery)
- **Terser Minification**: Agresywna minifikacja z usunięciem console.log
- **Asset Inlining**: Małe pliki (<4KB) są inline'owane
- **CSS Code Splitting**: Osobne pliki CSS dla każdego modułu
- **Disabled Source Maps**: Brak map źródłowych w produkcji

### 2. Lazy Loading
- **Obrazy**: Wszystkie obrazy używają `loading="lazy"` i `decoding="async"`
- **Wideo**: Wszystkie wideo używają `preload="none"` i `loading="lazy"`
- **Intersection Observer**: Lazy loading obrazów w galerii z marginesem 100px
- **Audio**: Audio ładowane dopiero po interakcji użytkownika

### 3. Optymalizacja Animacji
- **Zredukowane cząsteczki**: Z 30 do 15 na desktopie, 0 na mobile
- **Throttled FPS**: Animacje cząsteczek ograniczone do 30 FPS
- **Opóźnione renderowanie**: Cząsteczki renderowane po 2 sekundach
- **Simplified Shadows**: Uproszczone cienie i efekty świetlne
- **Disabled Animations on Mobile**: Wyłączone ciężkie animacje na urządzeniach mobilnych

### 4. CSS Optimizations
- **Performance Optimizations CSS**: Nowy plik z uproszczonymi animacjami
- **Reduced Animation Complexity**: Prostsze keyframes i mniej iteracji
- **Optimized Will-Change**: Używane tylko podczas hover
- **Simplified Gradients**: Mniej złożone gradienty
- **Reduced Box-Shadows**: Prostsze cienie

### 5. JavaScript Optimizations
- **Debouncing**: Click sounds z 100ms debounce
- **Throttling**: Particle animations z throttling do 30 FPS
- **Unobserve After Load**: IntersectionObserver unobserve po załadowaniu
- **Document Fragment**: Używanie fragmentów przy renderowaniu galerii
- **Passive Event Listeners**: Wszystkie event listenery z `{ passive: true }`
- **Early Threshold**: IntersectionObserver z threshold 0.05 zamiast 0.1

### 6. Resource Hints
- **Preconnect**: Połączenia do Google Fonts, Spotify, Steam
- **DNS-Prefetch**: Prefetch do API Groq
- **Preload**: Preload krytycznych fontów
- **Theme Color**: Meta tag dla lepszego UX

### 7. Image Optimizations
- **Lazy Loading**: Wszystkie obrazy z lazy loading
- **Async Decoding**: `decoding="async"` dla lepszej wydajności
- **Optimized Rendering**: `image-rendering: -webkit-optimize-contrast`
- **Transform3D**: Hardware acceleration dla obrazów

### 8. Video Optimizations
- **Preload None**: Wideo nie ładowane do momentu potrzeby
- **Lazy Loading**: Lazy loading dla wszystkich wideo
- **Transform3D**: Hardware acceleration dla wideo
- **Reduced Count**: Tylko 2 wideo w tle zamiast wielu

### 9. Audio Optimizations
- **User Interaction Required**: Audio ładowane dopiero po kliknięciu
- **Debounced Sounds**: Dźwięki z debouncing
- **Reduced Volume**: Domyślna głośność 0.3 zamiast 1.0

### 10. Mobile Optimizations
- **Disabled Particles**: Brak cząsteczek na mobile
- **Disabled Animations**: Wyłączone ciężkie animacje
- **Reduced Opacity**: Cyber grid z opacity 0.1
- **No Filters**: Brak filtrów CSS na mobile
- **Simplified Shadows**: Prostsze cienie na mobile

## Wyniki

### Przed Optymalizacją
- Czas ładowania: ~5-8s
- FPS podczas animacji: 30-45 FPS
- Rozmiar bundle: ~800KB
- Liczba requestów: ~50

### Po Optymalizacji (Oczekiwane)
- Czas ładowania: ~2-3s
- FPS podczas animacji: 55-60 FPS
- Rozmiar bundle: ~400-500KB (z code splitting)
- Liczba requestów: ~30 (z lazy loading)

## Dalsze Możliwe Optymalizacje

### 1. Kompresja Obrazów
```bash
# Zainstaluj sharp lub imagemin
npm install -D vite-plugin-imagemin

# Dodaj do vite.config.ts
import viteImagemin from 'vite-plugin-imagemin'

plugins: [
  viteImagemin({
    gifsicle: { optimizationLevel: 3 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.8, 0.9] },
    svgo: { plugins: [{ removeViewBox: false }] }
  })
]
```

### 2. Service Worker dla Cache
```typescript
// Dodaj workbox dla offline support
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'

// Cache images
registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({ cacheName: 'images' })
)

// Cache audio
registerRoute(
  ({request}) => request.destination === 'audio',
  new CacheFirst({ cacheName: 'audio' })
)
```

### 3. WebP Conversion
```bash
# Konwertuj wszystkie obrazy do WebP
for file in assets/images/*.{jpg,png}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

### 4. Brotli Compression
```bash
# Dodaj kompresję Brotli w GitHub Actions
- name: Compress assets
  run: |
    find dist -type f \( -name '*.js' -o -name '*.css' -o -name '*.html' \) -exec brotli {} \;
```

### 5. CDN dla Statycznych Zasobów
- Przenieś obrazy, wideo i audio na CDN (np. Cloudflare, Vercel)
- Użyj CDN dla fontów zamiast Google Fonts

### 6. Critical CSS
```bash
# Wyodrębnij critical CSS
npm install -D critical

# Dodaj do build procesu
critical src/index.html --base dist --inline --minify
```

### 7. HTTP/2 Server Push
- Skonfiguruj server push dla krytycznych zasobów
- Dodaj `Link` headers w deployment

### 8. Resource Hints
```html
<!-- Dodaj więcej resource hints -->
<link rel="prefetch" href="/assets/audio/background.mp3">
<link rel="prerender" href="/gallery">
```

## Monitoring Wydajności

### Narzędzia do Testowania
1. **Lighthouse**: Chrome DevTools > Lighthouse
2. **WebPageTest**: https://www.webpagetest.org/
3. **GTmetrix**: https://gtmetrix.com/
4. **PageSpeed Insights**: https://pagespeed.web.dev/

### Metryki do Monitorowania
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 3.8s

### Performance Budget
```json
{
  "budget": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 300 },
        { "resourceType": "stylesheet", "budget": 100 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "media", "budget": 1000 },
        { "resourceType": "font", "budget": 100 },
        { "resourceType": "total", "budget": 2000 }
      ]
    }
  ]
}
```

## Checklist Optymalizacji

- [x] Code splitting w Vite
- [x] Lazy loading obrazów
- [x] Lazy loading wideo
- [x] Zredukowane animacje
- [x] Throttled particle animations
- [x] Debounced event handlers
- [x] Passive event listeners
- [x] Resource hints (preconnect, dns-prefetch)
- [x] Optimized CSS animations
- [x] Mobile-specific optimizations
- [ ] WebP conversion
- [ ] Service Worker
- [ ] Brotli compression
- [ ] CDN integration
- [ ] Critical CSS extraction
- [ ] HTTP/2 server push
- [ ] Performance monitoring setup

## Komendy

### Build z analizą
```bash
npm run build
npx vite-bundle-visualizer
```

### Test wydajności lokalnie
```bash
npm run preview
lighthouse http://localhost:4173 --view
```

### Analiza bundle size
```bash
npm run build -- --mode analyze
```
