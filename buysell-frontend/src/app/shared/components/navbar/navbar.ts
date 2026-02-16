import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  logout() {
    this.auth.logout();
  }
}












// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   standalone: true,
//   selector: 'app-navbar',
//   templateUrl: './navbar.html'
// })
// export class NavbarComponent {

//   constructor(
//     public auth: AuthService,
//     private router: Router
//   ) {}

//   logout() {
//     this.auth.logout();
//     this.router.navigate(['/login']);
//   }
// }
