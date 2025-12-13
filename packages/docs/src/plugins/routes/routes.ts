import { readFileSync } from 'node:fs';

import type { Plugin } from 'vite';
import type { FrontMatterResult } from 'front-matter';

import fg from 'fast-glob';
import fm from 'front-matter';

import { root } from '../../files.js';

interface Page {
  /**
   * The path to the page.
   */
  path: string;

  /**
   * The front matter extracted by `front-matter`.
   */
  frontmatter: FrontMatterResult<{ slug: string; title: string }>['attributes'];
}

/**
 * Adds the ability to import routes (`*.md` files)
 * through `do11y:routes`.
 */
export default (): Plugin => {
  const moduleId = 'do11y:routes';

  const resolvedModuleId = '\0' + moduleId;

  const markdownFiles = fg.globSync(['(docs|src|packages)/**/*.md'], {
    absolute: true,
    cwd: root,
  });

  return {
    name: 'do11y:routes',

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    load(id) {
      if (id === resolvedModuleId) {
        const getFrontMatter = (path: string) => fm(readFileSync(path, 'utf-8')).attributes;

        const pages = markdownFiles
          .map((path) => ({
            path,
            frontmatter: (getFrontMatter(path) ?? {}) as Record<string, unknown>,
          }))
          .filter((file): file is Page => {
            return (
              typeof file.frontmatter.title === 'string' &&
              typeof file.frontmatter.slug === 'string'
            );
          });

        const stringifiedRoutes = pages.map((route) => {
          return `{
            path: "${route.frontmatter.slug}",
            meta: ${JSON.stringify(route.frontmatter)},
            component: async () => (await import("${route.path}")).default
          }`;
        });

        return `export default [${stringifiedRoutes.map((route) => route.trim()).join(',\n')}]`;
      }
    },
  };
};
