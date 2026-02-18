import { join, parse } from "node:path";
import { readFileSync } from "node:fs";

import { globSync } from "tinyglobby";
import { parse as parseVue } from "vue/compiler-sfc";

import type { Plugin } from "vite";

import { root, ui } from "../files.js";
import { indexHtml } from "../html/plugin.js";

const toParamId = (path: string) => parse(path).name.toLowerCase().replace(".sandbox", "");

/**
 * Creates a seprate sandbox app, and
 * adds access to sandbox components through `do11y:sandbox`.
 */
export default (): Plugin => {
  const moduleId = "do11y:sandbox";

  const resolvedModuleId = "\0" + moduleId;

  const sandboxFiles = globSync(["(docs|src|packages)/**/*.sandbox.vue"], {
    ignore: ["**/node_modules/**", "**/dist/**"],
    expandDirectories: false,
    absolute: true,
    cwd: root,
  });

  return {
    name: "do11y:sandbox",

    ...indexHtml(ui, "sandbox"),

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    load(id) {
      if (id === resolvedModuleId) {
        const stringifiedSandboxes = sandboxFiles.map((path) => {
          return `{
            url: "${toParamId(path)}",
            component: async () => (await import("${path}?default")).default
          }`.trim();
        });

        return `export default [${stringifiedSandboxes.join(",\n")}];`;
      }
    },

    async transform(_, id) {
      if (id.endsWith(".sandbox.vue")) {
        const source = readFileSync(id, "utf-8");

        const sourceWithoutStyles = source.replace(/\n<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

        const { descriptor } = parseVue(source, {
          filename: id,
          ignoreEmpty: true,
        });

        const usesSass = descriptor.styles.some((s) => s.lang && ["sass", "scss"].includes(s.lang));

        const imports = descriptor.styles
          .map((_, i) => `import Css${i} from "${id}?vue&type=style&index=${i}&lang.scss?inline";`)
          .join("");

        const stylesheets = descriptor.styles.map((_, i) => `Css${i}`).join(", ");

        const code = `
          import { defineComponent, h } from "vue";

          import SandboxIframe from "${join(ui, "sandbox-iframe.js")}";

          ${imports}

          const sourceWithoutStyleTags = ${JSON.stringify(sourceWithoutStyles)};

          const cssStylesheet = [${stylesheets}].join("");

          const sourceWithStylesheet = !!cssStylesheet
            ? sourceWithoutStyleTags + '<style>' + cssStylesheet + '</style>'
            : sourceWithoutStyleTags;
          
          export default defineComponent((props) => {
            return () => h(SandboxIframe, {
              id: "${toParamId(id)}",
              source: ${JSON.stringify(source)},
              sourceWithCompiledCss: ${usesSass ? "sourceWithStylesheet" : "undefined"},
              passedProps: props,
            });
          });
        `.trim();

        return {
          code,
          moduleType: "js",
        };
      }
    },
  };
};
