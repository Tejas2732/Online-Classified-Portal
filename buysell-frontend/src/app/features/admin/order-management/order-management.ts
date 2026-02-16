import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.css'] 
})
export class OrderManagementComponent implements OnInit {

  orders: any[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: (res) => {
        // Sort orders by date (Newest First)
        this.orders = res.data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
        console.log('Orders loaded and sorted:', this.orders);
        
        // Optional: Show success toast only on manual refresh
        // this.toastr.success('Order list updated', 'Success');
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to load system orders.';
        this.toastr.error(errorMsg, 'Admin Error'); // Added Error Toast
      }
    });
  }

  // Optional: Add a helper to refresh the list manually
  refresh(): void {
    this.toastr.info('Refreshing order list...', 'Please wait'); // Feedback for the manual action
    this.fetchOrders();
  }
}










// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdminService } from '../../../core/services/admin';

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order-management.html',
//   styleUrls: ['./order-management.css'] // Added to link your new styles
// })
// export class OrderManagementComponent implements OnInit {

//   orders: any[] = [];
//   loading = false;

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.fetchOrders();
//   }

//   fetchOrders(): void {
//     this.loading = true;
//     this.adminService.getAllOrders().subscribe({
//       next: (res) => {
//         // Sort orders by date (Newest First)
//         // This ensures the Admin always sees the most recent activity at the top
//         this.orders = res.data.sort((a: any, b: any) => 
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//         this.loading = false;
//         console.log('Orders loaded and sorted:', this.orders);
//       },
//       error: (err) => {
//         console.error('Error fetching orders:', err);
//         this.loading = false;
//       }
//     });
//   }

//   // Optional: Add a helper to refresh the list manually
//   refresh(): void {
//     this.fetchOrders();
//   }
// }











// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AdminService } from '../../../core/services/admin';

// @Component({
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './order-management.html'
// })
// export class OrderManagementComponent implements OnInit {

//   orders: any[] = [];

//   constructor(private adminService: AdminService) {}
 
//   ngOnInit(): void {
//     console.log('Order Management Component Initialized' , this.orders);
//     this.adminService.getAllOrders().subscribe(res => {
//       this.orders = res.data;
//     });
//   }
// }
