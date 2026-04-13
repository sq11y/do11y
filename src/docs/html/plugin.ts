import { join } from "node:path";
import { writeFileSync } from "node:fs";

import type { Plugin } from "vite";

import { output } from "../files.js";
import { render } from "./render.js";

export const indexHtml = (folder: string, key: "index" | "sandbox"): Omit<Plugin, "name"> => ({
  writeBundle(_, bundle) {
    const chunk = Object.values(bundle).find((chunk) => {
      return chunk.type === "chunk" && chunk.isEntry && chunk.facadeModuleId?.endsWith(`${key}.js`);
    });

    if (!chunk) {
      throw new Error(`Failed to create HTML file for ${key}.`);
    }

    const stylesheets = Array.from(chunk.viteMetadata?.importedCss || []);

    const html = render(chunk.fileName, stylesheets);

    writeFileSync(join(output, `${key}.html`), html);

    if (key === "index") {
      writeFileSync(join(output, "404.html"), html);
    }
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
