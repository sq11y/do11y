import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';

import { searchForWorkspaceRoot } from 'vite';

const require = createRequire(import.meta.url);

export const ui = join(dirname(require.resolve('@do11y/ui/package.json')));

export const root = searchForWorkspaceRoot(process.cwd());

// export const root = join(searchForWorkspaceRoot(process.cwd()), 'example');

export const docs = join(root, 'docs');

export const plugins = join(docs, 'site', 'plugins.ts');
