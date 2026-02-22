import { do11y } from "./files.js";

import type { Options, ResolvedOptions } from "./plugins/options.js";

const resolveOptions = async (): Promise<ResolvedOptions> => {
  const options: Options = (await import(do11y)).default;

  const themes = options.highlighter?.themes.map(async (theme) => {
    if (typeof theme === "string") {
      return theme;
    } else {
      const resolvedTheme = await (typeof theme === "function" ? await theme() : theme);
      return "default" in resolvedTheme ? resolvedTheme.default.name : resolvedTheme.name;
    }
  });

  /* prettier-ignore */
  let resolvedThemes = (await Promise.all(themes ?? [])).filter((theme): theme is string => !!theme);

  if (!resolvedThemes.length) {
    resolvedThemes = ["vitesse-light", "vitesse-black", "vitesse-dark"];
  }

  const themesInput: Record<string, string> = {};
  resolvedThemes.forEach((theme) => (themesInput[theme] = theme));

  return {
    ...options,

    highlighter: {
      defaultTheme: options.highlighter?.defaultTheme || resolvedThemes[0],
      themes: options.highlighter?.themes ?? [],
      themesInput,

      transformers: options.highlighter?.transformers || [],
      postprocess: options.highlighter?.postprocess,
    },
  };
};

/**
 * Access plugin options (`docs/do11y/do11y.ts`).
 */
export const do11yOptions: ResolvedOptions = await resolveOptions();
