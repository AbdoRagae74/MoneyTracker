import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterModule, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { jwtInterceptor } from './Interceptor/jwt-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,withHashLocation()),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),{
      provide:HTTP_INTERCEPTORS,
      useClass:jwtInterceptor,
      multi:true
    },
    
    
    
  ]
};
