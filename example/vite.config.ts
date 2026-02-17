import { resolve } from "node:path";

import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import block from "v-custom-block";

export default defineConfig({
  plugins: [vue(), block("docs")],

  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "Do11y",
      fileName: "do11y",
    },

    rollupOptions: {
      external: ["vue"],

      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
