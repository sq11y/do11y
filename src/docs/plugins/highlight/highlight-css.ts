import type { Plugin } from "vite";

import { do11yOptions } from "../../options.js";

/**
 * Adds the necessary styles for using
 * dual themes with the `highlighter`.
 */
export default (): Plugin => ({
  name: "do11y:highlight-css",

  async resolveId(id) {
    if (id === "do11y:css") {
      return "\0dolly:css.css";
    }
  },

  load: {
    order: "post",

    handler(id) {
      if (id === "\0dolly:css.css") {
        const generateThemeCss = (theme: string) => `
        [data-theme="${theme}"] .shiki {
          background-color: var(--shiki-${theme}-bg) !important;
        }

        [data-theme="${theme}"] .shiki span {
          color: var(--shiki-${theme}) !important;
        }
      `;

        return Object.keys(do11yOptions.highlighter.themesInput)
          .filter((theme) => do11yOptions.highlighter.defaultTheme !== theme)
          .map((theme) => generateThemeCss(theme))
          .join("\n");
      }
    },
  },
});
