export const queries = {
  meta: "?meta",
  highlight: "?highlight",
  highlightCSS: "?highlight&lang=css",
  highlightStyleless: "?highlight&styleless",
} as const;

export const highlightQueries: Query[] = [
  queries.highlight,
  queries.highlightCSS,
  queries.highlightStyleless,
];

export type Query = (typeof queries)[keyof typeof queries];

export const isHighlightQuery = (query: Query) => highlightQueries.includes(query);

export const parseRequest = (id: string) => {
  const query = Object.values(queries).find((query) => id.endsWith(`.vue${query}`));
  return query ? { path: id.slice(0, -query.length), query } : undefined;
};
