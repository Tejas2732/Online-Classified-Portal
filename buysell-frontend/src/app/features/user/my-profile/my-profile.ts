import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Added Router for navigation
import { UserService } from '../../../core/services/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true, 
  selector: 'app-my-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-profile.html',
  styleUrls: ['./my-profile.css'],
}) 
export class MyProfileComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  userId: number | null = null; // Stores the ID for the delete operation

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router // Injected Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadProfile();
  }

  /**
   * Initializes the Reactive Form with validations
   */
  initForm() {
    this.form = this.fb.group({
      fullName: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.pattern('^[a-zA-Z ]*$')
      ]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern('^[6-9][0-9]{9}$')
      ]],
      address: ['', [
        Validators.required, 
        Validators.minLength(10), 
        Validators.maxLength(200)
      ]]
    });
  }

  /**
   * Fetches user data and captures the ID
   */
  loadProfile() {
    this.userService.getMyProfile().subscribe({
      next: (res: any) => {
        // Capture the User ID from the response for deletion later
        this.userId = res.data.id; 
        this.form.patchValue(res.data);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.toastr.error('Failed to load profile details', 'Error');
      }
    });
  }

  /**
   * Deletes the user permanently via the API
   */
  deleteAccPermanetly() {
    if (!this.userId) {
      this.toastr.warning('User data not fully loaded. Please wait.', 'Warning');
      return;
    }

    // Safety check: Prevents accidental clicks
    const confirmDelete = confirm("Are you absolutely sure? This action will permanently delete your account and you will be logged out.");

    if (confirmDelete) {
      this.loading = true;
      
      this.userService.deleteByUser(this.userId).subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Account deleted successfully.', 'Goodbye');
          
          // Cleanup: Clear local session data and redirect to signup/login
          localStorage.clear(); 
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          this.loading = false;
          const errorMsg = err.error?.message || 'Deletion failed. You might not have permission.';
          this.toastr.error(errorMsg, 'Error');
          console.error('Delete error:', err);
        }
      });
    }
  }

  /**
   * Updates the user profile
   */
  save() {
    if (this.form.invalid) {
      this.toastr.warning('Please correct the highlighted errors', 'Validation Warning');
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const profileData = this.form.getRawValue(); // Includes disabled 'email' field

    this.userService.updateProfile(profileData).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('Profile updated successfully!', 'Success');
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Update failed.';
        this.toastr.error(errorMsg, 'Update Error');
      }
    });
  }
}














// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { UserService } from '../../../core/services/user';
// import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

// @Component({
//   standalone: true, 
//   selector: 'app-my-profile',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-profile.html',
//   styleUrls: ['./my-profile.css'],
// }) 
// export class MyProfileComponent implements OnInit {

//   form!: FormGroup;
//   loading = false;

//   // chanegs 
//   demo_data: any[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService,
//     private toastr: ToastrService // Injected Toastr
//   ) {}

//   ngOnInit() {

//     //  demo_data :[] = this.userService.getMyProfile();

//     this.form = this.fb.group({
//       // Full Name: Required, min 3 chars, Alphabets & spaces only
//       fullName: ['', [
//         Validators.required, 
//         Validators.minLength(3), 
//         Validators.pattern('^[a-zA-Z ]*$')
//       ]],
      
//       // Email: Disabled (Read-only) but keeps email validation structure
//       email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      
//       // Phone: 10 digits, starts with 6-9
//       phoneNumber: ['', [
//         Validators.required, 
//         Validators.pattern('^[6-9][0-9]{9}$')
//       ]],
      
//       // Address: Min 10, Max 200 characters
//       address: ['', [
//         Validators.required, 
//         Validators.minLength(10), 
//         Validators.maxLength(200)
//       ]]
//     });

//     this.loadProfile();
//   }

//   loadProfile() {
//     this.userService.getMyProfile().subscribe({
//       next: res => {
//         // patchValue updates the form with data from the API
//         this.form.patchValue(res.data);
//       },
//       error: err => {
//         console.error('Error loading profile:', err);
//         this.toastr.error('Failed to load profile details', 'Error'); // Added Error Toast
//       }
//     });
//   }

//     // changes 
//     //  deleteAccPermanetly(){
//     //    this.userService.getMyProfile().subscribe((data) => {
//     //     this.demo_data = data; // Assign the data inside the callback
//     //     console.log( "Demo data is printing -> ",this.demo_data);
//     //     // console.log(this.demo_data[0].data);
//     //   });
//     // }



  
 
//   save() {
//     console.log('Form data:', this.form.value);
//     // If the form doesn't meet the validation criteria, stop here
//     if (this.form.invalid) {
//       this.toastr.warning('Please correct the highlighted errors', 'Validation Warning'); // Added Warning Toast
//       this.form.markAllAsTouched(); // Highlights errors for the user
//       return;
//     }

//     this.loading = true;

//     /** * NOTE: this.form.value ignores disabled fields. 
//      * getRawValue() includes the 'email' even though it's disabled.
//      */
//     const profileData = this.form.getRawValue();

//     this.userService.updateProfile(profileData).subscribe({
//       next: () => {
//         this.loading = false;
//         this.toastr.success('Profile updated successfully!', 'Success'); // Replaced alert with Toast
//       },
//       error: (err) => {
//         this.loading = false;
//         const errorMsg = err.error?.message || 'Update failed. Please try again.';
//         this.toastr.error(errorMsg, 'Update Error'); // Added Error Toast
//         console.error('Update failed:', err);
//       }
//     });
//   }

// }















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { UserService } from '../../../core/services/user';

// @Component({
//   standalone: true,
//   selector: 'app-my-profile',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-profile.html',
//    styleUrls: ['./my-profile.css'],
// }) 
// export class MyProfileComponent implements OnInit {

//   form!: FormGroup;
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       // Full Name: Required, min 3 chars, Alphabets & spaces only
//       fullName: ['', [
//         Validators.required, 
//         Validators.minLength(3), 
//         Validators.pattern('^[a-zA-Z ]*$')
//       ]],
      
//       // Email: Disabled (Read-only) but keeps email validation structure
//       email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      
//       // Phone: 10 digits, starts with 6-9
//       phoneNumber: ['', [
//         Validators.required, 
//         Validators.pattern('^[6-9][0-9]{9}$')
//       ]],
      
//       // Address: Min 10, Max 200 characters
//       address: ['', [
//         Validators.required, 
//         Validators.minLength(10), 
//         Validators.maxLength(200)
//       ]]
//     });

//     this.loadProfile();
//   }

//   loadProfile() {
//     this.userService.getMyProfile().subscribe({
//       next: res => {
//         // patchValue updates the form with data from the API
//         this.form.patchValue(res.data);
//       },
//       error: err => console.error('Error loading profile:', err)
//     });
//   }

//   save() {
//     // If the form doesn't meet the validation criteria, stop here
//     if (this.form.invalid) {
//       this.form.markAllAsTouched(); // Highlights errors for the user
//       return;
//     }

//     this.loading = true;

//     /** * NOTE: this.form.value ignores disabled fields. 
//      * getRawValue() includes the 'email' even though it's disabled.
//      */
//     const profileData = this.form.getRawValue();

//     this.userService.updateProfile(profileData).subscribe({
//       next: () => {
//         this.loading = false;
//         alert('Profile updated successfully');
//       },
//       error: (err) => {
//         this.loading = false;
//         console.error('Update failed:', err);
//       }
//     });
//   }
// }



















// export class MyProfileComponent implements OnInit {

//   form!: FormGroup;
//   loading = false;

//   constructor(
//     private fb: FormBuilder,
//     private userService: UserService
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       fullName: ['', Validators.required],
//       email: [{ value: '', disabled: true }],
//       phoneNumber: [''],
//       address: ['']
//     });

//     this.loadProfile();
//   }

//   loadProfile() {
//     this.userService.getMyProfile().subscribe({
//       next: res => {
//         this.form.patchValue(res.data);
//       },
//       error: err => console.error(err)
//     });
//   }

//   save() {
//     if (this.form.invalid) return;

//     this.loading = true;
//     this.userService.updateProfile(this.form.getRawValue()).subscribe({
//       next: () => {
//         this.loading = false;
//         alert('Profile updated successfully');
//       },
//       error: () => this.loading = false
//     });
//   }
// }
