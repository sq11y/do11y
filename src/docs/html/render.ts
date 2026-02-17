import { readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

const template = readFileSync(join(import.meta.dirname, "index.html"), "utf-8");

export const render = (script: string, stylesheet?: string) => {
  const jsdom = new JSDOM(template);

  const scriptElement = jsdom.window.document.createElement("script");

  scriptElement.setAttribute("type", "module");
  scriptElement.setAttribute("src", script);

  jsdom.window.document.documentElement.appendChild(scriptElement);

  if (stylesheet) {
    const linkElement = jsdom.window.document.createElement("link");

    linkElement.setAttribute("as", "style");
    linkElement.setAttribute("rel", "preload stylesheet");
    linkElement.setAttribute("href", stylesheet);

    jsdom.window.document.head.appendChild(linkElement);
  }

  return jsdom.serialize();
};
