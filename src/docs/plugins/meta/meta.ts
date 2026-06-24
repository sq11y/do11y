import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { createChecker } from "vue-component-meta";
import { parse as parseVue } from "vue/compiler-sfc";
import { parse as parseDocs } from "vue-docgen-api";

import type { Plugin } from "vite";

import markdown from "markdown-it";
import replaceLinkPlugin from "markdown-it-replace-link";

import { root } from "../../files.js";
import { mapMeta } from "./meta-mapper.js";

const getLinkType = (url: string) => {
  if (url.startsWith("#")) {
    return "anchor";
  }

  if (URL.canParse(url)) {
    return "absolute";
  }

  if (URL.canParse(url, "https://github.com/sq11y/do11y")) {
    return "relative";
  }

  return "invalid";
};

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
export default (base?: string): Plugin => {
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

  const md = markdown({
    html: true,
  });

  if (base) {
    md.use(replaceLinkPlugin, {
      processHTML: true,
      replaceLink: (link) => {
        const url = base.startsWith("/") ? link.replace(/^\//, "") : link;

        return ["anchor", "relative"].includes(getLinkType(link)) ? `${base}${url}` : link;
      },
    });
  }

  return {
    name: "do11y:meta",

    async transform(_, id) {
      if (id.endsWith(".vue?meta")) {
        const file = id.replace("?meta", "");

        const content = readFileSync(file, "utf-8");

        const { descriptor } = parseVue(content, { ignoreEmpty: true });

        const block = descriptor.customBlocks.find((b) => b.type === "docs" && b.lang === "md");

        const description = block ? md.render(block.content) || undefined : undefined;

        const meta = checker.getComponentMeta(file);

        const docs = await parseDocs(file);

        const mappedMeta = {
          ...mapMeta(docs, meta, (content) => md.render(content)),
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
