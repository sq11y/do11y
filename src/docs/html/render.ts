import { readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

const template = readFileSync(join(import.meta.dirname, "index.html"), "utf-8");

export const render = (
  base: string | undefined = "",
  script: string,
  stylesheets: string[] = [],
) => {
  const jsdom = new JSDOM(template);

  const scriptElement = jsdom.window.document.createElement("script");

  scriptElement.setAttribute("type", "module");
  scriptElement.setAttribute("src", `${base}${script}`);

  jsdom.window.document.documentElement.appendChild(scriptElement);

  for (const stylesheet of stylesheets) {
    const linkElement = jsdom.window.document.createElement("link");

    linkElement.setAttribute("as", "style");
    linkElement.setAttribute("rel", "preload stylesheet");
    linkElement.setAttribute("href", `${base}${stylesheet}`);

    jsdom.window.document.head.appendChild(linkElement);
  }

  return jsdom.serialize();
};
