import { join, parse } from "node:path";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import { compileString } from "sass";
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

    transform(_, id) {
      if (id.endsWith(".sandbox.vue")) {
        let source = readFileSync(id, "utf-8");

        const { descriptor } = parseVue(source, {
          filename: id,
          ignoreEmpty: true,
        });

        const usesSass = descriptor.styles.some((s) => ["sass", "scss"].includes(s.lang as string));

        let sourceWithCompiledCss = source.replace(/\n<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

        if (usesSass) {
          for (const style of descriptor.styles) {
            const compiledStyle = compileString(style.content, {
              url: pathToFileURL(id),
            });

            const attributes = Object.entries(style.attrs)
              .filter(([key]) => key !== "lang")
              .map(([key, value]) => `${key}="${value}"`);

            const stringifiedAttributes = attributes.length ? ` ${attributes.join(" ")}` : "";

            sourceWithCompiledCss += `<style${stringifiedAttributes}>\n${compiledStyle.css}\n</style>`;
          }

          /* Fix lack of new lines between style tags */
          sourceWithCompiledCss = sourceWithCompiledCss
            .replace(/\n\n\n<style/gi, "\n\n<style")
            .replace("</style><style", "</style>\n\n<style");
        }

        const code = `
          import { defineComponent, h } from "vue";

          import SandboxIframe from "${join(ui, "sandbox-iframe.js")}";
          
          export default defineComponent((props) => {
            return () => h(SandboxIframe, {
              id: "${toParamId(id)}",
              source: ${JSON.stringify(source)},
              sourceWithCompiledCss: ${usesSass ? JSON.stringify(sourceWithCompiledCss) : "undefined"},
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
