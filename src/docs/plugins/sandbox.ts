import { join, parse } from "node:path";

import { globSync } from "tinyglobby";
import { kebabCase } from "change-case";

import type { Plugin } from "vite";

import { root, toImportPath, ui } from "../files.js";
import { indexHtml } from "../html/plugin.js";

export const toParamId = (path: string) =>
  kebabCase(parse(path).name.replace(".sandbox", "").replace(".vue", ""));

/**
 * Creates a seprate sandbox app, and
 * adds access to sandbox components through `do11y:sandboxes`.
 */
export default (base?: string): Plugin => {
  const moduleId = "do11y:sandboxes";

  const resolvedModuleId = "\0" + moduleId;

  const sandboxFiles = globSync(["(docs|src|packages)/**/*.sandbox.vue"], {
    ignore: ["**/node_modules/**", "**/dist/**"],
    expandDirectories: false,
    absolute: true,
    cwd: root,
  });

  const duplicateSandboxes = [...Map.groupBy(sandboxFiles, toParamId)]
    .filter(([_, paths]) => paths.length > 1)
    .map(([id]) => id);

  return {
    name: "do11y:sandboxes",

    ...indexHtml(ui, "sandbox", base),

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    load(id) {
      if (id === resolvedModuleId) {
        if (duplicateSandboxes.length) {
          return this.error(`Duplicate sandboxes: ${duplicateSandboxes.join(", ")}`);
        }

        const stringifiedSandboxes = sandboxFiles.map((path) => {
          return `{
            url: "${toParamId(path)}",
            component: async () => (await import(${toImportPath(`${path}?default`)})).default
          }`.trim();
        });

        return `export default [${stringifiedSandboxes.join(",\n")}];`;
      }
    },

    transform(_, id) {
      if (id.endsWith(".sandbox.vue")) {
        if (duplicateSandboxes.length) {
          return this.error(`Duplicate sandboxes: ${duplicateSandboxes.join(", ")}`);
        }

        const code = `
          import { defineComponent, h } from "vue";

          import SandboxIframe from ${toImportPath(join(ui, "sandbox-iframe.js"))};

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
