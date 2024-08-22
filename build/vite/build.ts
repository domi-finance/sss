import type { BuildOptions } from 'vite';
import { splitJSModules } from '../utils/helper';

/**
 * @description Configuration for code splitting
 */
export function buildOptions(): BuildOptions {
  return {
    chunkSizeWarningLimit: 1000, // Warn if chunk size exceeds 1000k
    sourcemap: process.env.NODE_ENV !== 'production', // Enable sourcemaps in non-production environments
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console statements and debugger in production
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        manualChunks(id) {
          // Split JS modules
          if (id.includes('node_modules')) {
            return splitJSModules(id);
          }
        }
      }
    }
  };
}
