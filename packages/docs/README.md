# @do11y/docs

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components.
- Import markdown files as routes.
- Add sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`.
- Easily document components with [vue-component-meta](https://www.npmjs.com/package/vue-component-meta) using meta imports - e.g. `Button.vue?meta`.

## Setup

### Allow markdown files in `vite.config.ts` file

```ts
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { vueOptions } from '@do11y/docs';

import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(vueOptions)],
});
```

### Initiate and scaffold

The scaffold makes the assumption that you have a `src` folder and a `tsconfig.json` file it can extend.

```sh
// Install
npm i @do11y/docs

// Scaffold the `docs` folder
npm do11y scaffold
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

This file will be used to configure the site.

> [!WARNING]
> Both the documentation site and the sandbox import this file - this is why it is recommended to import necessary files/components _inside_ the functions.

```ts
import type { Site } from '@do11y/docs';

export default {
  // The main component for the site.
  Site: () => import('./Site.vue'),

  async setup(app, router) {
    // Additional setup for the app.
  },

  async setupSandbox(app) {
    // Additional setup for the sandbox app.
  },
} satisfies Site;
```

### `site/plugins.ts`

This file will be used to configure the different plugins available.

```ts
import type { PluginOptions } from '@do11y/docs';

export default {
  setup(md) {
    // Additional markdown-it setup.
  }

  highlight(md, code, lang, attrs) {
    // The highlight option for `markdown-it`.
  }
} satisfies PluginOptions;
```
