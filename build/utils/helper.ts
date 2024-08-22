type EnvConfigs = Record<string, string>

// Environment data
interface ViteEnv {
  VITE_SERVER_PORT: number;
  VITE_PROXY: [string, string][];
}

/**
 * Processes and transforms environment configuration.
 * @param envConfigs - The environment configuration object.
 * @returns Transformed Vite environment configuration.
 */
export function handleEnv(envConfigs: EnvConfigs): ViteEnv {
  const {
    VITE_SERVER_PORT,
    VITE_PROXY
  } = envConfigs;

  // Parse the VITE_PROXY environment variable, replacing single quotes with double quotes
  const proxy: [string, string][] = VITE_PROXY ? JSON.parse(VITE_PROXY.replace(/'/g, '"')) : [];

  // Return the Vite environment configuration
  const res: ViteEnv = {
    VITE_SERVER_PORT: Number(VITE_SERVER_PORT) || 8080,
    VITE_PROXY: proxy
  };

  return res;
}

/**
 * Splits the JavaScript module identifier for code splitting.
 * @param id - The module identifier.
 * @returns The split module name.
 */
export function splitJSModules(id: string) {
  // Compatibility with pnpm
  const pnpmName = id.includes('.pnpm') ? '.pnpm/' : '';
  const fileName = `node_modules/${pnpmName}`;

  // Extract and return the module name from the identifier
  const result = id
    .split(fileName)[1]
    .split('/')[0]
    .toString();

  return result;
}
