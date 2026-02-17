/* Entryfile for `do11y` package */

import type { Options } from "./plugins/options.js";
import type { Meta } from "./plugins/meta/meta-types.js";

export type { Options, Meta };

export interface SandboxIframeProps {
  /**
   * The `id` of the sandbox - which is the filename
   * in lower-case without the extension.
   *
   * @do11y Automatically passed.
   */
  id: string;

  /**
   * The sandbox url.
   *
   * @do11y Automatically passed.
   */
  url: string;

  /**
   * The source code.
   *
   * @do11y Automatically passed.
   */
  source?: string;

  /**
   * The source code with compiled CSS.
   * Only included if the style tag has lang `scss` or `sass`.
   *
   * @do11y Automatically passed.
   */
  sourceWithCompiledCss?: string;
}
