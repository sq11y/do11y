import { readFileSync } from "node:fs";

import { parse as parseVue } from "vue/compiler-sfc";
import { format } from "oxfmt";
import { createHighlighter, type ThemedToken } from "shiki";

import type { Plugin, ViteDevServer } from "vite";

import { do11yOptions } from "../../options.js";

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
} from "@shikijs/transformers";

const shiki = await createHighlighter({
  langs: ["vue", "javascript", "typescript", "html", "css", "scss"],
  themes: do11yOptions.highlighter.themes,
});

const postprocessDocument = do11yOptions.highlighter.postprocess
  ? new (await import("jsdom")).JSDOM().window.document
  : undefined;

export const highlightCode = (code: string, lang: string) => {
  return shiki.codeToHtml(code, {
    lang: shiki.getLoadedLanguages().includes(lang) ? lang : "text",
    themes: do11yOptions.highlighter.themesInput,
    defaultColor: do11yOptions.highlighter.defaultTheme,
    includeExplanation: true,

    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationErrorLevel(),

      ...do11yOptions.highlighter.transformers,

      {
        name: "do11y:postprocess",
        postprocess(html) {
          if (!do11yOptions.highlighter.postprocess || !postprocessDocument) {
            return;
          }

          const template = postprocessDocument.createElement("template");
          template.innerHTML = html;

          const preTag = template.content.querySelector("pre");

          if (preTag) {
            do11yOptions.highlighter.postprocess(preTag);
          }

          return template.innerHTML;
        },
      },

      {
        name: "do11y:remove-unwanted-comments",
        tokens(tokens) {
          const filter = do11yOptions.highlighter.removeComments;

          if (filter === false) {
            return tokens;
          }

          const result: ThemedToken[][] = [];

          let previousLineWasRemoved = false;

          for (const line of tokens) {
            const filteredLine = [];

            let hasComment = false;

            for (const token of line) {
              const isUnwantedComment = token.explanation?.some((exp) => {
                const isComment = exp.scopes.some((s) => s.scopeName.startsWith("comment"));

                if (!isComment) {
                  return false;
                }

                return typeof filter === "boolean"
                  ? true
                  : filter.some((query) => exp.content.includes(query));
              });

              if (isUnwantedComment) {
                hasComment = true;
              } else {
                filteredLine.push(token);
              }
            }

            /**
             * Remove lines that become empty after removing comments.
             * Additionally, if the next line after a removed comment line is empty too - remove it.
             */
            if (hasComment || previousLineWasRemoved) {
              const isAllWhitespace = filteredLine.every((token) => !token.content.trim());
              previousLineWasRemoved = isAllWhitespace;

              if (isAllWhitespace) {
                continue;
              }
            } else {
              previousLineWasRemoved = false;
            }

            result.push(filteredLine);
          }

          return result;
        },
      },
    ],
  });
};

export const highlightAndFormatCode = async (path: string, code: string) => {
  return highlightCode((await format(path, code)).code, "vue");
};

const removeStyles = (source: string) => {
  const { descriptor } = parseVue(source, { ignoreEmpty: false });

  let code = source;

  for (const style of descriptor.styles.toReversed()) {
    const start = code.lastIndexOf("<style", style.loc.start.offset);
    const end = code.indexOf(">", style.loc.end.offset) + 1;

    code = code.slice(0, start) + code.slice(end);
  }

  return code;
};

/**
 * Adds `.vue?highlight` imports which returns the
 * highlighted code from Shiki.
 */
export default (): Plugin => {
  let viteDevServer: ViteDevServer | undefined;

  return {
    name: "do11y:highlight",

    configureServer(server) {
      viteDevServer = server;
    },

    async transform(_, id) {
      if (
        id.endsWith(".vue?highlight") ||
        id.endsWith(".vue?highlight&lang=css") ||
        id.endsWith(".vue?highlight&styleless")
      ) {
        const path = id
          .replace("?highlight", "")
          .replace("&lang=css", "")
          .replace("&styleless", "");

        const source = readFileSync(path, "utf-8");

        const sourceWithoutStyles = removeStyles(source);

        if (id.endsWith("styleless")) {
          return {
            code: `export default ${JSON.stringify(await highlightAndFormatCode(path, removeStyles(source)))};`,
            moduleType: "js",
          };
        }

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

          if (code) {
            /**
             * Inline css files take shape as `export default "<css>"`, we parse with JSON
             * to ensure e.g. `content: "Before";` doesn't return `content: \"Before\";`.
             */
            return JSON.parse(code.slice(code.indexOf('"'), code.lastIndexOf('"') + 1));
          }
        };

        const stylesheets = parseVue(source).descriptor.styles.map(async (style, i) => {
          /* prettier-ignore */
          return !style.lang || style.lang === "css"
            ? style.content
            : await loadCss(i, style.lang);
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

    hotUpdate({ file }) {
      if (file.endsWith(".sandbox.vue")) {
        const module = this.environment.moduleGraph.getModuleById(`${file}?highlight`);
        const css = this.environment.moduleGraph.getModuleById(`${file}?highlight&lang=css`);
        const styleless = this.environment.moduleGraph.getModuleById(`${file}?highlight&styleless`);

        if (module || styleless || css) {
          return [module, styleless, css].filter((module) => !!module);
        }
      }
    },
  };
};
