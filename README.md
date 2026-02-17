# Do11y

A bare-bones tool to document Vue components.

- Write documentation in markdown files that turn into single file components.
- Import markdown files as routes through `do11y:routes`.
- Create sandbox components - e.g. `Button.sandbox.vue` will be available under the url `/sandbox?id=button`, and if importing the component it will be wrapped inside an iframe component that has access to the source code with or without compiled CSS.
- Easily document components through meta imports which give a simplified result from [vue-component-meta](https://www.npmjs.com/package/vue-component-meta) - e.g. `Button.vue?meta`.
