import { defineConfig, globalIgnores } from "eslint/config";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import pluginVue from "eslint-plugin-vue";
import pluginOxlint from "eslint-plugin-oxlint";

import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default defineConfig(
  globalIgnores(["**/dist/**", "eslint.config.ts", "bin/bin.js"]),

  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  tseslint.configs.recommendedTypeChecked,

  ...pluginOxlint.configs["flat/recommended"],

  {
    files: ["**/*.vue"],
    extends: [pluginVue.configs["flat/essential"], skipFormatting],
  },

  {
    files: ["**/*.vue"],

    rules: {
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "GLOBAL",
            ["UNIQUE", "SLOT"],
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "OTHER_ATTR",
            "EVENTS",
            "CONTENT",
          ],
          alphabetical: false,
          sortLineLength: false,
        },
      ],
    },
  },
);
