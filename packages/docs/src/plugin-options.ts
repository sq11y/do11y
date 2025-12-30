import { existsSync } from 'node:fs';

import type { MarkdownPluginOptions } from './plugins/markdown/markdown.js';

import { plugins } from './files.js';

export type PluginOptions = MarkdownPluginOptions;

/**
 * Access plugin options (`docs/site/plugins.ts`).
 */
export const pluginOptions: PluginOptions | undefined = existsSync(plugins)
  ? (await import(plugins)).default
  : undefined;
