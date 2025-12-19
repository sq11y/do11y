import type { Site } from '@do11y/docs';

export default {
  Site: () => import('./Site.vue'),

  async setup(app) {
    const SandboxIframe = (await import('./SandboxIframe.vue')).default;
    app.component('SandboxIframe', SandboxIframe);
  },

  async setupSandbox(app) {
    /** Setup sandbox app */
  },
} satisfies Site;
