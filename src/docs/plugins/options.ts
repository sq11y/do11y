import type { Plugin } from "vite";
import type { App, Component } from "vue";
import type { Router } from "vue-router";
import type { BundledTheme, ShikiTransformer, StringLiteralUnion, ThemeInput } from "shiki";
import type { MarkdownPluginOptions } from "./markdown.js";

import { do11y } from "../files.js";

export interface Options extends MarkdownPluginOptions {
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
}

export interface ResolvedOptions extends Omit<Options, "highlighter"> {
  highlighter: {
    themes: (ThemeInput | StringLiteralUnion<BundledTheme, string>)[];
    themesInput: Record<string, string>;
    defaultTheme: string;
    transformers: ShikiTransformer[];
    removeComments: boolean | string[];
    postprocess?: (pre: HTMLPreElement) => void;
  };
}

/**
 * Add ability to access options (`docs/do11y/do11y.ts`)
 * through `do11y:options`.
 */
export default (): Plugin => ({
  name: "do11y:options",

  async resolveId(id, importer) {
    if (id === "do11y:options") {
      return this.resolve(do11y.replace(".ts", ".js"), importer);
    }
  },
});
