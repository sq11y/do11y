import { do11y } from "./files.js";

import type { Options } from "./plugins/options.js";

/**
 * Access plugin options (`docs/do11y/index.ts`).
 */
export const do11yOptions: Options = (await import(do11y)).default;
