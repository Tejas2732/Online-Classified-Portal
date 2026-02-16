import { Component, OnInit  } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css']
})
export class ConfirmationComponent implements OnInit {

  receipt: any;

  constructor(
    private router: Router,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.receipt = history.state.receipt;

    console.log('RECEIPT DATA:', this.receipt);

    // Safety: direct URL access protection
    if (!this.receipt) {
      // Added warning so user knows why they were kicked out of the page
      this.toastr.warning('No receipt found. Please check your order history.', 'Access Denied');
      this.router.navigate(['/user/dashboard']);
    }
  }
 
  c(){
    this.router.navigate(['/user/orders']);
  }

  goToOrders() {
    this.router.navigate(['/user/orders']);
  }
}












// import { Component, OnInit  } from '@angular/core';
// import { CommonModule, DatePipe } from '@angular/common';
// import { Router} from '@angular/router';

// @Component({
//   standalone: true,
//   imports: [CommonModule, DatePipe],
//   templateUrl: './confirmation.html',
//   styleUrls: ['./confirmation.css']
// })
// export class ConfirmationComponent implements OnInit {

//   receipt: any;

//   constructor(private router: Router) {}

//   ngOnInit(): void {
//     this.receipt = history.state.receipt;

//     console.log('RECEIPT DATA:', this.receipt);

//     // Safety: direct URL access protection
//     if (!this.receipt) {
//       this.router.navigate(['/user/dashboard']);
//     }
//   }
 
//   c(){
//     this.router.navigate(['/user/orders']);
//   }

//   goToOrders() {
//     this.router.navigate(['/user/orders']);
//   }
  

// }
