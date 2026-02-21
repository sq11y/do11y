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
   * HTML string containing the highlighted source code.
   *
   * @do11y Automatically passed.
   */
  highlightedSource: string;

  /**
   * HTML string containing the highlighted source code,
   * with all the style tags compiled to CSS.
   *
   * @do11y Automatically passed.
   * @caveat Only works in a built solution - during development this returns the same as `highlightedSource`.
   */
  highlightedCssSource: string;
}
