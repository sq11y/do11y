import { readFileSync } from "node:fs";

import { parse as parseVue } from "vue/compiler-sfc";
import { format } from "oxfmt";
import { createHighlighter, bundledLanguages, bundledThemes } from "shiki";

import type { Plugin, ViteDevServer } from "vite";

import { do11yOptions } from "../options.js";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
} from "@shikijs/transformers";

const shiki = await createHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: [...Object.values(bundledThemes), ...do11yOptions.highlighter.themes],
});

export const highlightCode = (code: string, lang: string) => {
  return shiki.codeToHtml(code, {
    lang,
    themes: do11yOptions.highlighter.themesInput,
    defaultColor: do11yOptions.highlighter.defaultTheme,

    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
    ],
  });
};

export const highlightAndFormatCode = async (path: string, code: string) => {
  return highlightCode((await format(path, code)).code, "vue");
};

/**
 * Adds `.vue?highlight` imports which returns the
 * highlighted code from Shiki.
 */
export default (): Plugin => {
  let viteDevServer: ViteDevServer;

  return {
    name: "do11y:shiki",

    configureServer(server) {
      viteDevServer = server;
    },

    async resolveId(id) {
      if (id === "do11y:css") {
        return "\0dolly:css.css";
      }
    },

    async load(id) {
      if (id === "\0dolly:css.css") {
        const generateThemeCss = (theme: string) => `
          [data-theme="${theme}"] .shiki,
          [data-theme="${theme}"] .shiki span {
            background-color: var(--shiki-${theme}-bg) !important;
            color: var(--shiki-${theme}) !important;
          }
        `;

        return Object.keys(do11yOptions.highlighter.themesInput)
          .filter((theme) => do11yOptions.highlighter.defaultTheme !== theme)
          .map((theme) => generateThemeCss(theme))
          .join("\n");
      } else if (id.endsWith(".vue?highlight") || id.endsWith(".vue?highlight&lang=css")) {
        const path = id.replace("?highlight", "").replace("&lang=css", "");

        const source = readFileSync(path, "utf-8");

        /**
         * Getting the code from `load` does not work during development,
         * so we return the original code during development.
         *
         * We also return the original code if the import does not specifically ask
         * to compile the style tags to CSS.
         */
        if (viteDevServer?.config.command === "serve" || !id.endsWith("lang=css")) {
          return `export default ${JSON.stringify(await highlightAndFormatCode(path, source))};`;
        }

        const loadCss = async (index: number, lang: string) => {
          const { code } = await this.load({
            id: path + `?vue&type=style&index=${index}&lang.${lang}?inline`,
          });

          return code?.replace(/^(export default ")/, "").replace(/"$/, "");
        };

        const sourceWithoutStyles = source.replace(/\n<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

        const stylesheets = parseVue(source).descriptor.styles.map((style, i) => {
          /* prettier-ignore */
          return !style.lang || style.lang === "css"
            ? style.content
            : loadCss(i, style.lang);
        });

        const css = (await Promise.all(stylesheets))
          .filter((stylesheet) => !!stylesheet)
          .map((stylesheet) => `<style>${stylesheet}</style>`)
          .join("\n");

        return `export default ${JSON.stringify(await highlightAndFormatCode(path, sourceWithoutStyles + css))};`;
      }
    },
  };
};
