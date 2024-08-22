import type { PluginOption } from 'vite';
import { presetUno, presetAttributify, presetIcons } from 'unocss';
import { visualizer } from 'rollup-plugin-visualizer';
import { timePlugin } from './time';
import { versionUpdatePlugin } from './version';
import react from '@vitejs/plugin-react-swc';
import legacy from '@vitejs/plugin-legacy';
import unocss from 'unocss/vite';
import viteCompression from 'vite-plugin-compression';

export function createVitePlugins() {
  // Plugin options
  const vitePlugins: PluginOption[] = [
    react(),
    unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons()
      ]
    }),
    // Version control
    versionUpdatePlugin()
  ];

  if (process.env.NODE_ENV === 'production') {
    // Bundle analysis
    visualizer({
      gzipSize: true,
      brotliSize: true,
    }),
      // Legacy browser support
      legacy({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      // Build time plugin
      timePlugin(),
      // Compression
      vitePlugins.push(viteCompression());
  }

  return vitePlugins;
}
