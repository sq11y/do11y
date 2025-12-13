import { createApp, h } from 'vue';
import { parseQuery } from 'vue-router';

import sandbox from 'do11y:sandbox';
import site from 'do11y:site';

import _ from './Sandbox.vue';

const query = parseQuery(window.location.search);

const { component } = sandbox.find(({ url }) => url === query.id) ?? {};

if (component) {
  (async () => {
    const resolvedComponent = await component();

    const app = createApp(h(_, undefined, () => h(resolvedComponent)));

    await site.setup?.(app);

    app.mount('#app');
  })();
}
