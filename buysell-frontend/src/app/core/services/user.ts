import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

 // ✅ GET CURRENT USER PROFILE
 getMyProfile(): Observable<any> {
  return this.http.get<any>(`${this.API}/profile`);
}

// ✅ UPDATE PROFILE
updateProfile(data: any): Observable<any> {
  return this.http.put<any>(`${this.API}/profile`, data);
}

// ✅ CHANGE PASSWORD
changePassword(data: any): Observable<any> {
  return this.http.put<any>(`${this.API}/change-password`, data);
}
  /**
   * Get currently logged-in user details
   * Backend: GET /users/me
   */

  // changes ->
  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API}/me`);
  }
 
  /**
   * Update current user profile (if enabled)
   * Backend: PUT /users/me
   */
  // updateProfile(data: Partial<User>): Observable<ApiResponse<User>> {
  //   return this.http.put<ApiResponse<User>>(`${this.API}/me`, data);
  // }


  /**
   * Admin: get all users
   * Backend: GET /admin/users (usually)
   * (AdminService also uses similar API, this is optional reuse)
   */
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/admin/users`);
  }

  /**
   * Admin: delete user
   * Backend: DELETE /admin/users/{id}
   */
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/admin/users/${id}`
    );
  }

  // delete from user 
  deleteByUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.apiUrl}/user/${id}`
    );
  }

}
