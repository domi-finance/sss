import type { PluginOption } from 'vite';

/**
 * Plugin to display build time
 */
export const timePlugin = (): PluginOption => {
  return {
    name: 'vite-build-time',
    enforce: 'pre',
    apply: 'build',
    buildStart: () => {
      console.time('Build Time');
    },
    buildEnd: () => {
      // console.timeEnd('\nModule transformation complete time')
    },
    // Called when the server is closed
    closeBundle: () => {
      console.timeEnd('Build Time');
    }
  };
};
