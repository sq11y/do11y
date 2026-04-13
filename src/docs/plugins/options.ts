import { existsSync } from "node:fs";
import { join } from "node:path";

import type { Plugin } from "vite";
import type { App } from "vue";
import type { Router } from "vue-router";
import type { BundledTheme, ShikiTransformer, StringLiteralUnion, ThemeInput } from "shiki";
import type { MarkdownPluginOptions } from "./markdown.js";

import { do11y } from "../files.js";

export interface Options extends MarkdownPluginOptions {
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
 * Adds the ability to import options and setup files.
 *
 * `do11y:options` → `docs/do11y/do11y.ts`
 *
 * `do11y:home` → `docs/do11y/pages/Home.vue`
 * `do11y:page-layout` → `docs/do11y/layout/Page.vue`
 *
 * `do11y:sandbox` → `docs/do11y/pages/Sandbox.vue`
 * `do11y:sandbox-iframe` → `docs/do11y/layout/SandboxIframe.vue`
 */
export default (): Plugin => {
  const setupFiles: Record<string, string> = {
    "do11y:options": join(do11y, "do11y.js"),

    "do11y:home": join(do11y, "pages", "Home.vue"),
    "do11y:page-layout": join(do11y, "layout", "Page.vue"),

    "do11y:sandbox": join(do11y, "pages", "Sandbox.vue"),
    "do11y:sandbox-iframe": join(do11y, "layout", "SandboxIframe.vue"),
  };

  return {
    name: "do11y:options",

    async resolveId(id, importer) {
      if (Object.keys(setupFiles).includes(id)) {
        /* prettier-ignore */
        return existsSync(setupFiles[id])
          ? this.resolve(setupFiles[id], importer)
          : `\0${id}`;
      }
    },

    async load(id) {
      if (id.startsWith("\0") && Object.keys(setupFiles).includes(id.replace("\0", ""))) {
        return {
          code: "export default undefined",
          moduleType: "js",
        };
      }
    },
  };
};
