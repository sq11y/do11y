# Do11y

## Packages

### @do11y/docs

The documentation tool.

### @do11y/ui

The UI for the documentation sites created.

## Running the example

1. Inside `packages/docs/src/files.ts` - manually set the `root` value:
   ```ts
   join(searchForWorkspaceRoot(process.cwd()), 'example');
   ```
2. Run `pnpm i`
3. Run `pnpm build`
4. Run `pnpm dev`
