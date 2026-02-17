import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import routes from "do11y:routes";
import options from "do11y:options";

import _ from "./Page.vue";

(async () => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  });

  const app = createApp(_);

  await options.setup?.(app, router);

  app.use(router);

  app.mount("#app");
})();
