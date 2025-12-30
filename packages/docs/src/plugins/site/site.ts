import { join } from 'node:path';

import type { Plugin } from 'vite';
import type { App, Component } from 'vue';
import type { Router } from 'vue-router';

import { docs } from '../../files.js';

export interface Site {
  /**
   * The wrapper component for the site.
   */
  Site: () => Promise<Component>;

  /**
   * Additional setup for the app.
   */
  setup?(app: App, router: Router): void | Promise<void>;

  /**
   * The wrapper component for the sandbox.
   */
  Sandbox?: () => Promise<Component>;

  /**
   * Additional setup for the sandbox app.
   */
  setupSandbox?(app: App): void | Promise<void>;
}

/**
 * Add ability to access the site options (`docs/site/index.ts`)
 * through `do11y:site`.
 */
export default (): Plugin => ({
  name: 'do11y:site',

  async resolveId(id, importer) {
    if (id === 'do11y:site') {
      return this.resolve(join(docs, 'site', 'index.js'), importer);
    }
  },
});
