import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createChecker } from "vue-component-meta";
import { parse as parseVue } from "vue/compiler-sfc";
import { parse as parseDocs } from "vue-docgen-api";

import type { Plugin } from "vite";

import { root } from "../../files.js";
import { mapMeta } from "./meta-mapper.js";
import { parseRequest, queries } from "../queries.js";

import { createMarkdown, type MarkdownPluginOptions } from "../markdown.js";

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
export default (options: MarkdownPluginOptions | undefined): Plugin => {
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

  const md = createMarkdown(options, () => base);

  const checker = createChecker(tsconfig, {
    noDeclarations: true,
  });

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

    async hotUpdate({ file, modules, type, read }) {
      if (file.endsWith(".vue") || file.endsWith(".ts")) {
        if (type === "delete") {
          checker.deleteFile(file);
        } else {
          checker.updateFile(file, await read());
        }

        /* prettier-ignore */
        const metaModules = [...this.environment.moduleGraph.idToModuleMap.values()]
          .filter((module) => module.id?.endsWith(queries.meta));

        if (metaModules.length) {
          return [...modules, ...metaModules];
        }
      }
    },
  };
};
