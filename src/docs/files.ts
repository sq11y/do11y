import { join } from "node:path";

import { searchForWorkspaceRoot } from "vite";

export const ui = join(import.meta.dirname, "../ui");

export const root = searchForWorkspaceRoot(process.cwd());

// export const root = join(searchForWorkspaceRoot(process.cwd()), "example");

export const docs = join(root, "docs");

export const output = join(docs, "dist");

export const do11y = join(docs, "do11y", "do11y.ts");
