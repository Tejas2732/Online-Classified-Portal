import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

import { DashboardComponent } from './features/user/dashboard/dashboard';
import { BuyProductsComponent } from './features/user/buy-products/buy-products';
import { SellProductComponent } from './features/user/sell-product/sell-product';
import { MyOrdersComponent } from './features/user/my-orders/my-orders';
import { MyListingsComponent } from './features/user/my-listings/my-listings';
import { MyWalletComponent } from './features/user/my-wallet/my-wallet';
import { MyProfileComponent } from './features/user/my-profile/my-profile';
import { CheckoutComponent } from './features/user/checkout/checkout';
import { ConfirmationComponent } from './features/user/confirmation/confirmation';

import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
import { UserManagementComponent } from './features/admin/user-management/user-management';

import { ProductManagementComponent } from './features/admin/product-management/product-management';
import { OrderManagementComponent } from './features/admin/order-management/order-management';
import { AdminProfileComponent } from './features/admin/admin-profile/admin-profile';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

import { UserDetailsComponent } from './features/admin/user-details/user-details';

export const routes: Routes = [

  // default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // user section
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'buy', component: BuyProductsComponent },
      { path: 'sell', component: SellProductComponent },
      { path: 'orders', component: MyOrdersComponent },
      { path: 'listings', component: MyListingsComponent },
      { path: 'wallet', component: MyWalletComponent },
      { path: 'profile', component: MyProfileComponent },
      { path: 'checkout/:id', component: CheckoutComponent },
      { path: 'confirmation', component: ConfirmationComponent }
    ]
  },

  // admin section
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'profile', component: AdminProfileComponent },
      // changes 
      {path:'users/:id', component :UserDetailsComponent}
    ]
  },

  // fallback
  { path: '**', redirectTo: 'login' }
];



// ---------------------------------------------------

// import { Routes } from '@angular/router';
// import { LoginComponent } from './features/auth/login/login';
// import { RegisterComponent } from './features/auth/register/register';
// import { DashboardComponent } from './features/user/dashboard/dashboard';
// import { DummyComponent } from './features/user/dashboard/dummy.component';
// import { BuyProductsComponent } from './features/user/buy-products/buy-products';
// import { CheckoutComponent } from './features/user/checkout/checkout';
// import { ConfirmationComponent } from './features/user/confirmation/confirmation';
// import { MyWalletComponent } from './features/user/my-wallet/my-wallet';
// import { MyOrdersComponent } from './features/user/my-orders/my-orders';
// import { SellProductComponent } from './features/user/sell-product/sell-product';
// import { MyListingsComponent } from './features/user/my-listings/my-listings';
// import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard';
// import { UserManagementComponent } from './features/admin/user-management/user-management';


// import { authGuard } from './core/guards/auth-guard';
// import { adminGuard } from './core/guards/admin-guard';

// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },

//   {
//     path: 'user',
//     component: DashboardComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: 'dashboard', component: DummyComponent }
//     ]
//   },

//   {
//     path: 'admin',
//     canActivate: [adminGuard],
//     children: [
//       // admin routes later
//     ]
//   },
//   { path: 'buy', component: BuyProductsComponent },
//   { path: 'checkout/:id', component: CheckoutComponent },
//   { path: 'confirmation', component: ConfirmationComponent },
//   { path: 'wallet', component: MyWalletComponent },
//   { path: 'orders', component: MyOrdersComponent },
//   { path: 'sell', component: SellProductComponent },
//   { path: 'my-listings', component: MyListingsComponent },
//   {
//     path: 'admin',
//     canActivate: [adminGuard],
//     children: [
//       { path: 'dashboard', component: AdminDashboardComponent },
//       { path: 'users', component: UserManagementComponent }
//     ]
//   }
  
// ];

