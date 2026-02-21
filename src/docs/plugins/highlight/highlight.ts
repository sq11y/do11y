import { readFileSync } from "node:fs";

import { parse as parseVue } from "vue/compiler-sfc";
import { format } from "oxfmt";
import { createHighlighter, bundledLanguages, bundledThemes } from "shiki";

import { JSDOM } from "jsdom";

import type { Plugin, ViteDevServer } from "vite";

import { do11yOptions } from "../../options.js";

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

      ...do11yOptions.highlighter.transformers,

      {
        name: "do11y",
        postprocess(html) {
          if (do11yOptions.highlighter.postprocess) {
            const jsdom = new JSDOM(html);

            const preTag = jsdom.window.document.querySelector("pre")!;

            do11yOptions.highlighter.postprocess(preTag);

            return preTag.parentElement!.innerHTML;
          }
        },
      },
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
    name: "do11y:highlight",

    configureServer(server) {
      viteDevServer = server;
    },

    async transform(_, id) {
      if (id.endsWith(".vue?highlight") || id.endsWith(".vue?highlight&lang=css")) {
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
          return {
            code: `export default ${JSON.stringify(await highlightAndFormatCode(path, source))};`,
            moduleType: "js",
          };
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

        return {
          code: `export default ${JSON.stringify(await highlightAndFormatCode(path, sourceWithoutStyles + css))};`,
          moduleType: "js",
        };
      }
    },
  };
};
