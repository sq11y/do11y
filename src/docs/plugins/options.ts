import type { Plugin } from "vite";
import type { App, Component } from "vue";
import type { Router } from "vue-router";
import type { MarkdownPluginOptions } from "./markdown.js";

import { do11y } from "../files.js";

export interface Options extends MarkdownPluginOptions {
  /**
   * The home page component.
   */
  Home: () => Promise<Component>;

  /**
   * The layout component for the documents.
   */
  Layout?: () => Promise<Component>;

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
 * Add ability to access options (`docs/do11y/do11y.ts`)
 * through `do11y:options`.
 */
export default (): Plugin => ({
  name: "do11y:options",

  async resolveId(id, importer) {
    if (id === "do11y:options") {
      return this.resolve(do11y.replace(".ts", ".js"), importer);
    }
  },
});
