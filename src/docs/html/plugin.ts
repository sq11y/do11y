import { join } from "node:path";

import { normalizePath, type Plugin } from "vite";

import { render } from "./render.js";

export const indexHtml = (folder: string, key: "index" | "sandbox"): Omit<Plugin, "name"> => {
  let base = "/";

  return {
    configResolved(config) {
      ({ base } = config);
    },

    generateBundle(_, bundle) {
      /* prettier-ignore */
      const chunk = Object.values(bundle).find((chunk) => {
        return chunk.type === "chunk" && chunk.isEntry && chunk.facadeModuleId?.endsWith(`${key}.js`);
      });

      if (!chunk) {
        return this.error(`Failed to create HTML file for ${key}.`);
      }

      const stylesheets = Array.from(chunk.viteMetadata?.importedCss || []).map((file) => {
        return `${base}${file}`;
      });

      const html = render(`${base}favicon.ico`, `${base}${chunk.fileName}`, stylesheets);

      this.emitFile({
        type: "asset",
        fileName: `${key}.html`,
        source: html,
      });

      if (key === "index") {
        this.emitFile({
          type: "asset",
          fileName: "404.html",
          source: html,
        });
      }
    },

    configureServer(server) {
      const bundle = normalizePath(join(folder, `${key}.js`));

      const sandboxBundle = normalizePath(join(folder, "sandbox.js"));

      /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== "GET" || !req.headers.accept?.includes("text/html")) {
          return next();
        }

        const html = render(
          `${base}favicon.ico`,
          `/@fs/${req.url.startsWith("/sandbox") ? sandboxBundle : bundle}`,
        );

        const transformedHtml = await server.transformIndexHtml(req.url, html);

        res.statusCode = 200;
        res.setHeader("content-type", "text/html; charset=UTF-8");
        res.end(transformedHtml);
      });
    },
  };
};
