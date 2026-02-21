# Do11y

A bare-bones tool to document Vue components.

- Write documentation in markdown files that turn into single file components.
- Import markdown files as routes through `do11y:routes`.
- Code blocks highlighted with [Shiki](https://shiki.style).
- Import Vue files as highlighted code blocks through `.vue?shiki`, or `.vue?shiki&lang=css` (if you want the output to include the compiled style tags). These imports return a HTML string meaning you have to render the code block with `v-html`.
- Create sandbox components - e.g. `Button.sandbox.vue` will be available under the url `/sandbox?id=button`, and if importing the component it will be wrapped inside an iframe component that has access to the source code with or without compiled CSS.
- Easily document components through meta imports which give a simplified result from [vue-component-meta](https://www.npmjs.com/package/vue-component-meta) - e.g. `Button.vue?meta`.
