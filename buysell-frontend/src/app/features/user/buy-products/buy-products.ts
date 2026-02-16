import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductService } from '../../../core/services/product';
import { AuthService } from '../../../core/services/auth';
import { Product } from '../../../shared/models/product.model';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  selector: 'app-buy-products',
  templateUrl: './buy-products.html',
  styleUrls: ['./buy-products.css'],
  imports: [CommonModule]
})
export class BuyProductsComponent implements OnInit {

  products: Product[] = [];
  loading = false;
  myUserId: number | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.myUserId = this.authService.getUserId();
    console.log('Logged in user id →', this.myUserId);

    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
      
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const loggedInUserId = user.id;

    this.productService.getAvailableProducts().subscribe({
      next: (res) => {
        const allProducts = res.data?.content || [];

        // FILTER OUT MY OWN PRODUCTS
        this.products = allProducts.filter(
          (p: any) => p.sellerId !== loggedInUserId
        );

        this.loading = false;
        
        // Optional: Show a toast if no products are available
        if (this.products.length === 0) {
          this.toastr.info('No products available from other sellers.', 'Empty Marketplace');
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'Failed to load products. Please refresh.';
        this.toastr.error(errorMessage, 'Error'); // Added Error Toast
        console.error('Failed to load products', err);
      }
    });
  }

  buy(product: Product): void {
    this.toastr.info(`Proceeding to checkout for ${product.name}`, 'Checkout'); // Feedback when clicking buy
    this.router.navigate(['/user/checkout', product.id], {
      state: { product }
    });
  }
}













// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { ProductService } from '../../../core/services/product';
// import { AuthService } from '../../../core/services/auth';
// import { Product } from '../../../shared/models/product.model';

// @Component({
//   standalone: true,
//   selector: 'app-buy-products',
//   templateUrl: './buy-products.html',
//   styleUrls: ['./buy-products.css'],
//   imports: [CommonModule]
// })
// export class BuyProductsComponent implements OnInit {

//   products: Product[] = [];
//   loading = false;
//   myUserId: number | null = null;

//   constructor(
//     private productService: ProductService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.myUserId = this.authService.getUserId();
//     console.log('Logged in user id →', this.myUserId);

//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.loading = true;
     
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//         const loggedInUserId = user.id;

//     this.productService.getAvailableProducts().subscribe({
//       next: (res) => {
//         const allProducts = res.data?.content || [];

//         // ✅ FILTER OUT MY OWN PRODUCTS
//         this.products = allProducts.filter(
//           (p: any) => p.sellerId !== loggedInUserId

//         );

//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load products', err);
//         this.loading = false;
//       }
//     });
//   }

//   buy(product: Product): void {
//     this.router.navigate(['/user/checkout', product.id], {
//       state: { product }
//     });
//   }
// }








// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { ProductService } from '../../../core/services/product';
// import { AuthService } from '../../../core/services/auth';
// import { Product } from '../../../shared/models/product.model';

// @Component({
//   standalone: true,
//   selector: 'app-buy-products',
//   templateUrl: './buy-products.html',
//   imports: [CommonModule]
// })
// export class BuyProductsComponent implements OnInit {

//   products: Product[] = [];
//   loading = false;
//   myUserId!: number | null;

//   constructor(
//     private productService: ProductService,
//     private authService: AuthService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.myUserId = this.authService.getUserId();
//     this.loadProducts();
//   }

//   loadProducts(): void {
//     this.loading = true;
  
//     const user = JSON.parse(localStorage.getItem('user') || '{}');
//     const loggedInUserId = user.id;
  
//     console.log("logged user id is  -> " , loggedInUserId);

//     this.productService.getAvailableProducts().subscribe({
//       next: (res) => {
//         const allProducts = res.data?.content || [];
  
//         // ✅ FILTER OUT MY OWN PRODUCTS
//         this.products = allProducts.filter(
//           (p: any) => p.sellerId !== loggedInUserId
//           // OR p.seller?.id !== loggedInUserId (depends on DTO)
//         );
  
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load products', err);
//         this.loading = false;
//       }
//     });
//   }
  
//   buy(product: Product): void {
//     this.router.navigate(['/user/checkout', product.id], {
//       state: { product }
//     });
//   }
// }

















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { ProductService } from '../../../core/services/product';
// import { Product } from '../../../shared/models/product.model';

// @Component({
//   standalone: true,
//   selector: 'app-buy-products',
//   templateUrl: './buy-products.html',
//   imports: [CommonModule]   // 🔴 REQUIRED
// })
// export class BuyProductsComponent implements OnInit {

//   products: Product[] = [];
//   loading = false;

//   constructor(
//     private productService: ProductService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }
  
//   loadProducts(): void {
//     this.loading = true;
  
//     this.productService.getAvailableProducts().subscribe({
//       next: (res) => {
//         this.products = res.data?.content || []; // 🔥 FIX HERE
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load products', err);
//         this.loading = false;
//       }
//     });
//   }
  

//   buy(product: Product): void {
//     this.router.navigate(['/user/checkout', product.id]);
//   }
// }
