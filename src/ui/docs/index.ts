import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import routes from "do11y:routes";
import options from "do11y:options";

import _ from "./Page.vue";

(async () => {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,

    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }

      if (!to.hash) {
        return;
      }

      const anchor = document.getElementById(to.hash.slice(1));

      if (!anchor) {
        return;
      }

      const marginTop = parseFloat(getComputedStyle(anchor).scrollMarginTop);

      return {
        el: anchor,
        top: isNaN(marginTop) ? 0 : marginTop,
      };
    },
  });

  const app = createApp(_);

  await options?.setup?.(app, router);

  app.use(router);

  await router.isReady();

  app.mount("#app");
})();
