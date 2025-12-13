import { createServer, build, preview } from 'vite';

import { getViteConfig } from './vite-config.js';

const [_, __, command = 'dev'] = process.argv;

if (command !== 'dev' && command !== 'build' && command !== 'preview') {
  throw new Error();
}

const viteConfig = await getViteConfig(command);

if (command === 'dev') {
  const server = await createServer(viteConfig);

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
} else {
  await build(viteConfig);

  if (command === 'preview') {
    const previewServer = await preview(viteConfig);

    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
  }
}
