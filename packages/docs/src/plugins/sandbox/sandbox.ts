import type { Plugin } from 'vite';
import { kebabCase } from 'change-case';
import { parse } from 'node:path';

import fg from 'fast-glob';

import { root, ui } from '../../files.js';
import { html } from '../../html/html.js';

/**
 * Creates a seprate sandbox app, and
 * adds the ability to declare sandbox components
 * which you can access through `do11y:sandbox`.
 */
export default (): Plugin => {
  const moduleId = 'do11y:sandbox';

  const resolvedModuleId = '\0' + moduleId;

  const sandboxFiles = fg.globSync(['(docs|src|packages)/**/*.sandbox.vue'], {
    absolute: true,
    cwd: root,
  });

  return {
    name: 'do11y:sandbox',

    ...html(ui, 'sandbox'),

    resolveId(id) {
      if (id === moduleId) {
        return resolvedModuleId;
      }
    },

    async load(id) {
      if (id === resolvedModuleId) {
        const stringifiedStories = sandboxFiles.map((path) => {
          return `{
            url: "${kebabCase(parse(path).name.replace('.sandbox', ''))}",
            component: async () => (await import("${path}")).default
          }`;
        });

        return `export default [${stringifiedStories.map((sandbox) => sandbox.trim()).join(',\n')}]`;
      }
    },
  };
};
