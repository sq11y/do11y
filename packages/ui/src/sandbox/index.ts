import { createApp, h } from 'vue';
import { parseQuery } from 'vue-router';

import sandbox from 'do11y:sandbox';
import options from 'do11y:options';

import _ from './Sandbox.vue';

const query = parseQuery(window.location.search);

const { component } = sandbox.find(({ url }) => url === query.id) ?? {};

if (component) {
  (async () => {
    const wrapper = (await options.Sandbox?.())?.default;

    const resolvedComponent = await component();

    /* prettier-ignore */
    const content = () => wrapper
      ? h(wrapper, undefined, () => h(resolvedComponent))
      : h(resolvedComponent);

    const app = createApp(h(_, undefined, content));

    await options.setupSandbox?.(app);

    app.mount('#app');
  })();
}
