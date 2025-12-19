import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import customBlockPlguin from 'v-custom-block';

export default defineConfig({
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/], exclude: [/\.vue\?meta$/] }),
    customBlockPlguin('docs'),
  ],
});
