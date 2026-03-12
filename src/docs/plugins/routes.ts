import { basename, join, parse } from "node:path";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { globSync } from "tinyglobby";

import type { Plugin } from "vite";

import { root, do11y } from "../files.js";

import fm from "front-matter";
import { toParamId } from "./sandbox.js";

/**
 * Adds the ability to import routes through `do11y:routes`.
 *
 * Routes refer to `*.md` files with a`title` and `slug`
 * or components inside `docs/do11y/pages`.
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
  const routes = markdownFiles
    .map((path) => ({ path, frontmatter: fm(readFileSync(path, "utf-8")).attributes as Record<string, unknown> }))
    .filter((file) => typeof file.frontmatter.title === "string" && typeof file.frontmatter.slug === "string");

  /* prettier-ignore */
  const pages = existsSync(join(do11y, "pages"))
    ? readdirSync(join(do11y, "pages")).filter((page) => page !== "Home.vue" && (page.endsWith(".md") || page.endsWith(".vue")))
    : [];

  return {
    name: "do11y:routes",

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    load(id) {
      if (id === resolvedModuleId) {
        const stringifiedRoutes = routes.map((route) => {
          return `{
            path: "${route.frontmatter.slug}",
            meta: ${JSON.stringify(route.frontmatter)},
            component: async () => (await import("${route.path}")).default
          }`.trim();
        });

        const stringifiedPages = pages.map((page) => {
          const title = parse(page).name;
          const slug = `/p/${toParamId(title)}`;

          return `{
            path: "${slug}",
            component: async () => (await import("${join(do11y, "pages", page)}")).default,

            meta: {
              slug: "${slug}",
              title: "${title}",
            },
          }`.trim();
        });

        return `
          import Home from 'do11y:home';
          import options from 'do11y:options';

          import { RouterView } from 'vue-router';

          const homeRoute = {
            path: "/",
            component: Home,

            meta:  {
              title: "Home",
              slug: "/",
            }
          };

          const customRoutes = (options.routes ?? []).map(page => ({
            ...page,

            meta: {
              slug: page.path,
              ...page.meta,
            }
          }))
 
          export default [homeRoute, ${stringifiedPages.join(",\n")}, ${stringifiedRoutes.join(",\n")}];
        `;
      }
    },
  };
};
