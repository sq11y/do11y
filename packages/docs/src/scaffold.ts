import { cp } from 'fs/promises';
import { join } from 'path';
import { searchForWorkspaceRoot } from 'vite';

const target = join(searchForWorkspaceRoot(process.cwd()), 'example', 'docs');

await cp(join(import.meta.dirname, '../template'), target, { recursive: true });
