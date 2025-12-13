import type { Plugin } from 'vite';

import { ui } from '../../files.js';
import { html } from '../../html/html.js';

/**
 * The main application.
 */
export default (): Plugin => ({
  name: 'do11y:ui',

  ...html(ui, 'index'),
});
