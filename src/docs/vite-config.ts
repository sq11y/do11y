import { join } from "node:path";

import { loadConfigFromFile, type PluginOption, type Plugin, type UserConfig } from "vite";

import type { Api } from "@vitejs/plugin-vue";

import { docs, ui, output } from "./files.js";
import { plugins } from "./plugins/plugins.js";

export const getUserViteConfig = async (command: "dev" | "build" | "preview") => {
  const userConfigFile = await loadConfigFromFile({
    command: command === "dev" ? "serve" : "build",
    mode: command === "dev" ? "dev" : "build",
  });

  const config = userConfigFile?.config ?? {};

  return {
    plugins: await getUserPlugins(config),
    resolve: config.resolve,
  };
};

const getPlugin = async (plugin: PluginOption): Promise<Plugin[]> => {
  if (!plugin) {
    return [];
  }

  if (typeof plugin === "function") {
    return [await plugin()];
  } else if ("name" in plugin) {
    return [plugin];
  } else if (Array.isArray(plugin)) {
    return (await Promise.all(plugin.map(async (p) => await getPlugin(p)))).flat();
  } else {
    return (await getPlugin(await plugin)).flat();
  }
};

const getUserPlugins = async (userViteConfig: UserConfig) => {
  const userPlugins = userViteConfig.plugins?.map(async (p) => await getPlugin(p)) ?? [];
  const resolvedUserPlugins = (await Promise.all(userPlugins)).flat();
  const vuePluginApi = resolvedUserPlugins.find((p) => p.name === "vite:vue")!.api as Api;

  const VuePlugin = (await import("@vitejs/plugin-vue")).default;

  return [
    VuePlugin({
      ...vuePluginApi.options,

      include: [/\.vue$/, /\.md$/],
      exclude: [/\.vue\?meta$/, /\.vue\?highlight$/, /\.vue\?highlight&lang=css$/],
    }),

    ...resolvedUserPlugins.filter((i) => i.name !== "vite:vue"),
  ];
};

export const viteConfig = {
  root: docs,
  plugins: plugins(),

  server: {
    port: 1998,
  },

  preview: {
    port: 1996,
  },

  build: {
    manifest: true,
    outDir: output,

    rollupOptions: {
      input: {
        index: join(ui, "index.js"),
        sandbox: join(ui, "sandbox.js"),
      },

      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
} satisfies UserConfig;
