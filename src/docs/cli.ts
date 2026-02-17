import { createServer, build, preview, mergeConfig } from "vite";
import { getUserViteConfig, viteConfig } from "./vite-config.js";

const [_, __, command = "dev"] = process.argv;

if (command !== "dev" && command !== "build" && command !== "preview") {
  throw new Error();
}

const userViteConfig = await getUserViteConfig(command);

const mergedViteConfig = mergeConfig(userViteConfig, viteConfig);

if (command === "dev") {
  const server = await createServer(mergedViteConfig);

  await server.listen();

  server.printUrls();
  server.bindCLIShortcuts({ print: true });
} else {
  await build(mergedViteConfig);

  if (command === "preview") {
    const previewServer = await preview(mergedViteConfig);

    previewServer.printUrls();
    previewServer.bindCLIShortcuts({ print: true });
  }
}
