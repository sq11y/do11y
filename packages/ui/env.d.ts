/// <reference types="vite/client" />

declare module 'do11y:routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: RouteRecordRaw[];
  export default routes;
}

declare module 'do11y:site' {
  import type { Router } from 'vue-router';

  const site: {
    Site: () => Promise<Component>;
    setup?(app: App, router?: Router): void | Promise<void>;
  };

  export default site;
}

declare module 'do11y:sandbox' {
  import type { Component } from 'vue';

  const sandboxes: {
    url: string;
    component: () => Promise<Component>;
  }[];

  export default sandboxes;
}
