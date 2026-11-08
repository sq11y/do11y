import type MarkdownIt from "markdown-it";

import replaceLinkPlugin from "markdown-it-replace-link";

const getLinkType = (url: string) => {
  if (url.startsWith("#")) {
    return "anchor";
  }

  if (URL.canParse(url)) {
    return "absolute";
  }

  if (URL.canParse(url, "https://github.com/sq11y/do11y")) {
    return "relative";
  }

  return "invalid";
};

export const markdownReplaceLinkPlugin = (getBase: () => string) => {
  return (md: MarkdownIt) => {
    md.use(replaceLinkPlugin, {
      replaceLink: (link) => {
        const resolvedBase = getBase();
        const url = resolvedBase.startsWith("/") ? link.replace(/^\//, "") : link;
        return getLinkType(link) === "relative" ? `${resolvedBase}${url}` : link;
      },
    });
  };
};
