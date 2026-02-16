import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WalletService {

  private API = `${environment.apiUrl}/wallet`;

  constructor(private http: HttpClient) {}

  getWallet() {
    return this.http.get<any>(this.API);
  }

  recharge(amount: number) {
    return this.http.post<any>(`${this.API}/recharge`, { amount });
  }

  // for pagination

  getTransactionsPaginated(page = 0, size = 10) {
    return this.http.get<any>(
      `${this.API}/transactions/paginated?page=${page}&size=${size}`
    );
  }

  
  getTransactions() {
    return this.http.get<any>(`${this.API}/transactions`);
  }
}















// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { ApiResponse } from '../../shared/models/api-response.model';
// import { Wallet, Transaction } from '../../shared/models/wallet.model';

// @Injectable({ providedIn: 'root' })
// export class WalletService {

//   private readonly API = `${environment.apiUrl}/wallet`;

//   constructor(private http: HttpClient) {}

//   getMyWallet(): Observable<ApiResponse<Wallet>> {
//     return this.http.get<ApiResponse<Wallet>>(this.API);
//   }

//   rechargeWallet(amount: number): Observable<ApiResponse<Wallet>> {
//     return this.http.post<ApiResponse<Wallet>>(
//       `${this.API}/recharge`,
//       { amount }
//     );
//   }

//   getTransactions(): Observable<ApiResponse<Transaction[]>> {
//     return this.http.get<ApiResponse<Transaction[]>>(
//       `${this.API}/transactions`
//     );
//   }
// }
