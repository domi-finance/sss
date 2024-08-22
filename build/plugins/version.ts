import fs from 'fs';
import path from 'path';

interface configObj {
  publicDir: string;
}

/**
 * Writes content to a file.
 * @param versionFileName - The name of the version file.
 * @param content - The content to write to the file.
 */
const writeVersion = (versionFileName: string, content: string | NodeJS.ArrayBufferView) => {
  // Write to the file
  fs.writeFile(versionFileName, content, (err) => {
    if (err) throw err;
  });
};

// Get the build time as version information
const VERSION_TIME = new Date().getTime();

/**
 * Vite plugin to update version information.
 */
export const versionUpdatePlugin = () => {
  let config: configObj = { publicDir: '' };

  return {
    name: 'version-update',
    configResolved(resolvedConfig: configObj) {
      // Store the resolved configuration
      config = resolvedConfig;
    },
    buildEnd() {
      // Generate the path for the version information file
      const file = config.publicDir + path.sep + 'version.json';

      // Use the build time as the version information
      const content = JSON.stringify({ version: VERSION_TIME });

      if (fs.existsSync(config.publicDir)) {
        writeVersion(file, content);
      } else {
        fs.mkdir(config.publicDir, (err) => {
          if (err) throw err;
          writeVersion(file, content);
        });
      }
    },
  };
};
