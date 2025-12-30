import { cp } from 'node:fs/promises';
import { join } from 'node:path';

import { createServer, build, preview } from 'vite';

import { getViteConfig } from './vite-config.js';
import { docs } from './files.js';

const [_, __, command = 'dev'] = process.argv;

if (command !== 'scaffold' && command !== 'dev' && command !== 'build' && command !== 'preview') {
  throw new Error();
}

if (command === 'scaffold') {
  const template = join(import.meta.dirname, '../template');

  await cp(template, docs, { recursive: true });
} else if (command === 'dev') {
  const viteConfig = await getViteConfig(command);

  const server = await createServer(viteConfig);

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
} else {
  const viteConfig = await getViteConfig(command);

  await build(viteConfig);

  if (command === 'preview') {
    const previewServer = await preview(viteConfig);

    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
  }
}
