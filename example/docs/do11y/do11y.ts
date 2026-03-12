import type { Options } from "do11y";

export default {
  Sandbox: () => import("./Sandbox.vue"),
  SandboxIframe: () => import("./SandboxIframe.vue"),
} satisfies Options;
