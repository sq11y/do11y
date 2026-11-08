import type MarkdownIt from "markdown-it";

import replaceLinkPlugin from "markdown-it-replace-link";

export const markdownReplaceLinkPlugin = (getBase: () => string) => {
  return (md: MarkdownIt) => {
    md.use(replaceLinkPlugin, {
      replaceLink: (link) => {
        const isRootLink = link.startsWith("/") && !link.startsWith("//");
        return !isRootLink ? link : `${getBase().replace(/\/$/, "")}${link}`;
      },
    });
  };
};
