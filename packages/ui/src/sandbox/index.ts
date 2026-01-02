import { createApp, h } from 'vue';
import { parseQuery } from 'vue-router';

import sandbox from 'do11y:sandbox';
import site from 'do11y:site';

import _ from './Sandbox.vue';

const query = parseQuery(window.location.search);

const { component } = sandbox.find(({ url }) => url === query.id) ?? {};

if (component) {
  (async () => {
    const wrapper = (await site.Sandbox?.())?.default;

    const resolvedComponent = await component();

    /* prettier-ignore */
    const content = () => wrapper
      ? h(wrapper, undefined, () => h(resolvedComponent))
      : h(resolvedComponent);

    const app = createApp(h(_, undefined, content));

    await site.setupSandbox?.(app);

    app.mount('#app');
  })();
}
