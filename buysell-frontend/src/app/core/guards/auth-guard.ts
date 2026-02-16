import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (auth.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};












// import { CanActivateFn, Router } from '@angular/router';

// export const authGuard: CanActivateFn = () => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   if (token && role === 'USER') {
//     return true;
//   }

//   //  Admin or unauth user trying user area
//   window.location.href = '/login';
//   return false;
// };














// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   if (auth.isLoggedIn()) return true;

//   router.navigate(['/login']);
//   return false;
// };
