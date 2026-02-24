# Do11y

A bare-bones tool to document Vue components.

> [!WARNING]
> This is a small personal project! I make a lot of component libraries for personal projects and I absolutely love, love, love writing documentation for components, and I intend for this to be a mix of some of the features I love from [VitePress](https://vitepress.dev) and [Histoire](https://histoire.dev). Issues and thoughts and contributions are very welcome! But it is, again, a _personal_ project 😊

## Features

### Markdown components with [@mdit-vue](https://github.com/mdit-vue/mdit-vue).

Markdown files are treated as single file Vue components with the help of [@mdit-vue](https://github.com/mdit-vue/mdit-vue).

You can customize the markdown-it instance through the `markdownSetup` option.

### Import markdown route files as routes through `do11y:routes`

To include a markdown file as a route it needs to have a `title` and a `slug` (e.g. `/button`) in it's frontmatter.

### [Shiki](https://shiki.style) code highlighting

Code blocks are automatically highlighted with [Shiki](https://shiki.style).

You can customize the Shiki instance through the `highlighter` options.

### Highlight imports

You can import Vue files as highlighted code blocks through `.vue?highlight`, or `.vue?highlight&lang=css` (if you want the output to compile the style tags).

These imports return HTML strings meaning you have to render the code block using `v-html`.

> [!WARNING]
> Imports of type `.vue?highlight&lang=css` only work on built sites. During development it will return the same result as `.vue?highlight`.

### Sandboxes

Create sandbox components - e.g. `Button.sandbox.vue` will be available under the url `/sandbox?id=button`, and if importing the component it will be wrapped inside an iframe component that has access to the components `?highlight` imports.

To customize the sandbox app, use the `Sandbox` option - and to cutomize the iframe component used for import, use the `SandboxIframe` option.

> [!NOTE]
> The id is based on the filename - not the path to the file - this means if you have two sandbox files of the same name in different locations - they won't both work.

### Document components with [vue-component-meta](https://www.npmjs.com/package/vue-component-meta)

Document components through meta imports (`Button.vue?meta`) which give a simplified version of a result from [vue-component-meta](https://www.npmjs.com/package/vue-component-meta).

## Options

Expected as the default export in `docs/do11y/do11y.ts`.

```ts
interface Options {
  /**
   * The home page.
   */
  Home: () => Promise<Component>;

  /**
   * The layout for each route.
   */
  Layout?: () => Promise<Component>;

  /**
   * Additional setup for the app.
   */
  setup?(app: App, router: Router): void | Promise<void>;

  /**
   * The wrapper component for sandboxes.
   */
  Sandbox?: () => Promise<Component>;

  /**
   * Additional setup for the sandbox app.
   */
  setupSandbox?(app: App): void | Promise<void>;

  /**
   * Custom wrapper component for `.vue.sandbox` imports.
   */
  SandboxIframe?: () => Promise<Component>;

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
}
```
