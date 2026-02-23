import { join, parse } from "node:path";

import { globSync } from "tinyglobby";

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
        const code = `
          import { defineComponent, h } from "vue";

          import SandboxIframe from "${join(ui, "sandbox-iframe.js")}";

          import highlightedSource from "${id}?highlight";
          import highlightedCssSource from "${id}?highlight&lang=css";
          import highlightedStylelessSource from "${id}?highlight&styleless";
          
          export default defineComponent((props) => {
            return () => h(SandboxIframe, {
              id: "${toParamId(id)}",
              highlightedSource,
              highlightedCssSource,
              highlightedStylelessSource,
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
