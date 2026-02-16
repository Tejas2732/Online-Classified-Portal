import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { WalletService } from '../../../core/services/wallet';
import { OrderService } from '../../../core/services/order';
import { ToastrService } from 'ngx-toastr'; // Added Toastr Import

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './my-wallet.html',
  styleUrls: ['./my-wallet.css']
})
export class MyWalletComponent implements OnInit {

  wallet: any = null;
  transactions: any[] = []; 
  loading = false;

  form!: FormGroup;

  // 🔥 state control
  viewMode: 'WALLET' | 'ALL' = 'WALLET';

  constructor(
    private fb: FormBuilder,
    private walletService: WalletService,
    private orderService: OrderService,
    private toastr: ToastrService // Injected Toastr
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1), Validators.max(10000)]]
    });

    this.loadWallet();
    this.loadWalletTransactions(); // ✅ default view
  }

  // ==============================
  // WALLET INFO
  // ==============================
  loadWallet(): void {
    this.walletService.getWallet().subscribe({
      next: (res) => {
        this.wallet = res.data;
      },
      error: () => {
        this.toastr.error('Could not fetch wallet balance', 'Wallet Error');
      }
    });
  }

  // ==============================
  // WALLET TRANSACTIONS ONLY
  // ==============================
  loadWalletTransactions(): void {
    this.viewMode = 'WALLET';
    this.loading = true;

    this.walletService.getTransactions().subscribe({
      next: (res) => {
        this.transactions = this.sortByLatest(res.data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Failed to load transaction history', 'Error');
      }
    });
  }

  // ==============================
  // ALL TRANSACTIONS (WALLET + CARD)
  // ==============================
  loadAllTransactions(): void {
    this.viewMode = 'ALL';
    this.loading = true;

    this.orderService.getMyOrders().subscribe({
      next: (orderRes) => {
        const orderTransactions = orderRes.data.map((o: any) => ({
          type: o.paymentMethod === 'WALLET' ? 'DEBIT' : 'CARD',
          amount: o.totalAmount,
          description: `Order ${o.orderNumber}`,
          createdAt: o.createdAt
        }));

        this.walletService.getTransactions().subscribe({
          next: (walletRes) => {
            const combined = [...walletRes.data, ...orderTransactions];
            this.transactions = this.sortByLatest(combined);
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            this.toastr.error('Failed to load wallet data', 'Error');
          }
        });
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load order data', 'Error');
      }
    });
  }

  // ==============================
  // RECHARGE
  // ==============================
  recharge(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please enter a valid amount (1 - 10,000)', 'Invalid Amount');
      return;
    }

    this.loading = true;
    const amount = this.form.value.amount;

    this.walletService.recharge(amount).subscribe({
      next: () => {
        this.toastr.success(`$${amount} added to your wallet!`, 'Recharge Successful'); // Added Success Toast
        this.loadWallet();
        this.loadWalletTransactions();
        this.form.reset();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const errorMsg = err.error?.message || 'Recharge failed. Please try again.';
        this.toastr.error(errorMsg, 'Transaction Failed'); // Added Error Toast
      }
    });
  }

  // ==============================
  // SORT (LATEST FIRST)
  // ==============================
  private sortByLatest(data: any[]): any[] {
    return data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }
}















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators
// } from '@angular/forms';

// import { WalletService } from '../../../core/services/wallet';
// import { OrderService } from '../../../core/services/order';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-wallet.html',
//    styleUrls: ['./my-wallet.css']
// })
// export class MyWalletComponent implements OnInit {

//   wallet: any = null;
//   transactions: any[] = []; 
//   loading = false;

//   form!: FormGroup;

//   // 🔥 state control
//   viewMode: 'WALLET' | 'ALL' = 'WALLET';

//   constructor(
//     private fb: FormBuilder,
//     private walletService: WalletService,
//     private orderService: OrderService
//   ) {}

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       // amount: [0, [Validators.required, Validators.min(1)]]
//       amount: [null, [Validators.required, Validators.min(1), Validators.max(10000)]]
//     });

//     this.loadWallet();
//     this.loadWalletTransactions(); // ✅ default view
//   }

//   // ==============================
//   // WALLET INFO
//   // ==============================
//   loadWallet(): void {
//     this.walletService.getWallet().subscribe({
//       next: (res) => {
//         this.wallet = res.data;
//       }
//     });
//   }

//   // ==============================
//   // WALLET TRANSACTIONS ONLY
//   // ==============================
//   loadWalletTransactions(): void {
//     this.viewMode = 'WALLET';
//     this.loading = true;

//     this.walletService.getTransactions().subscribe({
//       next: (res) => {
//         this.transactions = this.sortByLatest(res.data);
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   // ==============================
//   // ALL TRANSACTIONS (WALLET + CARD)
//   // ==============================
//   loadAllTransactions(): void {
//     this.viewMode = 'ALL';
//     this.loading = true;

//     this.orderService.getMyOrders().subscribe({
//       next: (orderRes) => {

//         const orderTransactions = orderRes.data.map((o: any) => ({
//           type: o.paymentMethod === 'WALLET' ? 'DEBIT' : 'CARD',
//           amount: o.totalAmount,
//           description: `Order ${o.orderNumber}`,
//           createdAt: o.createdAt
//         }));

//         this.walletService.getTransactions().subscribe({
//           next: (walletRes) => {
//             const combined = [...walletRes.data, ...orderTransactions];
//             this.transactions = this.sortByLatest(combined);
//             this.loading = false;
//           },
//           error: () => this.loading = false
//         });
//       },
//       error: () => this.loading = false
//     });
//   }

//   // ==============================
//   // RECHARGE
//   // ==============================
//   recharge(): void {
//     if (this.form.invalid) return;

//     this.loading = true;
//     const amount = this.form.value.amount;

//     this.walletService.recharge(amount).subscribe({
//       next: () => {
//         this.loadWallet();
//         this.loadWalletTransactions();
//         this.form.reset({ amount: 0 });
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   // ==============================
//   // SORT (LATEST FIRST)
//   // ==============================
//   private sortByLatest(data: any[]): any[] {
//     return data.sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//     );
//   }
// }



















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { WalletService } from '../../../core/services/wallet';
// import { OrderService } from '../../../core/services/order';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-wallet.html'
// })
// export class MyWalletComponent implements OnInit {

//   wallet: any = null;
//   transactions: any[] = [];
//   loading = false;
//   form!: FormGroup;

//   viewMode: 'WALLET' | 'ALL' = 'WALLET';   // ✅ ADD

//   constructor(
//     private fb: FormBuilder,
//     private walletService: WalletService,
//     private orderService: OrderService     // ✅ ADD
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       amount: [0, [Validators.required, Validators.min(1)]]
//     });

//     this.loadWallet();
//     this.loadWalletTransactions();
//   }

//   loadWallet() {
//     this.walletService.getWallet().subscribe(res => {
//       this.wallet = res.data;
//     });
//   }

//   loadWalletTransactions() {
//     this.viewMode = 'WALLET';
//     this.loading = true;

//     this.walletService.getTransactions().subscribe({
//       next: res => {
//         this.transactions = res.data;
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   loadAllTransactions() {
//     this.viewMode = 'ALL';
//     this.loading = true;
//     this.transactions = [];

//     this.walletService.getTransactions().subscribe({
//       next: walletRes => {

//         const walletTx = (walletRes.data || []).map((t: any) => ({
//           type: t.type,
//           amount: t.amount,
//           balanceAfter: t.balanceAfter ?? '-',
//           description: t.description,
//           createdAt: t.createdAt
//         }));

//         this.orderService.getMyOrders().subscribe({
//           next: (orderRes: any) => {

//             const orderTx = (orderRes.data || []).map((o: any) => ({
//               type: o.paymentMethod === 'WALLET' ? 'DEBIT' : 'CARD',
//               amount: o.totalAmount,
//               balanceAfter: '-',
//               description: `Order #${o.orderNumber}`,
//               createdAt: o.createdAt
//             }));

//             this.transactions = [...walletTx, ...orderTx].sort(
//               (a, b) =>
//                 new Date(b.createdAt).getTime() -
//                 new Date(a.createdAt).getTime()
//             );

//             this.loading = false;
//           },
//           error: () => this.loading = false
//         });
//       },
//       error: () => this.loading = false
//     });
//   }

//   recharge() {
//     if (this.form.invalid) return;

//     this.loading = true;
//     const amount = this.form.value.amount;

//     this.walletService.recharge(amount).subscribe({
//       next: () => {
//         this.loadWallet();
//         this.viewMode === 'ALL'
//           ? this.loadAllTransactions()
//           : this.loadWalletTransactions();

//         this.form.reset({ amount: 0 });
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }
// }

















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// import { WalletService } from '../../../core/services/wallet';
// import { OrderService } from '../../../core/services/order';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-wallet.html'
// })
// export class MyWalletComponent implements OnInit {

//   wallet: any = null;
//   transactions: any[] = [];
//   loading = false;
//   form!: FormGroup;

//   viewMode: 'WALLET' | 'ALL' = 'WALLET';

//   constructor(
//     private fb: FormBuilder,
//     private walletService: WalletService,
//     private orderService: OrderService
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       amount: [0, [Validators.required, Validators.min(1)]]
//     });

//     this.loadWallet();
//     this.loadWalletTransactions();
//   }

//   loadWallet() {
//     this.walletService.getWallet().subscribe(res => {
//       this.wallet = res.data;
//     });
//   }

//   loadWalletTransactions() {
//     this.viewMode = 'WALLET';
//     this.loading = true;

//     this.walletService.getTransactions().subscribe({
//       next: res => {
//         this.transactions = res.data;
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }

//   loadAllTransactions() {
//     this.viewMode = 'ALL';
//     this.loading = true;

//     this.orderService.getMyOrders().subscribe(orderRes => {

//       const orderTransactions = orderRes.data.map((o: any) => ({
//         type: o.paymentMethod === 'WALLET' ? 'DEBIT' : 'CARD',
//         amount: o.totalAmount,
//         balanceAfter: '-',
//         description: `Order ${o.orderNumber}`,
//         createdAt: o.createdAt
//       }));

//       this.walletService.getTransactions().subscribe(walletRes => {
//         this.transactions = [...walletRes.data, ...orderTransactions];
//         this.loading = false;
//       });
//     });
//   }

//   recharge() {
//     if (this.form.invalid) return;

//     this.loading = true;

//     this.walletService.recharge(this.form.value.amount).subscribe({
//       next: () => {
//         this.loadWallet();
//         this.loadWalletTransactions();
//         this.form.reset({ amount: 0 });
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }
// }




















// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { WalletService } from '../../../core/services/wallet';

// @Component({
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './my-wallet.html'
// })
// export class MyWalletComponent implements OnInit {

//   wallet: any = null;
//   transactions: any[] = [];
//   loading = false;
//   form!: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private walletService: WalletService
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       amount: [0, [Validators.required, Validators.min(1)]]
//     });

//     this.loadWallet();
//     this.loadTransactions();
//   }

//   loadWallet() {
//     this.walletService.getWallet().subscribe(res => {
//       this.wallet = res.data;
//     });
//   }

//   loadTransactions() {
//     this.walletService.getTransactions().subscribe(res => {
//       this.transactions = res.data;
//     });
//   }

//   recharge() {
//     if (this.form.invalid) return;

//     this.loading = true;
//     const amount = this.form.value.amount;

//     this.walletService.recharge(amount).subscribe({
//       next: () => {
//         this.loadWallet();
//         this.loadTransactions();
//         this.form.reset({ amount: 0 });
//         this.loading = false;
//       },
//       error: () => this.loading = false
//     });
//   }
// }
