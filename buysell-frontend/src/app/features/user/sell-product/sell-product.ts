import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category';
import { ProductService } from '../../../core/services/product';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sell-product.html',
  styleUrls: ['./sell-product.css']
})
export class SellProductComponent implements OnInit {

  form!: FormGroup;
  categories: any[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService // Injected Toastr
  ) {}
  
  ngOnInit() {
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]
      ],
      description: [
        '',
        [Validators.required, Validators.maxLength(200)]
      ],
      price: [
        null,
        [Validators.required, Validators.min(1)]
      ],
      quantity: [
        1,
        [Validators.required, Validators.min(1)]
      ],
      categoryId: ['', Validators.required]
    });
  
    this.loadCategories(); // ✅ CALL HERE
  }
  
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: () => {
        this.toastr.error('Failed to load categories. Please try again later.', 'Data Error'); // Replaced alert
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.toastr.warning('Please fill in all required fields correctly.', 'Validation Error'); // Added Warning Toast
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    console.log('SELL PRODUCT PAYLOAD:', this.form.value);

    this.productService.createProduct(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Product listed for sale successfully!', 'Success'); // Added Success Toast
        this.router.navigate(['/user/listings']);
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'Failed to create product listing.';
        this.toastr.error(errorMessage, 'Listing Failed'); // Added Error Toast
      }
    });
  }
}















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CategoryService } from '../../../core/services/category';
// import { ProductService } from '../../../core/services/product';
// import { Router } from '@angular/router';


// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './sell-product.html',
//   styleUrls: ['./sell-product.css']
// })
// export class SellProductComponent implements OnInit {

//   form!: FormGroup;
//   categories: any[] = [];
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private categoryService: CategoryService,
//      private productService: ProductService,
//       private router: Router
//   ) {}
  
//   ngOnInit() {
//     this.form = this.fb.group({
//       name: [
//         '',
//         [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]
//       ],
//       description: [
//         '',
//         [Validators.required, Validators.maxLength(200)]
//       ],
//       price: [
//         null,
//         [Validators.required, Validators.min(1)]
//       ],
//       quantity: [
//         1,
//         [Validators.required, Validators.min(1)]
//       ],
//       categoryId: ['', Validators.required]
//     });
  
//     this.loadCategories(); // ✅ CALL HERE
//   }
  
//   loadCategories() {
//     this.categoryService.getAllCategories().subscribe({
//       next: (res) => {
//         this.categories = res.data;
//       },
//       error: () => {
//         alert('Failed to load categories');
//       }
//     });
//   }

//   submit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     this.loading = true;
//     console.log('SELL PRODUCT PAYLOAD:', this.form.value);

//     // API call here later
    
//     this.loading = true;

//     this.productService.createProduct(this.form.value).subscribe({
//       next: () => {
//         this.loading = false;
//         this.router.navigate(['/user/listings']);
//       },
//       error: () => this.loading = false
//     });
//   }
// }













// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CategoryService } from '../../../core/services/category';
// import { ProductService } from '../../../core/services/product';
// import { Router } from '@angular/router';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './sell-product.html',
//   styleUrls: ['./sell-product.css']
// })
// export class SellProductComponent implements OnInit {

//   form!: FormGroup;
//   categories: any[] = [];
//   loading = false;

//   constructor( 
//     private fb: FormBuilder,
//     private categoryService: CategoryService,
//     private productService: ProductService,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       name: ['', Validators.required],
//       description: [''],
//       price: ['', Validators.required],
//       quantity: [1, Validators.required],
//       categoryId: ['', Validators.required]
//     });

//     this.loadCategories();
//   }

//   loadCategories() {
//     this.categoryService.getAllCategories().subscribe({
//       next: res => {
//         this.categories = res.data;
//       },
//       error: err => {
//         console.error('Failed to load categories', err);
//       }
//     });
//   }

//   submit() {
//     if (this.form.invalid) return;

//     this.loading = true;

//     this.productService.createProduct(this.form.value).subscribe({
//       next: () => {
//         this.loading = false;
//         this.router.navigate(['/user/listings']);
//       },
//       error: () => this.loading = false
//     });
//   }
// }
