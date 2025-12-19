import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { Plugin } from 'vite';
import { createChecker } from 'vue-component-meta';

import markdown from 'markdown-it';

import { root } from '../../files.js';
import { mapMeta } from './meta-mapper.js';

/**
 * Adds `.vue?meta` imports which returns the results of
 * running the component through `vue-component-meta`.
 */
export default (): Plugin => {
  let tsconfig = join(root, 'tsconfig.app.json');

  if (!existsSync(tsconfig)) {
    tsconfig = join(root, 'tsconfig.json');
  }

  const checker = createChecker(tsconfig, {
    noDeclarations: true,
  });

  const md = markdown();

  return {
    name: 'do11y:meta',

    transform(_, id) {
      if (id.endsWith('.vue?meta')) {
        const file = id.replace('?meta', '');

        const meta = checker.getComponentMeta(file);

        const code = `export default ${JSON.stringify(mapMeta(meta, (content) => md.render(content)))}`;

        return {
          code,
          map: { mappings: '' },
          moduleType: 'js',
        };
      }
    },
  };
};
