import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css'],
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];
  loading = false; 

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.orderService.getMyOrders().subscribe({
      next: res => {
        this.orders = res.data || [];
        this.loading = false;
        
        if (this.orders.length === 0) {
          this.toastr.info('You have not placed any orders yet.', 'No Orders Found');
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to fetch your orders.';
        this.toastr.error(errorMsg, 'Error'); // Added error feedback
      }
    });
  }

  deleteOrder(id: number) {
    // Optional: You could add a confirmation toast here, 
    // but for now, we will notify on success.
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.orders = this.orders.filter(o => o.id !== id);
        this.toastr.success('Order deleted successfully', 'Order Updated'); // Success Feedback
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Could not delete order.';
        this.toastr.error(errorMsg, 'Delete Failed');
      }
    });
  }
}













// import { Component, OnInit } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { OrderService } from '../../../core/services/order';

// @Component({
//   standalone: true,
//   imports: [CommonModule, DatePipe],
//   templateUrl: './my-orders.html',
//   styleUrls: ['./my-orders.css'],

// })
// export class MyOrdersComponent implements OnInit {

//   orders: any[] = [];
//   loading = false; 

//   constructor(private orderService: OrderService) {}

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   loadOrders() {
//     this.loading = true;

//     this.orderService.getMyOrders().subscribe({
//       next: res => {
//         this.orders = res.data || [];
//         this.loading = false;
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }

//   deleteOrder(id: number) {
//     this.orderService.deleteOrder(id).subscribe({
//       next: () => {
//         this.orders = this.orders.filter(o => o.id !== id);
//       }
//     });
//   }
// }
