/// <reference types="vite/client" />

declare module 'do11y:routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: RouteRecordRaw[];
  export default routes;
}

declare module 'do11y:options' {
  import type { Options } from '@do11y/docs';
  const options: Options;
  export default options;
}

declare module 'do11y:sandbox' {
  import type { Component } from 'vue';

  const sandboxes: {
    url: string;
    component: () => Promise<Component>;
  }[];

  export default sandboxes;
}
