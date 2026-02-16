import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CommonModule } from '@angular/common'; // Required for *ngIf in template
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegisterComponent {
  loading = false;
  form: FormGroup; // Explicitly typed as FormGroup

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService // Injected Toastr
  ) {
    this.form = this.fb.group({
     fullName: ['', [
    Validators.required, 
    Validators.minLength(3), 
    Validators.pattern('^[a-zA-Z ]*$')
  ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]], // Added confirmPassword
      // Regex: starts with 6-9, followed by exactly 9 digits
      phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    }, { 
      validators: this.passwordMatchValidator // Custom validator for matching passwords
    });
  }

  // Custom validator function
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  naviagteToLogin() {
    this.router.navigate(['/login']);
  }

  submit() {
    if (this.form.invalid) {
      this.toastr.warning('Please complete the form correctly', 'Validation Error'); // Added Warning Toast
      this.form.markAllAsTouched(); // Show errors if user clicks submit early
      return;
    }

    console.log(this.form);
    console.log(this.form.value.email);
      // this for checking the @ and . in email
      const isLowercase = this.form.value.email === this.form.value.email.toLowerCase()
      const emailRegex = /^[^@]+@[^@.]+\..{2,}$/;

      if (!isLowercase) {
        this.toastr.error("Email must not contain capital letters.");
        return;
      }
      if (!emailRegex.test(this.form.value.email)) {
        console.log("Invalid email: Must have a provider and a domain (e.g., .com)");
        this.toastr.error("Please enter a valid email address (e.g., name@example.com)");
        return;
      }

    this.loading = true;

    // Create a copy of the value and remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = this.form.value;

    this.auth.register(registerData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Registration successful. Please login.', 'Success'); // Replaced alert with Toast
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'Registration failed. Please try again.'; // Dynamic error message
        this.toastr.error(errorMessage, 'Error'); // Added Error Toast
        console.error('Registration failed', err);
      }
    });
  }
}













// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';
// import { CommonModule } from '@angular/common'; // Required for *ngIf in template

// @Component({
//   standalone: true,
//   selector: 'app-register',
//   templateUrl: './register.html',
//   styleUrls: ['./register.css'],
//   imports: [ReactiveFormsModule, CommonModule]
// })
// export class RegisterComponent {
//   loading = false;
//   form: FormGroup; // Explicitly typed as FormGroup

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router
//   ) {
//     this.form = this.fb.group({
//      fullName: ['', [
//     Validators.required, 
//     Validators.minLength(3), 
//     Validators.pattern('^[a-zA-Z ]*$')
//   ]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       confirmPassword: ['', [Validators.required]], // Added confirmPassword
//       // Regex: starts with 6-9, followed by exactly 9 digits
//       phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
//       address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
//     }, { 
//       validators: this.passwordMatchValidator // Custom validator for matching passwords
//     });
//   }

//   // Custom validator function
//   passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
//     const password = control.get('password');
//     const confirmPassword = control.get('confirmPassword');

//     if (password && confirmPassword && password.value !== confirmPassword.value) {
//       confirmPassword.setErrors({ passwordMismatch: true });
//       return { passwordMismatch: true };
//     }
//     return null;
//   }

//   naviagteToLogin() {
//     this.router.navigate(['/login']);
//   }

//   submit() {
//     if (this.form.invalid) {
//       this.form.markAllAsTouched(); // Show errors if user clicks submit early
//       return;
//     }

//     this.loading = true;

//     // Create a copy of the value and remove confirmPassword before sending to API
//     const { confirmPassword, ...registerData } = this.form.value;

//     this.auth.register(registerData).subscribe({
//       next: () => {
//         this.loading = false;
//         alert('Registration successful. Please login.');
//         this.router.navigate(['/login']);
//       },
//       error: (err) => {
//         this.loading = false;
//         console.error('Registration failed', err);
//       }
//     });
//   }
// }
















// import { Component } from '@angular/core';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   standalone: true,
//   selector: 'app-register',
//   templateUrl: './register.html', styleUrls: ['./register.css'],
//   imports: [ReactiveFormsModule]
// })
// export class RegisterComponent {

//   loading = false;
//   form: any;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router
//   ) {
//     this.form = this.fb.group({
//       fullName: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
//       address: ['']
//     });
//   }

//   naviagteToLogin(){
//     this.router.navigate(['/login']);
//   }

//   submit() {
//     if (this.form.invalid) return;

//     this.loading = true;

//     this.auth.register(this.form.value).subscribe({
//       next: () => {
//         this.loading = false;
//         alert('Registration successful. Please login.');
//         this.router.navigate(['/login']);
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }
// }
















// import { Component } from '@angular/core';
// import { FormBuilder, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';

// @Component({
//   standalone: true,
//   selector: 'app-register',
//   templateUrl: './register.html'
// })
// export class RegisterComponent {

//   loading = false;

//   form = this.fb.group({
//     fullName: ['', [Validators.required, Validators.minLength(3)]],
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', [Validators.required, Validators.minLength(6)]],
//     phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
//     address: ['']
//   });

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router
//   ) {}

//   submit() {
//     if (this.form.invalid) return;

//     this.loading = true;

//     this.auth.register(this.form.value as any).subscribe({
//       next: () => {
//         this.loading = false;
//         alert('Registration successful. Please login.');
//         this.router.navigate(['/login']);
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }
// }
