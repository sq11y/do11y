import { join } from 'node:path';

import { loadConfigFromFile, mergeConfig } from 'vite';

import { root, docs, ui } from './files.js';
import { plugins } from './plugins/plugins.js';

export const getUserViteConfig = async (command: 'dev' | 'build' | 'preview') => {
  const userConfigFile = await loadConfigFromFile({
    command: command === 'dev' ? 'serve' : 'build',
    mode: command === 'dev' ? 'dev' : 'build',
  });

  return userConfigFile?.config ?? {};
};

export const getViteConfig = async (command: 'dev' | 'build' | 'preview') => {
  const userConfig = await getUserViteConfig(command);

  const config = mergeConfig(userConfig, {
    root: docs,

    server: {
      port: 1998,

      fs: {
        allow: [root, ui, import.meta.dirname],
      },
    },

    preview: {
      port: 1996,
    },

    build: {
      manifest: true,

      outDir: join(docs, 'dist'),

      rollupOptions: {
        input: {
          index: join(ui, 'dist', 'bundle-docs.js'),
          sandbox: join(ui, 'dist', 'bundle-sandbox.js'),
        },

        output: {
          entryFileNames: () => 'assets/[name].js',
          assetFileNames: () => 'assets/[name][extname]',
        },
      },
    },
  });

  return mergeConfig(config, {
    plugins: plugins(),
  });
};
