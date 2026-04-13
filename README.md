# Do11y

A bare-bones tool to document Vue components.

> [!WARNING]
> This is a small personal project! I make a lot of component libraries for personal projects and I absolutely love, love, love writing documentation for components, and I intend for this to be a mix of some of the features I love from [VitePress](https://vitepress.dev) and [Histoire](https://histoire.dev). Issues and thoughts and contributions are very welcome! But it is, again, a _personal_ project 😊

## Features

### Markdown components with [@mdit-vue](https://github.com/mdit-vue/mdit-vue).

> Customizable through the options `markdownSetup` and `markdownCodeBlock`.

Markdown files are treated as single file Vue components with the help of [@mdit-vue](https://github.com/mdit-vue/mdit-vue).

### Markdown routes available through `do11y:routes`

To include a markdown file as a route it needs to have a `title` and a `slug` (e.g. `/button`) in it's frontmatter, or it needs to be placed inside `docs/do11y/pages`.

### [Shiki](https://shiki.style) code highlighting

> Customizable through the `highlighter` option.

Code blocks are automatically highlighted with [Shiki](https://shiki.style).

### Highlight imports

You can import Vue files as highlighted code blocks through `.vue?highlight`, or `.vue?highlight&lang=css` (if you want the output to compile the style tags).

These imports return HTML strings meaning you have to render the code block using `v-html`.

> [!WARNING]
> Imports of type `.vue?highlight&lang=css` only work on _built_ sites. During development it will return the same result as `.vue?highlight`.

### Sandboxes

> To customize the Sandbox app add a custom `docs/do11y/pages/Sandbox.vue` wrapper component and/or use the `setupSandbox` option.

Turn a component into a sandbox by adding a `.sandbox` prefix to the component name, e.g. `Button.sandbox.vue` will be available under the url `/sandbox?id=button`, and when importing the component it will be wrapped inside an iframe.

> [!NOTE]
> The id of a sandbox component is based on the filename - not the path - this means every sandbox component must have a unique name.

#### Sandbox Iframe

> To customize the Sandbox app add a custom `docs/do11y/layout/SandboxIframe.vue` wrapper component.

The sandbox iframe component has some props automatically passed to it - you can use the `SandboxIframeProps` type to declare these.

```vue
<template>
  <iframe ref="iframe" :title="`Sandbox for ${title || id}`" :src="url" />
</template>

<script lang="ts" setup>
import type { SandboxIframeProps } from "do11y";

defineProps<SandboxIframeProps & { title?: string }>();
</script>
```

### Document components with [vue-component-meta](https://www.npmjs.com/package/vue-component-meta)

Document components through meta imports (`Button.vue?meta`) which give a simplified version of the result from [vue-component-meta](https://www.npmjs.com/package/vue-component-meta).

## Options

> Options should be the default export of `docs/do11y/do11y.ts`.

You can set the home page by adding a `docs/do11y/pages/Home.vue` file, and you can add a layout for each page in `docs/do11y/layout/Page.vue` using `<RouterView />`.

```ts
import type { Options } from "do11y";

export default {} satisfies Options;
```

```ts
interface Options {
  /**
   * Additional setup for the app.
   */
  setup?(app: App, router: Router): void | Promise<void>;

  /**
   * Additional setup for the sandbox app.
   */
  setupSandbox?(app: App): void | Promise<void>;

  /**
   * The code highlighter.
   *   - Markdown code blocks
   *   - `.vue?highlight`, `.vue?highlight&lang=css` & `.vue?highlight&styleless` imports
   *   - `highlightedSource` and `highlightedCssSource` props in SandboxIframe
   *
   * If using multiple themes - you can set the `data-theme` attribute
   * to switch between them, e.g. `data-theme="vitesse-light"`.
   */
  highlighter?: {
    /**
     * The available themes.
     * The default shiki themes are always included.
     */
    themes: (ThemeInput | StringLiteralUnion<BundledTheme, string>)[];

    /**
     * What the default theme should be.
     * @default "The first theme in the array"
     */
    defaultTheme?: string | StringLiteralUnion<BundledTheme, string>;

    /**
     * Custom transformers.
     *
     * These Shiki's default transformers are always included:
     *   - transformerNotationHighlight
     *   - transformerNotationDiff
     *   - transformerNotationErrorLevel
     */
    transformers?: ShikiTransformer[];

    /**
     * If comments should be filtered.
     *   - Passing `true` removes all comments
     *   - While `string[]` acts as a filter - removing comments that `include` any of these strings in them
     *   - `false` keeps all comments
     *
     * @default ["prettier-ignore"]
     */
    removeComments?: boolean | string[];

    /**
     * If any postprocessing should be done.
     * The element is a JSDOM HTMLPreElement.
     */
    postprocess?: (pre: HTMLPreElement) => void;
  };

  /**
   * Additional markdown-it setup.
   */
  markdownSetup?: PluginSimple;

  /**
   * The callback function for rendering code blocks.
   * Will default return the highlighted code generated by Shiki directly.
   */
  markdownCodeBlock?: (highlightedCode: string, md: MarkdownIt) => string;
}
```
