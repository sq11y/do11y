export const render = (favicon: string, script: string, stylesheets: string[] = []) => `
  <!doctype html>

  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <title>Do11y</title>
      <link rel="icon" href="${favicon}" />
      ${stylesheets.map((href) => `<link rel="stylesheet" href="${href}" />`).join("\n")}
      <script type="module" src="${script}"></script>
    </head>

    <body id="app"></body>
  </html>
`;
