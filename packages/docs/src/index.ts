import type { PluginOptions } from './plugin-options.js';
import type { Site } from './plugins/site/site.js';

export type { Site, PluginOptions };

export const vueOptions = {
  include: [/\.vue$/, /\.md$/],
  exclude: [/\.vue\?meta$/],
};
