import type { Options } from './plugins/options/options.js';
import type { Meta } from './plugins/meta/meta-types.js';

export type { Options, Meta };

export const vueOptions = {
  include: [/\.vue$/, /\.md$/],
  exclude: [/\.vue\?meta$/, /\.vue\?iframe$/],
};
