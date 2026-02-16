import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  loading = false;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.adminService.getAllProducts().subscribe({
      next: res => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Failed to load marketplace products.';
        this.toastr.error(errorMsg, 'Admin Error');
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to remove this product from the marketplace?')) {
      this.adminService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.toastr.success('Product removed successfully', 'Marketplace Updated');
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Could not delete product.';
          this.toastr.error(errorMsg, 'Action Failed');
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
//   templateUrl: './product-management.html',
//   styleUrls: ['./product-management.css']
// })
// export class ProductManagementComponent implements OnInit {
//   products: any[] = [];
//   loading = false;

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

//   loadProducts() {
//     this.loading = true;
//     this.adminService.getAllProducts().subscribe({
//       next: res => {
//         this.products = res.data;
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   deleteProduct(id: number) {
//     if (confirm('Are you sure you want to remove this product from the marketplace?')) {
//       this.adminService.deleteProduct(id).subscribe(() => {
//         this.products = this.products.filter(p => p.id !== id);
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
//   templateUrl: './product-management.html'
// })
// export class ProductManagementComponent implements OnInit {

//   products: any[] = [];

//   constructor(private adminService: AdminService) {}

//   ngOnInit(): void {
//     this.adminService.getAllProducts().subscribe(res => {
//       this.products = res.data;
//     });
//   }

//   deleteProduct(id: number) {
//     this.adminService.deleteProduct(id).subscribe(() => {
//       this.products = this.products.filter(p => p.id !== id);
//     });
//   }
// }
