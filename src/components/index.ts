import type { App } from 'vue';
import { Icon } from './Icon';

export function registerGlobComp(app: App) {
  app.component('Icon', Icon);
}
