import { readFileSync } from "node:fs";
import { globSync } from "tinyglobby";

import type { Plugin } from "vite";

import { root } from "../files.js";

import fm from "front-matter";

/**
 * Adds the ability to import routes (`*.md` files with
 * a `title` and `slug`) through `do11y:routes`.
 */
export default (): Plugin => {
  const moduleId = "do11y:routes";

  const resolvedModuleId = "\0" + moduleId;

  const markdownFiles = globSync(["(docs|src|packages)/**/*.md"], {
    ignore: ["**/node_modules/**", "**/dist/**"],
    expandDirectories: false,
    absolute: true,
    cwd: root,
  });

  /* prettier-ignore */
  const pages = markdownFiles
    .map((path) => ({ path, frontmatter: fm(readFileSync(path, "utf-8")).attributes as Record<string, unknown> }))
    .filter((file) => typeof file.frontmatter.title === "string" && typeof file.frontmatter.slug === "string");

  return {
    name: "do11y:routes",

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    load(id) {
      if (id === resolvedModuleId) {
        const stringifiedRoutes = pages.map((route) => {
          return `{
            path: "${route.frontmatter.slug}",
            meta: ${JSON.stringify(route.frontmatter)},
            component: async () => (await import("${route.path}")).default
          }`.trim();
        });

        const homeMeta = {
          title: "Home",
          slug: "/",
        };

        return `
          import options from 'do11y:options';

          const home = {
            path: "/",
            meta: ${JSON.stringify(homeMeta)},
            component: options.Home
          };

          export default [home, ${stringifiedRoutes.join(",\n")}];
        `;
      }
    },
  };
};
