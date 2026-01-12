import { join } from 'node:path';

import type { Plugin } from 'vite';
import type { App, Component } from 'vue';
import type { Router } from 'vue-router';
import type { MarkdownPluginOptions } from '../markdown/markdown.js';

import { docs } from '../../files.js';

export interface Options extends MarkdownPluginOptions {
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

  /**
   * Custom wrapper component for `?iframe` imports.
   */
  SandboxIframe?: () => Promise<Component>;
}

/**
 * Add ability to access options (`docs/site/index.ts`)
 * through `do11y:options`.
 */
export default (): Plugin => ({
  name: 'do11y:options',

  async resolveId(id, importer) {
    if (id === 'do11y:options') {
      return this.resolve(join(docs, 'site', 'index.js'), importer);
    }
  },
});
