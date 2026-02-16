import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {

  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService ,// Injected Toastr
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res) => {
        // FEATURE: Filter the list so only 'USER' role is visible
        this.users = res.data.filter((user: any) => user.role === 'USER');
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to load user list.';
        this.toastr.error(errorMsg, 'Admin Error');
      }
    });
  }

  // changes 
  viewUser(id: number) {
  this.router.navigate(['/admin/users', id]);
}

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.toastr.success('User deleted successfully', 'Management Updated');
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Could not delete user.';
          this.toastr.error(errorMsg, 'Delete Failed');
        }
      });
    }
  }

  deleteUserProducts(id: number) {
    if (confirm('Delete all products listed by this user?')) {
      this.adminService.deleteUserProducts(id).subscribe({
        next: () => {
          this.toastr.success('Products deleted successfully', 'Success'); // Replaced alert
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Failed to delete user products.';
          this.toastr.error(errorMsg, 'Error');
        }
      });
    }
  }
}




 













// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdminService } from '../../../core/services/admin';

// @Component({
//   standalone: true,
//   imports: [CommonModule], 
//   templateUrl: './user-management.html',
//   styleUrls: ['./user-management.css']
// })
// export class UserManagementComponent implements OnInit {

//   users: any[] = [];

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.adminService.getAllUsers().subscribe(res => {
//       // FEATURE: Filter the list so only 'USER' role is visible
//       // This prevents the admin from seeing or deleting other admins
//       this.users = res.data.filter((user: any) => user.role === 'USER');
//     });
//   }

//   deleteUser(id: number) {
//     if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       this.adminService.deleteUser(id).subscribe(() => {
//         this.users = this.users.filter(u => u.id !== id);
//       });
//     }
//   }

//   deleteUserProducts(id: number) {
//     if (confirm('Delete all products listed by this user?')) {
//       this.adminService.deleteUserProducts(id).subscribe(() => {
//         alert('Products deleted successfully');
//       });
//     }
//   }
// }










// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdminService } from '../../../core/services/admin';

// @Component({
//   standalone: true,
//   imports: [CommonModule], 
//   templateUrl: './user-management.html'
// })
// export class UserManagementComponent implements OnInit {

//   users: any[] = [];

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.adminService.getAllUsers().subscribe(res => {
//       this.users = res.data;
//     });
//   }

//   deleteUser(id: number) {
//     this.adminService.deleteUser(id).subscribe(() => {
//       this.users = this.users.filter(u => u.id !== id);
//     });
//   }

//   deleteUserProducts(id: number) {
//     this.adminService.deleteUserProducts(id).subscribe();
//   }
// }
