import { join } from "node:path";
import { writeFileSync } from "node:fs";

import type { Plugin } from "vite";

import { output } from "../files.js";
import { render } from "./render.js";

export const indexHtml = (folder: string, key: "index" | "sandbox"): Omit<Plugin, "name"> => ({
  writeBundle() {
    const html = render(`/assets/${key}.js`, `/assets/${key}.css`);

    const indexHtmlFile = join(output, `${key}.html`);

    writeFileSync(indexHtmlFile, html);
  },

  configureServer(server) {
    const bundle = join(folder, `${key}.js`);

    const sandboxBundle = join(folder, "sandbox.js");

    server.middlewares.use(async (req, res, next) => {
      if (!req.url || req.method !== "GET" || !req.headers.accept?.includes("text/html")) {
        return next();
      }

      const html = render(`/@fs/${req.url?.startsWith("/sandbox") ? sandboxBundle : bundle}`);

      const transformedHtml = await server.transformIndexHtml(req.url, html);

      res.statusCode = 200;
      res.setHeader("content-type", "text/html; charset=UTF-8");
      res.end(transformedHtml);
    });
  },
});
