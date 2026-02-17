import type { Plugin } from "vite";

import { ui } from "../files.js";
import { indexHtml } from "../html/plugin.js";

/**
 * The main documentation app.
 */
export default (base?: string): Plugin => ({ name: "do11y:ui", ...indexHtml(ui, "index", base) });
