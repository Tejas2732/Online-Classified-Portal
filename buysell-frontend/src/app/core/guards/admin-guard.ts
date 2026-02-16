import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn() || !auth.isAdmin()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};















// import { CanActivateFn } from '@angular/router';

// export const adminGuard: CanActivateFn = () => {
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

//   return !!token && role === 'ADMIN';
// };








// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth';

// export const adminGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   if (auth.isAdmin()) return true;

//   router.navigate(['/login']);
//   return false;
// };
