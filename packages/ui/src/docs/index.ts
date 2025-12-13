import { createApp, h } from 'vue';
import { router } from './router';

import site from 'do11y:site';

import _ from './Docs.vue';

(async () => {
  const component = (await site.Site()).default;

  const app = createApp(h(_, undefined, () => h(component)));

  app.use(router);

  await site.setup?.(app, router);

  app.mount('#app');
})();
