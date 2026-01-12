import { site } from './files.js';

import type { Options } from './plugins/options/options.js';

/**
 * Access plugin options (`docs/site/index.ts`).
 */
export const options: Options = (await import(site)).default;
