declare module "do11y:routes" {
  import type { RouteRecordRaw as VueRouteRecordRaw, RouterOptions } from "vue-router";

  type RouteRecordRaw = VueRouteRecordRaw & {
    meta: {
      title: string;
      slug: string;
    };
  };

  const routes: RouteRecordRaw[];

  export default routes;
}

declare module "do11y:options" {
  import type { Options } from "do11y";

  const options: Omit<Options, "Layout" | "Sandbox" | "SandboxIframe"> & {
    Layout: () => Promise<{ default: Component }>;
    Sandbox?: () => Promise<{ default: Component }>;
    SandboxIframe?: () => Promise<{ default: Component }>;
  };

  export default options;
}

declare module "do11y:css" {
  const css: string;
  export default string;
}

declare module "do11y:sandbox" {
  import type { Component } from "vue";

  const sandboxes: {
    url: string;
    component: () => Promise<Component>;
  }[];

  export default sandboxes;
}

declare module "*.vue?meta" {
  import type { Meta } from "do11y";

  const meta: Meta;

  export default meta;
}
