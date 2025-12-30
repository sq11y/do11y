declare module 'do11y:routes' {
  import type { RouteRecordRaw as VueRouteRecordRaw } from 'vue-router';
  type RouteRecordRaw = Omit<VueRouteRecordRaw, 'meta'> & { meta: { title: string; slug: string } };
  const routes: RouteRecordRaw[];
  export default routes;
}

declare module '*.vue?meta' {
  import type { Meta } from '@do11y/docs';
  const meta: Meta;
  export default meta;
}
