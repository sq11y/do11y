import type { PluginOptions } from './plugin-options.js';

import type { Site } from './plugins/site/site.js';
import type { Meta } from './plugins/meta/meta-types.js';

export type { PluginOptions, Site, Meta };

export const vueOptions = {
  include: [/\.vue$/, /\.md$/],
  exclude: [/\.vue\?meta$/],
};
