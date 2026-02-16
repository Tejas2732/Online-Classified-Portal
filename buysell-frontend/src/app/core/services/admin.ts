import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private API = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats() {
    return this.http.get<any>(`${this.API}/dashboard`);
  }

  // Profile
  getProfile() {
    return this.http.get<any>(`${this.API}/profile`);
  }

  // Users
  getAllUsers() {
    return this.http.get<any>(`${this.API}/users`);
  }

  getUserById(id: number) {
    return this.http.get<any>(`${this.API}/users/${id}`);
  }

  // changes 
  toggleBlockStatus(id: number, isBlocked: boolean) {
    const action = isBlocked ? 'unblock' : 'block';
    return this.http.patch(`${this.API}/users/${id}/${action}`, {});
  }

  toggleBlock(id: number, block: boolean) {
  // If block is true, call /block. If false, call /unblock.
  const endpoint = block ? 'block' : 'unblock';
  return this.http.patch(`${this.API}/users/${id}/${endpoint}`, {});
}

  deleteUser(id: number) {
    return this.http.delete<any>(`${this.API}/users/${id}`);
  }

  deleteUserProducts(userId: number) {
    return this.http.delete<any>(`${this.API}/users/${userId}/products`);
  }

  // Products
  getAllProducts() {
    return this.http.get<any>(`${this.API}/products`);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${this.API}/products/${id}`);
  }

  // Orders
  getAllOrders() {
    return this.http.get<any>(`${this.API}/orders`);
  }
}
















// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Observable } from 'rxjs';
// import { ApiResponse } from '../../shared/models/api-response.model';
// import { AdminDashboardStats } from '../../shared/models/admin-dashboard.model';
// import { User } from '../../shared/models/user.model';

// @Injectable({ providedIn: 'root' })
// export class AdminService {

//   private readonly API = `${environment.apiUrl}/admin`;

//   constructor(private http: HttpClient) {}

//   getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
//     return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.API}/dashboard`);
//   }

//   getAllUsers(): Observable<ApiResponse<User[]>> {
//     return this.http.get<ApiResponse<User[]>>(`${this.API}/users`);
//   }

//   deleteUser(userId: number) {
//     return this.http.delete(`${this.API}/users/${userId}`);
//   }

//   deleteUserProducts(userId: number) {
//     return this.http.delete(`${this.API}/users/${userId}/products`);
//   }
// }
