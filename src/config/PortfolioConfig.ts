/**
 * Portfolio Configuration
 * Central configuration for the anime-cyberpunk portfolio
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  neonGlow: string;
}

export interface FontConfig {
  heading: string;
  body: string;
}

export interface AnimationConfig {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface AudioFile {
  id: string;
  url: string;
  type: 'effect' | 'music';
  preload: boolean;
}

export interface Section {
  id: string;
  title: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  alt: string;
}

export interface Attribution {
  type: 'font' | 'icon' | 'image' | 'audio' | 'library';
  name: string;
  author: string;
  license: string;
  url: string;
}

export interface PortfolioConfig {
  owner: {
    name: string;
    email: string;
    social: SocialLinks;
  };
  theme: {
    colorPalette: ColorPalette;
    fonts: FontConfig;
    animations: AnimationConfig;
  };
  audio: {
    enabled: boolean;
    defaultVolume: number;
    sounds: AudioFile[];
  };
  sections: Section[];
  gallery: GalleryItem[];
  legal: {
    copyrightYear: number;
    termsUrl: string;
    privacyUrl: string;
    attributions: Attribution[];
  };
}

/**
 * Default portfolio configuration
 */
export const defaultConfig: PortfolioConfig = {
  owner: {
    name: 'Portfolio Owner',
    email: 'contact@example.com',
    social: {
      github: 'https://github.com/username',
      linkedin: 'https://linkedin.com/in/username',
      email: 'contact@example.com'
    }
  },
  theme: {
    colorPalette: {
      primary: '#0074ff',
      secondary: '#5d00ff',
      accent: '#8b00ff',
      background: '#0a0a0f',
      text: '#e0e0e0',
      neonGlow: '#0074ff'
    },
    fonts: {
      heading: "'Orbitron', 'Rajdhani', sans-serif",
      body: "'Inter', 'Roboto', sans-serif"
    },
    animations: {
      duration: {
        fast: 200,
        normal: 500,
        slow: 800
      },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  audio: {
    enabled: true,
    defaultVolume: 0.5,
    sounds: []
  },
  sections: [
    { id: 'about', title: 'O mnie' },
    { id: 'gallery', title: 'Galeria' },
    { id: 'projects', title: 'Projekty' },
    { id: 'contact', title: 'Kontakt' }
  ],
  gallery: [],
  legal: {
    copyrightYear: new Date().getFullYear(),
    termsUrl: '/terms',
    privacyUrl: '/privacy',
    attributions: [
      {
        type: 'font',
        name: 'Inter',
        author: 'Rasmus Andersson',
        license: 'SIL Open Font License',
        url: 'https://fonts.google.com/specimen/Inter'
      },
      {
        type: 'font',
        name: 'Orbitron',
        author: 'Matt McInerney',
        license: 'SIL Open Font License',
        url: 'https://fonts.google.com/specimen/Orbitron'
      }
    ]
  }
};

/**
 * Get portfolio configuration
 */
export function getConfig(): PortfolioConfig {
  return defaultConfig;
}
