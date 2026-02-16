import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user'; // Ensure this is imported
import { ToastrService } from 'ngx-toastr';
// import { AuthService } from '../../../core/services/auth';

@Component({ 
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  loading = false;
  form!: FormGroup;
  
  // Forgot Password Variables
  showResetModal = false;
  resetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userService: UserService, // Injected UserService for password reset
    private router: Router,
    private toastr: ToastrService ,
    // private authService : AuthService
  ) {}

  ngOnInit() {
    // 1. Initialize Login Form
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // 2. Initialize Reset Password Form
    // 2. Reset Password Form Validation (Modal ke liye)
  this.resetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    // Regex: ^.{6,}$ matlab start se end tak min 6 length
    newPassword: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

    
  }

  // Custom Validator for matching passwords
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value !== confirmPassword.value 
      ? { mismatch: true } : null;
  }

  // Modal Controls
  openResetModal() {
    this.showResetModal = true;
  }

  closeResetModal() {
    this.showResetModal = false;
    this.resetForm.reset();
  }

  /**
   * Handles the Forget Password logic
   */
  handleResetPassword() {
    console.log("Forget password me aya");
    if (this.resetForm.invalid) return;
  
    this.loading = true;
    
    // Yahan hum AuthService wali API call kar rahe hain
    this.auth.forgotPassword(this.resetForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Password reset ho gaya! Ab login karein.', 'Success');
        this.closeResetModal();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Email not found', 'Error');
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.toastr.warning('Please check your credentials', 'Validation Error');
      return;
    }

    this.loading = true;
  
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        const data = res.data;
        this.auth.saveAuth(data.token, data.role);
  
        const user = {
          id: data.userId, 
          email: data.email,
          fullName: data.fullName,
          role: data.role
        };
  
        localStorage.setItem('user', JSON.stringify(user));
        this.toastr.success(`Welcome, ${data.fullName}`, 'Login Successful');
        this.loading = false;

        if (data.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || err.error?.error || 'An unexpected error occurred';
        this.toastr.error(errorMessage, 'Login Failed');
      }
    });
  }

  naviagteToRegister() {
    this.router.navigate(['/register']);
  }
}













// import { Component, OnInit } from '@angular/core'; // Added OnInit
// import { CommonModule } from '@angular/common';
// import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';
// import { ToastrService } from 'ngx-toastr'; // 1. Import Toastr

// @Component({ 
//   standalone: true,
//   selector: 'app-login',
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
//   imports: [CommonModule, ReactiveFormsModule]
// })
// export class LoginComponent implements OnInit {

//   loading = false;
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router,
//     private toastr: ToastrService // 2. Inject Toastr
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }
// submit() {
//     if (this.form.invalid) {
//       this.toastr.warning('Please check your credentials', 'Validation Error');
//       return;
//     }
  
//     //  console.log("Submit me ayaa");

//     this.loading = true;
  
//     this.auth.login(this.form.value).subscribe({
//       next: (res) => {
//         const data = res.data;
       
//         this.auth.saveAuth(data.token, data.role);
  
//         const user = {
//           id: data.userId, 
//           email: data.email,
//           fullName: data.fullName,
//           role: data.role
//         };
  
//         localStorage.setItem('user', JSON.stringify(user));
        
//         // Success Toast
//         this.toastr.success(`Welcome, ${data.fullName}`, 'Login Successful');
  
//         this.loading = false;

//         if (data.role === 'ADMIN') {
//           this.router.navigate(['/admin/dashboard']);
//         } else {
//           this.router.navigate(['/user/dashboard']);
//         }
//       },
//       error: (err) => {
//         this.loading = false;
//         const errorMessage = err.error?.message || err.error?.error || 'An unexpected error occurred';
//         this.toastr.error(errorMessage, 'Login Failed', {
//           timeOut: 4000,
//           progressBar: true,
//           closeButton: true
//         });

//         console.error('Backend Error:', err);
//       }
//     });
//   }



//   // submit() {
//   //   if (this.form.invalid) {
//   //     this.toastr.warning('Please fill in all fields correctly', 'Invalid Form');
//   //     return;
//   //   }
  
//   //   this.loading = true;
  
//   //   this.auth.login(this.form.value).subscribe({
//   //     next: (res) => {
//   //       const data = res.data;
  
//   //       // Save token + role
//   //       this.auth.saveAuth(data.token, data.role);
  
//   //       // SAVE USER PROPERLY
//   //       const user = {
//   //         id: data.userId,
//   //         email: data.email,
//   //         fullName: data.fullName,
//   //         role: data.role
//   //       };
  
//   //       localStorage.setItem('user', JSON.stringify(user));
        
//   //       // 3. Show Success Toast
//   //       this.toastr.success(`Welcome back, ${data.fullName}!`, 'Login Successful');
  
//   //       this.loading = false;

//   //       if (data.role === 'ADMIN') {
//   //         this.router.navigate(['/admin/dashboard']);
//   //       } else {
//   //         this.router.navigate(['/user/dashboard']);
//   //       }
//   //     },
//   //     error: (err) => {
//   //       this.loading = false;
//   //       // 4. Show Error Toast
//   //       // If your API returns a specific message, use err.error.message
//   //       this.toastr.error(err.error?.message || 'Invalid email or password', 'Login Failed');
//   //     }
//   //   });
//   // }
  
//   naviagteToRegister(){
//     this.router.navigate(['/register']);
//   }
// }

















// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth';

// import { ToastrService } from 'ngx-toastr'; // 1. Import Toastr

// @Component({ 
//   standalone: true,
//   selector: 'app-login',
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
//   imports: [CommonModule, ReactiveFormsModule]
// })
// export class LoginComponent {

//   loading = false;
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private auth: AuthService,
//     private router: Router,
//     private toastr: ToastrService // 2. Inject Toastr
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }


//   submit() {
//     if (this.form.invalid) return;
  
//     this.loading = true;
  
//     this.auth.login(this.form.value).subscribe({
//       next: (res) => {
//         const data = res.data;
  
//         // ✅ Save token + role
//         this.auth.saveAuth(data.token, data.role);
  
//         // ✅ SAVE USER PROPERLY
//         const user = {
//           id: data.userId,          // 🔥 THIS WAS THE BUG
//           email: data.email,
//           fullName: data.fullName,
//           role: data.role
//         };
  
//         localStorage.setItem('user', JSON.stringify(user));
  
//         console.log('Logged in user:', user);
  
//         this.loading = false;

//         if (data.role === 'ADMIN') {
//           this.router.navigate(['/admin/dashboard']);
//         } else {
//           this.router.navigate(['/user/dashboard']);
//         }

//         // this.router.navigate(['/user/dashboard']);
//       },
//       error: () => {
//         this.loading = false;
//       }
//     });
//   }
  
//   naviagteToRegister(){
//      // this is for navigation for register page
//     this.router.navigate(['/register']);
//   }
 









  // submit() {
  //   if (this.form.invalid) return;

  //   this.loading = true;

  //   this.auth.login(this.form.value).subscribe({
  //     next: (res) => {
  //       this.auth.saveAuth(res.data.token, res.data.role);
  //       this.loading = false;
  //       this.router.navigate(['/user/dashboard']);
        
  //     },
  //     error: () => {
  //       this.loading = false;
  //     }
  //   });
  // }
// }
