import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createChecker } from "vue-component-meta";
import { parse as parseVue } from "vue/compiler-sfc";

import type { Plugin } from "vite";

import markdown from "markdown-it";

import { root } from "../../files.js";
import { mapMeta } from "./meta-mapper.js";

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
  const tsconfig = getFirstExistingFile(
    join(root, "tsconfig.app.json"),
    join(root, "tsconfig.json"),
  );

  if (!tsconfig) {
    return {
      name: "do11y:meta",
    };
  }

  const checker = createChecker(tsconfig, {
    noDeclarations: true,
  });

  const md = markdown();

  return {
    name: "do11y:meta",

    transform(_, id) {
      if (id.endsWith(".vue?meta")) {
        const file = id.replace("?meta", "");

        const content = readFileSync(file, "utf-8");

        const { descriptor } = parseVue(content, { ignoreEmpty: true });

        const block = descriptor.customBlocks.find((b) => b.type === "docs" && b.lang === "md");

        const description = block ? md.render(block.content) || undefined : undefined;

        const meta = checker.getComponentMeta(file);

        const mappedMeta = {
          ...mapMeta(meta, (content) => md.render(content)),
          description: description || meta.description,
        };

        const code = `export default ${JSON.stringify(mappedMeta)}`;

        return {
          code,
          moduleType: "js",
        };
      }
    },
  };
};
