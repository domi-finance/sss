import type { PluginOption, ViteDevServer } from 'vite';
import process from 'process';
import path from 'path';
import fs from 'fs';

const name = 'vite-cache-plugin';

/**
 * Handling negotiated caching
 */
export const cachePlugin = (): PluginOption => {
  // Exit if not in development environment
  if (process.env.NODE_ENV !== 'development') return { name };

  let _server: ViteDevServer;
  let cache = {};
  const cachePath = path.resolve('./', 'node_modules/.admin-cache/');
  const cacheJson = `${cachePath}/cache.json`;

  // Create folder if it doesn't exist
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

  // Create cache.json file if it doesn't exist
  if (!fs.existsSync(cacheJson)) fs.writeFileSync(cacheJson, '{}', { encoding: 'utf-8' });

  return {
    name,
    configureServer: async (server) => {
      _server = server;

      server.middlewares.use((req, res, next) => {
        // Parse cache if it is a string
        if (typeof cache === 'string') cache = JSON.parse(cache);

        if (cache[req.url]) {
          const ifNoneMatch = req.headers['if-none-match'];
          if (ifNoneMatch && cache[req.url] === ifNoneMatch) {
            const { moduleGraph, transformRequest } = server;
            if (
              moduleGraph?.urlToModuleMap?.size &&
              moduleGraph?.urlToModuleMap?.get(req.url)?.transformResult
            ) {
              next();
              return false;
            }

            res.statusCode = 304;
            setTimeout(() => {
              transformRequest(req.url, {
                html: req.headers.accept?.includes('text/html')
              });
            }, 100);

            return res.end();
          }
        }

        next();
      });
    },
    buildStart: async () => {
      // Load cache from cache.json file
      if (fs.existsSync(cacheJson)) {
        const value = fs.readFileSync(cacheJson, { encoding: 'utf-8' });
        cache = JSON.parse(value);
      }

      // Handle Ctrl+C event, dev server will close on Ctrl+C
      process.once('SIGINT', async () => {
        try {
          await _server.close();
        } finally {
          process.exit();
        }
      });
    },
    buildEnd: async () => {
      // Update cache with etags from the server's module graph
      _server?.moduleGraph?.urlToModuleMap?.forEach((value, key) => {
        if (value.transformResult?.etag) {
          cache[key] = value.transformResult.etag;
        }
      });

      // Write updated cache to cache.json
      fs.writeFileSync(cacheJson, JSON.stringify(cache, null, 2));
    }
  };
};
