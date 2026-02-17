import { componentPlugin } from "@mdit-vue/plugin-component";
import { sfcPlugin, type MarkdownSfcBlocks } from "@mdit-vue/plugin-sfc";
import { frontmatterPlugin } from "@mdit-vue/plugin-frontmatter";

import attrsPlugin from "markdown-it-attrs";
import markdown from "markdown-it";

import type { PluginSimple } from "markdown-it";
import type { Plugin } from "vite";

import type MarkdownIt from "markdown-it";

export interface MarkdownPluginOptions {
  /**
   * Additional markdown-it setup.
   */
  markdownSetup?: PluginSimple;

  /**
   * The highlight option for `markdown-it`.
   */
  markdownHighlight?: (md: MarkdownIt, code: string, lang: string, attrs: string) => string;
}

export interface MarkdownItEnv {
  /**
   * Blocks extracted by `@mdit-vue/plugin-sfc`.
   */
  sfcBlocks?: MarkdownSfcBlocks;

  /**
   * Blocks extracted by `@mdit-vue/plugin-frontmatter`.
   */
  frontmatter?: Record<string, unknown>;
}

/**
 * Processes blocks with the lang set to `md` into HTML,
 * and turns `.md` files into single file vue components
 * using `markdown-it` and `@mdit-vue`.
 */
export default (options?: MarkdownPluginOptions): Plugin => {
  const md = markdown({
    html: true,

    highlight(code, lang, attrs): string {
      return options?.markdownHighlight?.(md, code, lang, attrs) ?? "";
    },
  });

  md.use(frontmatterPlugin);
  md.use(sfcPlugin);
  md.use(componentPlugin);
  md.use(attrsPlugin);

  if (options?.markdownSetup) {
    md.use(options.markdownSetup);
  }

  return {
    name: "do11y:markdown",
    enforce: "pre",

    transform(code, id) {
      if (id.endsWith(".md")) {
        const env: MarkdownItEnv = {};

        const html = md.render(code, env);

        /**
         * If it's a markdown block, return the
         * html directly - otherwise create
         * a single file component.
         */
        if (id.endsWith("lang.md")) {
          return html;
        } else {
          const template = env.sfcBlocks?.template?.content ?? "";

          const script = env.sfcBlocks?.scriptSetup?.contentStripped ?? "";

          const styles = env.sfcBlocks?.styles.map((s) => s.content).join("\n\n") ?? "";

          return `${template}\n\n<script setup>${script}</script>\n\n${styles}`;
        }
      }
    },
  };
};
