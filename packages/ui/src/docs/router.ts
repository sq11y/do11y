import routes from 'do11y:routes';

import { createRouter, createWebHashHistory } from 'vue-router';

export const router = createRouter({
  /**
   * @TODO
   */
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});
