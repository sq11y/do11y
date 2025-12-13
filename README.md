# Do11y

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components
- Import markdown files with a `title` and `slug` added through frontmatter as routes
- Sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`

## Install

```bash
npm i @do11y/docs
```

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

### Add the `docs` folder

#### Add `tsconfig.json` file

```json
{
  "extends": "../tsconfig.json",
  "include": ["site/**/*", "../src/**/*"],

  "compilerOptions": {
    "types": ["@do11y/docs/types"]
  }
}
```

#### Add a `site/index.ts` file

This file will be used to configure the documentation site. The configuration requires you to pass an import for the main `Site` component.

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

#### Add a `site/plugins.ts` file

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

#### Add a main `Site` component

Inside the app you can import the available routes from `dolly:routes`.

```vue
<template>
  <nav>
    <ul>
      <template v-for="route of routes" :key="route.path">
        <li>
          <router-link :to="route.path">
            {{ route.meta.title }}
          </router-link>
        </li>
      </template>
    </ul>
  </nav>

  <RouterView />
</template>

<script lang="ts" setup>
  import routes from 'do11y:routes';
</script>
```

## Running the example

1. Inside `packages/docs/src/files.ts` - manually set the `root` value:
   ```ts
   join(searchForWorkspaceRoot(process.cwd()), 'example');
   ```
2. Run `pnpm i`
3. Run `pnpm build`
4. Run `pnpm dev`
