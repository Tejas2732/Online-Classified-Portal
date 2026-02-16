import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';                                                       


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]) // ✅ THIS LINE FIXES 403
    ),
    provideAnimations(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ]
};










// import { ApplicationConfig } from '@angular/core';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// // import { authInterceptor } from './core/interceptors/auth-interceptor';
// import { ErrorInterceptor } from './core/interceptors/error-interceptor';
// // import { provideForms } from '@angular/forms';
// import { AuthInterceptor } from './core/interceptors/auth-interceptor';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     // provideForms(),  
//     provideRouter(routes),
//     provideHttpClient(
//       withInterceptors([
//         // authInterceptor,
//         ErrorInterceptor,
//         AuthInterceptor
//       ])
//     )
//   ]
// };

// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withInterceptorsFromDi()),
//     provideAnimations()
//   ]
// };