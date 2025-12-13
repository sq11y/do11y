# Do11y

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components.
- Import markdown files as routes.
- Add sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`.

## Packages

### @do11y/docs

The documentation tool.

### @do11y/ui

The UI for the documentation sites created.

## Development

1. Inside `packages/docs/src/files.ts` - manually override the `root` value:
   ```ts
   join(searchForWorkspaceRoot(process.cwd()), 'example');
   ```
2. Run `pnpm i`
3. Run `pnpm build`
4. Run `pnpm dev`
