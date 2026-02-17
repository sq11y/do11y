import type { Plugin } from "vite";

import ui from "./ui.js";
import sandbox from "./sandbox.js";
import meta from "./meta/meta.js";
import markdown from "./markdown.js";
import block from "v-custom-block";
import options from "./options.js";
import routes from "./routes.js";

import { do11yOptions } from "../options.js";

export const plugins = (): Plugin[] => [
  ui(),
  sandbox(),
  meta(),

  markdown(do11yOptions),
  block("docs"),

  options(),
  routes(),
];
