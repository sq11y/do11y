declare module 'do11y:routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: (Omit<RouteRecordRaw, 'meta'> & { meta: { title: string; slug: string } })[];
  export default routes;
}
