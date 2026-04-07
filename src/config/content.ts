/**
 * Konfiguracja treści strony portfolio
 * Edytuj ten plik aby zmienić teksty, linki i dane na stronie
 */

export const siteContent = {
  // Informacje osobiste
  personal: {
    name: 'ten_roger',
    title: 'Hej, Jestem Roger',
    subtitle: 'Gracz, który lubi majstrować przy kodzie',
    description: [
      'Siema! Robię różne rzeczy dla zabawy. Nie jestem programistą, czy technikiem, po prostu bawię się narzędziami.',
      'Czasami oglądam anime, czy inny fine shyt i gram w gry.',
      'Ta strona to taki mój plac zabaw gdzie jak sobie przypomnę to wrzucę projekty które zrobiłem.'
    ]
  },

  // Kontakt
  contact: {
    email: 'totenroger2115@gmail.com',
    github: 'roger2115',
    discord: 'ten_roger',
    steamId: '76561199051421760',
    spotifyArtistId: '1fZAAHNWdSM5gqbi9o5iEA' // KISS
  },

  // Umiejętności
  skills: [
    {
      icon: 'steam', // SVG logo Steam
      title: 'Gaming',
      items: [
        'Giercuję w różne gry',
        'Coś tam pogadam na Discordzie',
        'Visual Novel enjoyer'
      ],
      progress: 100
    },
    {
      icon: '💻',
      title: 'Nauka',
      items: [
        'HTML/CSS/JS z AI',
        'Projekty szkolne',
        'Strony internetowe',
        'GitHub Pages'
      ],
      progress: 25
    },
    {
      icon: '👤',
      title: 'Sztuczna Inteligencja',
      items: [
        'Kiro do pomocy',
        'Generowanie grafik',
        'Automatyzacja rzeczy',
        'Testowanie nowych narzędzi do zabawy'
      ],
      progress: 50
    },
    {
      icon: '🔥',
      title: 'Ulubione Anime',
      items: [
        'Darling in the FRANXX',
        'Death Note',
        'Solo Leveling',
        'I pare innych'
      ],
      progress: 75
    }
  ],

  // Projekty
  projects: [
    {
      id: 'transport-kolejowy',
      title: 'Transport Kolejowy',
      description: 'Projekt dla Szturmowca66 - strona o pociągach z mapą i różnymi info',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      category: 'web',
      link: 'https://roger2115.github.io/transportkolejowy/'
    },
    {
      id: 'biotechnologia',
      title: 'Biotechnologia',
      description: 'Projekt na biologię - prezentacja o biotech z interaktywnymi rzeczami',
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop',
      category: 'school',
      link: 'https://roger2115.github.io/biotechnologia/'
    },
    {
      id: 'fibonacci',
      title: 'Fibonacci',
      description: 'Projekt na matmę - interaktywna prezentacja o ciągu fibonacciego z wizualizacjami',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
      category: 'school',
      link: 'https://roger2115.github.io/fibonacciprezentacja/'
    },
    {
      id: 'portfolio-cyberpunk',
      title: 'To Portfolio',
      description: 'Ta strona! Zrobiona w stylu anime z TypeScript i różnymi Web APIs',
      imageUrl: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&h=600&fit=crop',
      thumbnailUrl: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=400&h=300&fit=crop',
      category: 'web',
      link: '#'
    }
  ],

  // Oceny anime
  animeRatings: [
    {
      title: 'Darling in the FRANXX',
      image: '/assets/images/Darling in the Franxxx.jpg',
      rating: 5,
      comment: 'Hiro i Zero Two top tier relacja'
    },
    {
      title: 'Death Note',
      image: '/assets/images/Death note.jpg',
      rating: 4,
      comment: 'Byłoby 5, ale Near obniża'
    },
    {
      title: 'Castlevania',
      image: '/assets/images/Castlevania.jpg',
      rating: 5,
      comment: 'Nic dodać nic ująć, wampiry, lesbijki, średniowiecze'
    },
    {
      title: 'My Dress-Up Darling',
      image: '/assets/images/My dress up.jpg',
      rating: 4,
      comment: 'Jak na razie jestem po 1 sezonie i zapowiada się fajnie'
    },
    {
      title: 'Solo Leveling',
      image: '/assets/images/Solo leveling.jpg',
      rating: 5,
      comment: 'Sister Leveling ekhm.'
    },
    {
      title: 'Devil May Cry',
      image: '/assets/images/Devil may cry.jpg',
      rating: 4,
      comment: 'Ojjj ale Lady'
    },
    {
      title: 'Tokyo Ghoul',
      image: '/assets/images/Tokyo ghoul.png',
      rating: 3.5,
      comment: 'Yummers'
    },
    {
      title: 'Rick and Morty',
      image: '/assets/images/Rick and morty.png',
      rating: 5,
      comment: 'Well well well'
    },
    {
      title: 'Avatar: The Last Airbender',
      image: '/assets/images/Avatar the last airbender.jpg',
      rating: 4.5,
      comment: 'Azula Baddie'
    },
    {
      title: 'Avatar: The Legend of Korra',
      image: '/assets/images/Avatar the legend of korra.jpg',
      rating: 5,
      comment: 'Asami Sato i Korra',
      extraEmoji: '/assets/images/cat freaky.gif'
    }
  ],

  // Nawigacja
  navigation: [
    { id: 'about', title: 'O Mnie' },
    { id: 'skills', title: 'Zajęcia' },
    { id: 'gallery', title: 'Projekty' },
    { id: 'contact', title: 'Kontakt' }
  ],

  // Krwawy motyw - seriale akcji
  bloodyTheme: {
    shows: [
      {
        title: 'The Boys',
        image: '/assets/images/The boys.png',
        rating: 5,
        comment: 'Oi oi Hughie'
      },
      {
        title: 'Lucifer',
        image: '/assets/images/Lucifer.jpg',
        rating: 4.5,
        comment: 'Mogger'
      },
      {
        title: 'Invincible',
        image: '/assets/images/Invincible.jpg',
        rating: 5,
        comment: 'GDZIE JEST [TITLE_CARD]'
      },
      {
        title: 'The Flash',
        image: '/assets/images/The flash.jpg',
        rating: 3.5,
        comment: 'Ostatnie sezony popsuły 🥀'
      },
      {
        title: 'Arrow',
        image: '/assets/images/Arrow.jpg',
        rating: 4,
        comment: 'Nic dodać, nic ująć'
      },
      {
        title: 'The Blacklist',
        image: '/assets/images/The blacklist.jpg',
        rating: 4,
        comment: 'Absolute Cinema'
      }
    ],
    colors: {
      primary: '#ff0000',      // Czerwony
      secondary: '#8b0000',    // Ciemny czerwony
      accent: '#ff4444',       // Jasny czerwony
      background: '#0a0000',   // Prawie czarny z czerwienią
      text: '#ffffff',         // Biały
      neonGlow: '#ff0000'      // Czerwony blask
    }
  }
};
