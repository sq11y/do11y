import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import block from "v-custom-block";

export default defineConfig({
  plugins: [vue(), block("docs")],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

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
