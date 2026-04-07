# 🎨 Anime Cyberpunk Portfolio

Portfolio w stylu anime-neon-cyberpunk z interaktywnymi efektami wizualnymi i dźwiękowymi.

![Anime Cyberpunk Style](https://img.shields.io/badge/style-anime--cyberpunk-ff006e?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Funkcje

- 🎭 **Theme Engine** - Dynamiczny system motywów z paletą neon-cyberpunk
- 🌟 **Visual Effects** - Efekty neonowego świecenia, animacje cząstek, parallax scrolling
- 🔊 **Audio Manager** - System dźwięków z Web Audio API
- 🎵 **Audio-Visual Sync** - Synchronizacja dźwięku z animacjami (±20ms)
- 📱 **Responsive Layout** - Pełna responsywność (mobile/tablet/desktop)
- 🧭 **Navigation System** - Płynna nawigacja z aktywną sekcją
- 🖼️ **Content Gallery** - Galeria z lazy loading, lightbox, filtrowaniem
- ⚡ **Glitch Effects** - Efekty glitch na tytułach
- 🎨 **Animated Grid** - Animowana siatka cyberpunk w tle
- 💫 **Neon Pulse** - Pulsujące neonowe ramki

## 🎯 Demo

Strona zawiera:
- **Hero Section** - Spektakularny nagłówek z efektami glitch i neonowymi animacjami
- **Skills Section** - Karty umiejętności z paskami postępu i hover effects
- **Gallery Section** - Interaktywna galeria z filtrowaniem i lightbox
- **Contact Section** - Formularz kontaktowy i linki społecznościowe

## 🚀 Szybki Start

### Instalacja

```bash
npm install
```

### Uruchomienie serwera deweloperskiego

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

### Build produkcyjny

```bash
npm run build
```

Pliki produkcyjne znajdziesz w folderze `dist/`.

### Podgląd buildu produkcyjnego

```bash
npm run preview
```

## 🧪 Testy

### Uruchom wszystkie testy

```bash
npm test
```

### Testy w trybie watch

```bash
npm run test:watch
```

### Testy z interfejsem UI

```bash
npm run test:ui
```

## 📁 Struktura Projektu

```
.
├── src/
│   ├── audio/           # Audio Manager i synchronizacja
│   ├── config/          # Konfiguracja portfolio
│   ├── effects/         # Visual Effects Engine
│   ├── gallery/         # Content Gallery Manager
│   ├── layout/          # Responsive Layout Controller
│   ├── navigation/      # Navigation System
│   ├── theme/           # Theme Engine
│   ├── styles/          # Style CSS
│   └── main.ts          # Główny punkt wejścia
├── assets/
│   ├── audio/           # Pliki dźwiękowe (MP3/OGG)
│   └── images/          # Obrazy dla galerii
├── public/              # Pliki statyczne
└── index.html           # Główny plik HTML
```

## 🎨 Dodawanie Treści

### Obrazy do galerii

1. Umieść obrazy w folderze `assets/images/`
2. Edytuj `src/main.ts` i dodaj nowe elementy do `galleryItems`:

```typescript
const galleryItems: GalleryItem[] = [
  {
    id: 'item1',
    title: 'Tytuł projektu',
    description: 'Opis projektu',
    imageUrl: '/assets/images/projekt.jpg',
    thumbnailUrl: '/assets/images/projekt-thumb.jpg',
    category: 'web', // lub 'design', 'art', itp.
    alt: 'Opis alternatywny dla dostępności'
  }
];
```

### Dźwięki

1. Umieść pliki audio (MP3/OGG) w folderze `assets/audio/`
2. Edytuj `src/main.ts` i dodaj nowe pliki do `audioFiles`:

```typescript
const audioFiles: AudioFile[] = [
  { 
    id: 'click', 
    url: '/assets/audio/click.mp3', 
    type: 'effect', 
    preload: true 
  }
];
```

## 🎯 Inspiracje Anime

Projekt inspirowany stylem wizualnym z:
- Darling in the Franxx
- Death Note
- My Dress up Darling
- Tokyo Ghoul
- Vermeil in Gold
- Castlevania (Netflix)
- Devil May Cry (Netflix)
- Rick and Morty

## 📱 Responsywność

- **Mobile**: 0-767px (optymalizacja dotykowa, 44px touch targets)
- **Tablet**: 768-1023px
- **Desktop**: 1024px+ (max-width 1920px)

## ⚡ Wydajność

- Lazy loading obrazów
- Code splitting
- WebP z fallback do JPEG
- Optymalizacja animacji (RequestAnimationFrame)
- Adaptive quality dla urządzeń mobilnych

## ♿ Dostępność

- ARIA labels i role
- Skip links
- Keyboard navigation
- Focus indicators
- Reduced motion support
- Minimum 14px font size na mobile
- Minimum 44px touch targets

## 📄 Licencja

© 2026 Anime Cyberpunk Portfolio. Wszelkie prawa zastrzeżone.

## 🛠️ Technologie

- TypeScript 5.3+
- Vite 5.0+
- Vitest 1.0+
- Web Audio API
- Canvas API
- Intersection Observer API
- Resize Observer API

## 📝 Notatki Deweloperskie

Wszystkie moduły są w pełni przetestowane (140 testów przechodzi). 
Projekt używa TypeScript strict mode dla maksymalnej bezpieczeństwa typów.

Szczegółowa dokumentacja znajduje się w:
- `.kiro/specs/anime-cyberpunk-portfolio/requirements.md`
- `.kiro/specs/anime-cyberpunk-portfolio/design.md`
- `.kiro/specs/anime-cyberpunk-portfolio/tasks.md`
