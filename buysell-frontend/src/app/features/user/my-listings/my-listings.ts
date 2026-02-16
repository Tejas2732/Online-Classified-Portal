import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-listings.html',
  styleUrls: ['./my-listings.css']
})
export class MyListingsComponent implements OnInit {

  products: any[] = [];
  loading = false;

  editingProductId: number | null = null;
  editData: any = {};

  errors = {
    name: '',
    price: '',
    quantity: ''
  };

  constructor(
    private productService: ProductService,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.loadMyProducts();
  }

  loadMyProducts() {
    this.loading = true;
    this.productService.getMyProducts().subscribe({
      next: res => {
        this.products = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Failed to load your listings', 'Error'); // Added Error Toast
      }
    });
  }

  edit(product: any) {
    this.editingProductId = product.id;
    this.editData = { ...product };
    this.clearErrors();
  }

  cancelEdit() {
    this.editingProductId = null;
    this.editData = {};
    this.clearErrors();
  }

  /* ================= VALIDATIONS ================= */

  validateName() {
    const name = this.editData.name?.trim() || '';

    if (name.length < 3) {
      this.errors.name = 'Name must be at least 3 characters';
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      this.errors.name = 'Only alphabets allowed';
    } else {
      this.errors.name = '';
    }
  }

  validatePrice() {
    const price = this.editData.price;

    if (price === null || price === '') {
      this.errors.price = 'Price is required';
    } else if (isNaN(price) || price <= 0) {
      this.errors.price = 'Price must be greater than 0';
    } else {
      this.errors.price = '';
    }
  }

  validateQuantity() {
    const qty = this.editData.quantity;

    if (qty === null || qty === '') {
      this.errors.quantity = 'Quantity is required';
    } else if (isNaN(qty) || qty < 1) {
      this.errors.quantity = 'Quantity must be at least 1';
    } else {
      this.errors.quantity = '';
    }
  }

  isFormValid(): boolean {
    return (
      !this.errors.name &&
      !this.errors.price &&
      !this.errors.quantity
    );
  }

  clearErrors() {
    this.errors = { name: '', price: '', quantity: '' };
  }

  /* ================= SAVE ================= */

  save(id: number) {
    if (!this.isFormValid()) {
      this.toastr.warning('Please fix the errors before saving', 'Invalid Data'); // Added Warning Toast
      return;
    }

    this.productService.updateProduct(id, this.editData).subscribe({
      next: () => {
        this.editingProductId = null;
        this.toastr.success('Listing updated successfully', 'Success'); // Added Success Toast
        this.loadMyProducts();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update product', 'Update Error');
      }
    });
  }

  delete(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.toastr.success('Product listing removed', 'Deleted'); // Added Success Toast
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Could not delete product', 'Delete Error');
      }
    });
  }
}


















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../../core/services/product';

// @Component({
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './my-listings.html',
//   styleUrls: ['./my-listings.css']
// })
// export class MyListingsComponent implements OnInit {

//   products: any[] = [];
//   loading = false;

//   editingProductId: number | null = null;
//   editData: any = {};

//   errors = {
//     name: '',
//     price: '',
//     quantity: ''
//   };

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadMyProducts();
//   }

//   loadMyProducts() {
//     this.loading = true;
//     this.productService.getMyProducts().subscribe({
//       next: res => {
//         this.products = res.data || [];
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   edit(product: any) {
//     this.editingProductId = product.id;
//     this.editData = { ...product };
//     this.clearErrors();
//   }

//   cancelEdit() {
//     this.editingProductId = null;
//     this.editData = {};
//     this.clearErrors();
//   }

//   /* ================= VALIDATIONS ================= */

//   validateName() {
//     const name = this.editData.name?.trim() || '';

//     if (name.length < 3) {
//       this.errors.name = 'Name must be at least 3 characters';
//     } else if (!/^[A-Za-z ]+$/.test(name)) {
//       this.errors.name = 'Only alphabets allowed';
//     } else {
//       this.errors.name = '';
//     }
//   }

//   validatePrice() {
//     const price = this.editData.price;

//     if (price === null || price === '') {
//       this.errors.price = 'Price is required';
//     } else if (isNaN(price) || price <= 0) {
//       this.errors.price = 'Price must be greater than 0';
//     } else {
//       this.errors.price = '';
//     }
//   }

//   validateQuantity() {
//     const qty = this.editData.quantity;

//     if (qty === null || qty === '') {
//       this.errors.quantity = 'Quantity is required';
//     } else if (isNaN(qty) || qty < 1) {
//       this.errors.quantity = 'Quantity must be at least 1';
//     } else {
//       this.errors.quantity = '';
//     }
//   }

//   isFormValid(): boolean {
//     return (
//       !this.errors.name &&
//       !this.errors.price &&
//       !this.errors.quantity
//     );
//   }

//   clearErrors() {
//     this.errors = { name: '', price: '', quantity: '' };
//   }

//   /* ================= SAVE ================= */

//   save(id: number) {
//     if (!this.isFormValid()) return;

//     this.productService.updateProduct(id, this.editData).subscribe({
//       next: () => {
//         this.editingProductId = null;
//         this.loadMyProducts();
//       }
//     });
//   }

//   delete(id: number) {
//     this.productService.deleteProduct(id).subscribe({
//       next: () => {
//         this.products = this.products.filter(p => p.id !== id);
//       }
//     });
//   }
// }






// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../../core/services/product';

// @Component({
//   standalone: true,
//   selector: 'app-my-listings',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './my-listings.html',
// })
// export class MyListingsComponent implements OnInit {

//   products: any[] = [];
//   loading = false;

//   editingProductId: number | null = null;
//   editData: any = {};

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadMyProducts();
//   }

//   // ============================
//   // LOAD MY PRODUCTS
//   // ============================
//   loadMyProducts(): void {
//     this.loading = true;

//     this.productService.getMyProducts().subscribe({
//       next: (res: any) => {
//         this.products = res.data || [];
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load listings', err);
//         this.loading = false;
//       }
//     });
//   }

//   // ============================
//   // EDIT
//   // ============================
//   edit(product: any): void {
//     this.editingProductId = product.id;
//     this.editData = { ...product };
//   }

//   cancelEdit(): void {
//     this.editingProductId = null;
//     this.editData = {};
//   }

//   // ============================
//   // SAVE (UPDATE)
//   // ============================
//   save(id: number): void {

//     // 🔒 VALIDATIONS
//     if (!this.editData.name || !/^[A-Za-z ]{3,50}$/.test(this.editData.name)) {
//       alert('Product name must be alphabetic (3–50 chars)');
//       return;
//     }

//     if (!this.editData.price || this.editData.price < 1) {
//       alert('Price must be greater than 0');
//       return;
//     }

//     if (!this.editData.quantity || this.editData.quantity < 1) {
//       alert('Quantity must be at least 1');
//       return;
//     }

//     this.loading = true;

//     const payload = {
//       name: this.editData.name,
//       price: this.editData.price,
//       quantity: this.editData.quantity
//     };

//     this.productService.updateProduct(id, payload).subscribe({
//       next: () => {
//         this.editingProductId = null;
//         this.loadMyProducts(); // refresh
//       },
//       error: (err) => {
//         console.error('Update failed', err);
//         alert('Failed to update product');
//         this.loading = false;
//       }
//     });
//   }

//   // ============================
//   // DELETE
//   // ============================
//   delete(id: number): void {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     this.loading = true;

//     this.productService.deleteProduct(id).subscribe({
//       next: () => {
//         this.products = this.products.filter(p => p.id !== id);
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Delete failed', err);
//         alert('Failed to delete product');
//         this.loading = false;
//       }
//     });
//   }
// }



















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../../core/services/product';

// @Component({
//   standalone: true,
//   selector: 'app-my-listings',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './my-listings.html',
//   styleUrls: ['./my-listings.css']
// })
// export class MyListingsComponent implements OnInit {
 
//   products: any[] = [];
//   loading = false;

//   editingProductId: number | null = null;
//   editData: any = {};

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadMyProducts();
//   }

//   loadMyProducts() {
//     this.loading = true;
//     this.productService.getMyProducts().subscribe({
//       next: res => {
//         this.products = res.data;
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   edit(p: any) {
//     this.editingProductId = p.id;
//     this.editData = { ...p };
//   }

//   save(id: number) {
//     this.productService.updateProduct(id, {
//       name: this.editData.name,
//       price: this.editData.price,
//       quantity: this.editData.quantity
//     }).subscribe(() => {
//       this.editingProductId = null;
//       this.loadMyProducts();
//     });
//   }

//   cancelEdit() {
//     this.editingProductId = null;
//   }

//   delete(id: number) {
//     if (!confirm('Delete this product?')) return;

//     this.productService.deleteProduct(id).subscribe(() => {
//       this.products = this.products.filter(p => p.id !== id);
//     });
//   }
// }









// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   standalone: true,
//   selector: 'app-my-listings',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './my-listings.html'
// })
// export class MyListingsComponent {
//   products: any[] = [];
// }
