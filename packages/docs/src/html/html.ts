import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

import type { Plugin } from 'vite';

import { docs } from '../files.js';

export const html = (folder: string, key: 'index' | 'sandbox'): Omit<Plugin, 'name'> => {
  const template = readFileSync(join(import.meta.dirname, 'template.html'), 'utf-8');

  const bundle = join(folder, 'dist', key === 'index' ? 'bundle-docs.js' : 'bundle-sandbox.js');

  const sandboxBundle = join(folder, 'dist', 'bundle-sandbox.js');

  return {
    async writeBundle() {
      const html = template
        .replace('/assets/index.js', `/assets/${key}.js`)
        .replace('/assets/index.css', `/assets/${key}.css`);

      await writeFile(join(docs, 'dist', `${key}.html`), html);
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/' && !req.url?.startsWith('/sandbox')) {
          return next();
        }

        const currentBundle = req.url === '/' ? bundle : sandboxBundle;

        const html = template
          .replace('/assets/index.js', `/@fs/${currentBundle}`)
          .replace('<link rel="preload stylesheet" href="/assets/index.css" as="style" />', '');

        const transformedHtml = await server.transformIndexHtml(req.url, html);

        res.statusCode = 200;
        res.setHeader('content-type', 'text/html; charset=UTF-8');
        res.end(transformedHtml);
      });
    },
  };
};
