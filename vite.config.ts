import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'theme': ['./src/theme/ThemeEngine.ts'],
          'audio': ['./src/audio/AudioManager.ts'],
          'effects': ['./src/effects/VisualEffectsEngine.ts']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false
  },
  server: {
    port: 3000
  }
});
