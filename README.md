# Do11y

A very bare-bones tool to help document Vue components.

- Write documentation in Markdown files that get treated as Vue components.
- Import markdown files as routes.
- Add sandbox components - e.g. `Button.sandbox.vue` will be available on the url `/sandbox?id=button`.
- Easily document components with [vue-component-meta](https://www.npmjs.com/package/vue-component-meta) using meta imports - e.g. `Button.vue?meta`.

## Development

1. Inside `packages/docs/src/files.ts` - comment the `root` variable out, and un-comment the `root` variable below.
2. Run `pnpm i`
3. Run `pnpm build`
4. Run `pnpm dev`
