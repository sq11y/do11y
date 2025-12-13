import type { Site } from '@do11y/docs';

export default {
  Site: () => import('./Site.vue'),

  async setup(app) {
    const SandboxPlaygroundComponent = (await import('./SandboxPlayground.vue')).default;
    app.component('SandboxPlayground', SandboxPlaygroundComponent);
  },
} satisfies Site;
