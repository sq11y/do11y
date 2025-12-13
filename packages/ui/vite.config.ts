import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'ok',

      writeBundle() {},
    },
  ],

  build: {
    outDir: 'dist/bundled',

    rollupOptions: {
      input: {
        docs: './src/docs/index.ts',
        sandbox: './src/sandbox/index.ts',
      },

      output: {
        entryFileNames: () => '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: () => '[name].[ext]',
      },

      treeshake: false,
      preserveEntrySignatures: 'strict',

      external: ['vue', 'do11y:sandbox', 'do11y:site', 'do11y:routes'],
    },
  },
});
