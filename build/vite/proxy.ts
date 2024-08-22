import type { ProxyOptions } from 'vite';

type ProxyList = [string, string][]

type ProxyTargetList = Record<string, ProxyOptions>

/**
 * Create cross-origin proxies
 * @param list - 2D array of proxy configurations
 */
export function createProxy(list: ProxyList = []) {
  const res: ProxyTargetList = {};

  for (const [prefix, target] of list) {
    res[`^${prefix}`] = {
      target,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
    };
  }

  return res;
}
