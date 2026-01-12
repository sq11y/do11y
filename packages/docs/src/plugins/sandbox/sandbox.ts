import type { Plugin } from 'vite';

import { kebabCase } from 'change-case';
import { join, parse } from 'node:path';

import fg from 'fast-glob';

import { root, ui } from '../../files.js';
import { html } from '../../html/html.js';

const toParamId = (path: string) => kebabCase(parse(path).name.replace('.sandbox', ''));

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

    load(id) {
      if (id === resolvedModuleId) {
        const stringifiedStories = sandboxFiles.map((path) => {
          return `{
            url: "${toParamId(path)}",
            component: async () => (await import("${path}")).default
          }`;
        });

        return `export default [${stringifiedStories.map((sandbox) => sandbox.trim()).join(',\n')}]`;
      }
    },

    transform: {
      handler(source, id) {
        if (!id.endsWith('.vue?iframe')) {
          return;
        }

        const file = id.replace('?iframe', '');

        const components = join(ui, 'dist', 'bundled', 'components.js');

        const sandboxId = toParamId(file);

        if (id.endsWith('.sandbox.vue?iframe')) {
          const customCode = `
            import { defineComponent, h } from 'vue';
            
            import { Do11ySandboxIframe } from '${components}';

            import options from 'do11y:options';

            const customIframe = options.SandboxIframe ? (await options.SandboxIframe()).default : undefined;

            export default defineComponent((props) => {
              return () => h(Do11ySandboxIframe, {
                id: '${sandboxId}',
                source: ${JSON.stringify(source)},
                customIframe,
                customIframeProps: props,
              });
            });
          `;

          return {
            code: customCode,
            moduleType: 'js',
          };
        }

        const customCode = `
          import { defineComponent, h, useAttrs } from 'vue';

          import Component from '${file}';

          import { Do11yIframe } from '${components}';

          export default defineComponent(() => {
            const attrs = useAttrs();

            return () => h(Do11yIframe, undefined, () => h(Component, attrs));
          });
        `;

        return {
          code: customCode,
          moduleType: 'js',
        };
      },
    },
  };
};
