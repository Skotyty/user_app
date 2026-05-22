import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideNzI18n, ru_RU } from 'ng-zorro-antd/i18n';

import { routes } from './app.routes';

registerLocaleData(ru);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(ru_RU),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
