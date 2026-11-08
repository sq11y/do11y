import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createChecker } from "vue-component-meta";
import { parse as parseVue } from "vue/compiler-sfc";
import { parse as parseDocs } from "vue-docgen-api";

import type { Plugin } from "vite";

import markdown from "markdown-it";

import { root } from "../../files.js";
import { mapMeta } from "./meta-mapper.js";
import { parseRequest, queries } from "../queries.js";

import { markdownReplaceLinkPlugin } from "../markdown-replace-link-plugin.js";

const getFirstExistingFile = (...paths: string[]) => {
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }
};

/**
 * Adds `.vue?meta` imports which returns a simplified result
 * of running the component through `vue-component-meta`.
 */
export default (): Plugin => {
  let base = "/";

  const tsconfig = getFirstExistingFile(
    join(root, "tsconfig.app.json"),
    join(root, "tsconfig.json"),
  );

  if (!tsconfig) {
    return {
      name: "do11y:meta",

      transform(_, id) {
        const request = parseRequest(id);

        if (request?.query !== queries.meta) {
          return;
        }

        return this.error(`${queries.meta} imports require a tsconfig file.`);
      },
    };
  }

  const md = markdown({
    html: true,
  });

  const checker = createChecker(tsconfig, {
    noDeclarations: true,
  });

  md.use(markdownReplaceLinkPlugin(() => base));

  return {
    name: "do11y:meta",

    configResolved(config) {
      ({ base } = config);
    },

    async transform(_, id) {
      const request = parseRequest(id);

      if (request?.query !== queries.meta) {
        return;
      }

      const content = readFileSync(request.path, "utf-8");

      const { descriptor } = parseVue(content, { ignoreEmpty: true });

      const block = descriptor.customBlocks.find((b) => b.type === "docs" && b.lang === "md");

      const description = block ? md.render(block.content) || undefined : undefined;

      const meta = checker.getComponentMeta(request.path);

      const docs = await parseDocs(request.path);

      const mappedMeta = {
        ...mapMeta(docs, meta, (content) => md.render(content)),
        description: description || meta.description,
      };

      const code = `export default ${JSON.stringify(mappedMeta)}`;

      return {
        code,
        moduleType: "js",
      };
    },

    hotUpdate({ file }) {
      if (file.endsWith(".vue")) {
        const module = this.environment.moduleGraph.getModuleById(`${file}${queries.meta}`);

        if (module) {
          checker.updateFile(file, readFileSync(file, "utf-8"));
          return [module];
        }
      }
    },
  };
};
