import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],

  build: {
    emptyOutDir: true,
    outDir: "dist/ui",

    rollupOptions: {
      input: {
        "sandbox-iframe": "./src/ui/SandboxIframe.vue",
        index: "./src/ui/docs/index.ts",
        sandbox: "./src/ui/sandbox/index.ts",
      },

      output: {
        entryFileNames: () => "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: () => "[name].[ext]",
      },

      treeshake: false,
      preserveEntrySignatures: "strict",

      external: ["vue", "vue-router", "do11y:options", "do11y:routes", "do11y:sandbox"],
    },
  },
});
