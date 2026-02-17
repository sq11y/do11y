import type { Options } from "do11y";

export default {
  Home: () => import("./Home.vue"),
  Layout: () => import("./Layout.vue"),
  Sandbox: () => import("./Sandbox.vue"),
  SandboxIframe: () => import("./SandboxIframe.vue"),
} satisfies Options;
