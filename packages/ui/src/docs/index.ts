import { createApp, h } from 'vue';
import { router } from './router';

import options from 'do11y:options';

import _ from './Docs.vue';

(async () => {
  const wrapper = (await options.Site()).default;

  const app = createApp(h(_, undefined, () => h(wrapper)));

  await options.setup?.(app, router);

  app.use(router);

  app.mount('#app');
})();
