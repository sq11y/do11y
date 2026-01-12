import type { Plugin } from 'vite';

import markdownPlugin from './markdown/markdown.js';
import metaPlugin from './meta/meta.js';
import customBlockPlugin from 'v-custom-block';
import optionsPlugin from './options/options.js';
import routesPlugin from './routes/routes.js';
import uiPlugin from './ui/ui.js';
import sandboxPlugin from './sandbox/sandbox.js';

import { options } from '../options.js';

export const plugins = (): Plugin[] => [
  uiPlugin(),
  sandboxPlugin(),

  metaPlugin(),
  markdownPlugin(options),
  customBlockPlugin('docs'),

  optionsPlugin(),
  routesPlugin(),
];
