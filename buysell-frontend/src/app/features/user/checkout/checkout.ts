import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product';
import { OrderService } from '../../../core/services/order';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent implements OnInit {
 
  product: any = null;
  loading = false;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!productId) {
      this.toastr.error('Invalid product selected', 'Error'); // Replaced alert
      this.router.navigate(['/user/dashboard']);
      return;
    }

    this.loadProduct(productId);

    this.form = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      paymentMethod: ['WALLET', Validators.required],
      cardNumber: [''],
      cardHolderName: [''],
      expiry: [''],
      cvv: ['']
    });
    
    this.form.get('paymentMethod')?.valueChanges.subscribe(method => {
      if (method === 'CARD') {
        this.form.get('cardNumber')?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{16}$/)
        ]);
    
        this.form.get('cardHolderName')?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Za-z ]{3,26}$/)
        ]);
    
        this.form.get('expiry')?.setValidators([
          Validators.required,
          expiryDateValidator()
        ]);
    
        this.form.get('cvv')?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{3}$/)
        ]);
      } else {
        this.form.get('cardNumber')?.clearValidators();
        this.form.get('cardHolderName')?.clearValidators();
        this.form.get('expiry')?.clearValidators();
        this.form.get('cvv')?.clearValidators();
      }
    
      this.form.get('cardNumber')?.updateValueAndValidity();
      this.form.get('cardHolderName')?.updateValueAndValidity();
      this.form.get('expiry')?.updateValueAndValidity();
      this.form.get('cvv')?.updateValueAndValidity();
    });
    
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: res => {
        this.product = res.data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Product not found or unavailable', 'Load Failed'); // Replaced alert
        this.loading = false;
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

  onExpiryInput(event: Event) {
    const input = event.target as HTMLInputElement;
  
    // remove non-digits
    let value = input.value.replace(/\D/g, '');
  
    // auto add slash after month
    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
  
    input.value = value;
    this.form.get('expiry')?.setValue(value, { emitEvent: false });
  }
  
  
  submit() {
    if (this.form.invalid) {
      this.toastr.warning('Please check your payment details', 'Invalid Form'); // Feedback for user
      return;
    }

    if (!this.product) return;

    const payload: any = {
      productId: this.product.id,
      quantity: this.form.value.quantity,
      paymentMethod: this.form.value.paymentMethod
    };

    if (payload.paymentMethod === 'CARD') {
      payload.cardDetails = {
        cardNumber: this.form.value.cardNumber,
        cardHolderName: this.form.value.cardHolderName,
        expiry: this.form.value.expiry,
        cvv: this.form.value.cvv
      };
    }

    this.loading = true;
    console.log('ORDER PAYLOAD:', payload); 

    this.orderService.createOrder(payload).subscribe({
      next: res => {
        this.loading = false;
        this.toastr.success('Order placed successfully!', 'Success'); // Added Success Toast
        this.router.navigate(['/user/confirmation'], {
          state: { receipt: res.data }
        });
      },
      error: err => {
        console.error('ORDER FAILED:', err);
        const errorMsg = err?.error?.message || 'Order failed to process';
        this.toastr.error(errorMsg, 'Checkout Error'); // Replaced alert
        this.loading = false;
      }
    });
  }
}


export function expiryDateValidator(): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    // Expected format MM/YY
    const match = value.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    if (!match) return { expiryInvalid: true };

    const [month, year] = value.split('/').map(Number);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { expiryPast: true };
    }

    return null;
  };
}














// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ProductService } from '../../../core/services/product';
// import { OrderService } from '../../../core/services/order';
// import { AbstractControl, ValidatorFn } from '@angular/forms';
// import {  ValidationErrors } from '@angular/forms';


// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './checkout.html',
//   styleUrls: ['./checkout.css'],
// })
// export class CheckoutComponent implements OnInit {
 
//   product: any = null;
//   loading = false;
//   form!: FormGroup;

//   constructor(
//     private route: ActivatedRoute,
//     private productService: ProductService,
//     private orderService: OrderService,
//     private fb: FormBuilder,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     const productId = Number(this.route.snapshot.paramMap.get('id'));

//     if (!productId) {
//       alert('Invalid product');
//       this.router.navigate(['/user/dashboard']);
//       return;
//     }

//     this.loadProduct(productId);

//     this.form = this.fb.group({
//       quantity: [1, [Validators.required, Validators.min(1)]],
//       paymentMethod: ['WALLET', Validators.required],
//       cardNumber: [''],
//       cardHolderName: [''],
//       expiry: [''],
//       cvv: ['']
//     });
    
//     this.form.get('paymentMethod')?.valueChanges.subscribe(method => {
//       if (method === 'CARD') {
//         this.form.get('cardNumber')?.setValidators([
//           Validators.required,
//           Validators.pattern(/^\d{16}$/)
//         ]);
    
//         this.form.get('cardHolderName')?.setValidators([
//           Validators.required,
//           Validators.pattern(/^[A-Za-z ]{3,26}$/)
//         ]);
    
//         this.form.get('expiry')?.setValidators([
//           Validators.required,
//           expiryDateValidator()
//         ]);
    
//         this.form.get('cvv')?.setValidators([
//           Validators.required,
//           Validators.pattern(/^\d{3}$/)
//         ]);
//       } else {
//         this.form.get('cardNumber')?.clearValidators();
//         this.form.get('cardHolderName')?.clearValidators();
//         this.form.get('expiry')?.clearValidators();
//         this.form.get('cvv')?.clearValidators();
//       }
    
//       this.form.get('cardNumber')?.updateValueAndValidity();
//       this.form.get('cardHolderName')?.updateValueAndValidity();
//       this.form.get('expiry')?.updateValueAndValidity();
//       this.form.get('cvv')?.updateValueAndValidity();
//     });
    
//   }

//   loadProduct(id: number) {
//     this.loading = true;
//     this.productService.getProductById(id).subscribe({
//       next: res => {
//         this.product = res.data;
//         this.loading = false;
//       },
//       error: () => {
//         alert('Product not found');
//         this.loading = false;
//         this.router.navigate(['/user/dashboard']);
//       }
//     });
//   }

//   onExpiryInput(event: Event) {
//     const input = event.target as HTMLInputElement;
  
//     // remove non-digits
//     let value = input.value.replace(/\D/g, '');
  
//     // auto add slash after month
//     if (value.length >= 3) {
//       value = value.substring(0, 2) + '/' + value.substring(2, 4);
//     }
  
//     input.value = value;
//     this.form.get('expiry')?.setValue(value, { emitEvent: false });
//   }
  
  
//   submit() {
//     if (this.form.invalid || !this.product) return;

//     const payload: any = {
//       productId: this.product.id,
//       quantity: this.form.value.quantity,
//       paymentMethod: this.form.value.paymentMethod
//     };

//     if (payload.paymentMethod === 'CARD') {
//       payload.cardDetails = {
//         cardNumber: this.form.value.cardNumber,
//         cardHolderName: this.form.value.cardHolderName,
//         expiry: this.form.value.expiry,
//         cvv: this.form.value.cvv
//       };
//     }

//     this.loading = true;
//     console.log('ORDER PAYLOAD:', payload); // 👈 DEBUG LINE

//     this.orderService.createOrder(payload).subscribe({
//       next: res => {
//         this.loading = false;
//         console.log('ORDER SUCCESS:', res);
//         this.router.navigate(['/user/confirmation'], {
//           state: { receipt: res.data }
//         });
//       },
//       error: err => {
//         console.error('ORDER FAILED:', err);
//         alert(err?.error?.message || 'Order failed');
//         this.loading = false;
//       }
//     });
//   }
// }


// export function expiryDateValidator(): (control: AbstractControl) => ValidationErrors | null {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value;
//     if (!value) return null;

//     // Expected format MM/YY
//     const match = value.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
//     if (!match) return { expiryInvalid: true };

//     const [month, year] = value.split('/').map(Number);
//     const now = new Date();
//     const currentMonth = now.getMonth() + 1;
//     const currentYear = now.getFullYear() % 100;

//     if (year < currentYear || (year === currentYear && month < currentMonth)) {
//       return { expiryPast: true };
//     }

//     return null;
//   };
// }