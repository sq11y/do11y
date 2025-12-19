import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import customBlockPlguin from 'v-custom-block';

import { vueOptions } from '@do11y/docs';

export default defineConfig({
  plugins: [vue(vueOptions), customBlockPlguin('docs')],
});
