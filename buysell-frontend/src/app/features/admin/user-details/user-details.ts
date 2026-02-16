import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.css']
})
export class UserDetailsComponent implements OnInit {
  user: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.fetchUserDetails(userId);
    }
  }

  navigateToUser(){
    this.router.navigate(['/admin/users']);
  }

 fetchUserDetails(id: number) {
  console.log('Fetching user details for ID:', id);

  this.loading = true;
  this.adminService.getUserById(id).subscribe({
    next: (res) => {
      // We ensure 'blocked' is treated as a boolean immediately
      this.user = {
        ...res.data,
        blocked: !!res.data.blocked 
      };
      this.loading = false;
      console.log('User details:', this.user);
    },
    error: () => {
      this.toastr.error('User not found');
      this.navigateToUser();
      this.loading = false;
    }
  });
}

 toggleBlockStatus() {
  const isBlocked = this.user.blocked;
  const nextStatus = !isBlocked; // if currently blocked, nextStatus is false (unblock)
  const actionText = nextStatus ? 'block' : 'unblock';

  if (confirm(`Are you sure you want to ${actionText} this user?`)) {
    // We pass nextStatus to the service
    this.adminService.toggleBlock(this.user.id, nextStatus).subscribe({
      next: () => {
        this.user.blocked = nextStatus;
        this.toastr.success(`User ${nextStatus ? 'Blocked' : 'Unblocked'} successfully`);
      },
      error: (err: any) => {
        this.toastr.error(err.error?.message || 'Action failed');
      }
    });
  }
}

  deleteUser() {
    if (confirm('Permanently delete this user?')) {
      this.adminService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.toastr.success('User deleted');
          this.router.navigate(['/admin/users']);
        }
      });
    }
  }

  deleteProducts() {
    if (confirm('Delete all products listed by this user?')) {
      this.adminService.deleteUserProducts(this.user.id).subscribe({
        next: () => this.toastr.success('User products cleared')
      });
    }
  }
}