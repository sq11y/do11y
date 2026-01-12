import type { Options } from '@do11y/docs';

export default {
  Site: () => import('./Site.vue'),

  Sandbox: () => import('./Sandbox.vue'),

  SandboxIframe: () => import('./SandboxIframe.vue'),

  async setup(app, router) {
    const SandboxIframe = (await import('./SandboxIframe.vue')).default;
    app.component('SandboxIframe', SandboxIframe);
  },
} satisfies Options;
