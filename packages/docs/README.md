# @do11y/docs

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components.
- Import markdown files as routes.
- Add sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`.

## Setup

### Allow markdown files in `vite.config.ts` file

```ts
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  plugins: [vue({ include: [/\.vue$/, /\.md$/] }), vueDevTools()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

### Initiate and scaffold

The scaffold makes the assumption that you have a `src` folder and a `tsconfig.json` file it can extend.

```sh
// Install
npm i @do11y/docs

// Scaffold the `docs` folder
npm do11y-scaffold
```

### Add scripts to `package.json`

```json
{
  "scripts": {
    "docs:dev": "do11y",
    "docs:build": "do11y build",
    "docs:preview": "do11y preview"
  }
}
```

### Run the dev environment

```sh
// Install
npm docs:dev
```

## Files

### `site/index.ts`

This file will be used to configure the documentation site.

> [!WARNING]
> Both the documentation site and the sandbox uses the same `setup` function. This means importing styles or components directly in this file will also import them to the sandbox.

```ts
import type { Site } from '@do11y/docs';

export default {
  Site: () => import('./Site.vue'),

  setup(app) {
    // App setup
  },
} satisfies Site;
```

### `site/plugins.ts`

This file will be used to configure the different plugins available.

```ts
import type { PluginOptions } from '@do11y/docs';

export default {
  metaRenderer(meta, title) {
    return `
      <h3>${title}</h3>
      <pre><code>${JSON.stringify(meta, null, 2)}</code></pre>
    `;
  },
} satisfies PluginOptions;
```
