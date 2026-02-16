import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Added for navigation
import { AdminService } from '../../../core/services/admin';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

// Interface for better type safety and auto-completion
interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSalesAmount?: number; // Optional as it might be null initially
}

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'] // Ensure your CSS file is linked
})
export class AdminDashboardComponent implements OnInit {

  stats: AdminStats | null = null;
  loading = false; 

  constructor(
    private adminService: AdminService,
    private router: Router, // Injected Router
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (res) => { 
        this.stats = res.data;
        this.loading = false;
        console.log('Admin stats:', this.stats);
        // Optional: Success toast for data refresh
        // this.toastr.success('Dashboard data updated', 'Admin Portal');
      },
      error: (err) => {
        console.error('Error fetching admin stats:', err);
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to load dashboard statistics.';
        this.toastr.error(errorMsg, 'Admin Error'); // Feedback for Admin
      }
    });
  }

  /**
   * Navigates to the specified admin route
   * @param path The route to navigate to (e.g., '/admin/users')
   */
  go(path: string): void {
    this.router.navigate([path]);
  }
}

















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router'; // Added for navigation
// import { AdminService } from '../../../core/services/admin';

// // Interface for better type safety and auto-completion
// interface AdminStats {
//   totalUsers: number;
//   totalProducts: number;
//   totalOrders: number;
//   totalSalesAmount?: number; // Optional as it might be null initially
// }

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './admin-dashboard.html',
//   styleUrls: ['./admin-dashboard.css'] // Ensure your CSS file is linked
// })
// export class AdminDashboardComponent implements OnInit {

//   stats: AdminStats | null = null;
//   loading = false; 

//   constructor(
//     private adminService: AdminService,
//     private router: Router // Injected Router
//   ) {}

//   ngOnInit(): void {
//     this.fetchStats();
//   }

//   fetchStats(): void {
//     this.loading = true;
//     this.adminService.getDashboardStats().subscribe({
//       next: (res) => {
//         this.stats = res.data;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching admin stats:', err);
//         this.loading = false;
//       }
//     });
//   }

//   /**
//    * Navigates to the specified admin route
//    * @param path The route to navigate to (e.g., '/admin/users')
//    */
//   go(path: string): void {
//     this.router.navigate([path]);
//   }
// }