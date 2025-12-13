import type { Plugin } from 'vite';

import markdownPlugin from './markdown/markdown.js';
import customBlockPlugin from 'v-custom-block';
import sitePlugin from './site/site.js';
import routesPlugin from './routes/routes.js';
import uiPlugin from './ui/ui.js';
import sandboxPlugin from './sandbox/sandbox.js';

import { pluginOptions } from '../plugin-options.js';

export const plugins = (): Plugin[] => [
  uiPlugin(),
  sandboxPlugin(),

  markdownPlugin(pluginOptions),
  customBlockPlugin('docs'),

  sitePlugin(),
  routesPlugin(),
];
