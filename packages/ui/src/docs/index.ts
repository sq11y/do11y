import { createApp, h } from 'vue';
import { router } from './router';

import site from 'do11y:site';

import _ from './Docs.vue';

(async () => {
  const wrapper = (await site.Site()).default;

  const app = createApp(h(_, undefined, () => h(wrapper)));

  await site.setup?.(app, router);

  app.use(router);

  app.mount('#app');
})();
