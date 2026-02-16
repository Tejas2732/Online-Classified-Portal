// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { NavbarComponent } from '../../../shared/components/navbar/navbar';

// @Component({
//   standalone: true,
//   selector: 'app-user-dashboard',
//   imports: [RouterOutlet, NavbarComponent],
//   templateUrl: './dashboard.html'
// })
// export class DashboardComponent {}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout();
  }
}
