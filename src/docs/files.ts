import { join } from "node:path";

import { searchForWorkspaceRoot } from "vite";

const [_, __, ___, relativePath] = process.argv;

export const ui = join(import.meta.dirname, "../ui");

export const root = relativePath
  ? join(searchForWorkspaceRoot(process.cwd()), relativePath)
  : searchForWorkspaceRoot(process.cwd());

export const docs = join(root, "docs");

export const output = join(docs, "dist");

export const do11y = join(docs, "do11y", "do11y.ts");
