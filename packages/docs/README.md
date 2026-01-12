# @do11y/docs

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components.
- Import markdown files as routes.
- Sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`.
- Import components isolated inside an iframe - e.g. `import 'Button.sandbox.vue?iframe'` or `import 'Button.vue?iframe'`.
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

This file is used for configuration.

> [!WARNING]
> Both the documentation site and the sandbox import this file - this is why it is recommended to import necessary files/components _inside_ the functions.

```ts
import type { Options } from '@do11y/docs';

export default {
  Site: () => import('./Site.vue'),

  Sandbox: () => import('./Sandbox.vue'),

  SandboxIframe: () => import('./SandboxIframe.vue'),

  async setup(app, router) {
    /** Setup app */
  },

  async setupSandbox(app) {
    /** Setup sandbox app */
  },

  markdownSetup(md) {
    // Additional markdown-it setup.
  }

  markdownHighlight(md, code, lang, attrs) {
    // The highlight option for `markdown-it`.
  }
} satisfies Options;
```
