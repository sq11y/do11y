import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],

  build: {
    outDir: 'dist/bundled',

    rollupOptions: {
      input: {
        components: './src/components/index.ts',
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

      external: ['vue', 'vue-router', 'do11y:sandbox', 'do11y:options', 'do11y:routes'],
    },
  },
});
