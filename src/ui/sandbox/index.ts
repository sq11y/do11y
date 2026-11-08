import { createApp } from "vue";

import options from "do11y:options";

import _ from "./Sandbox.vue";

const app = createApp(_);

await options?.setupSandbox?.(app);

app.mount("#app");
