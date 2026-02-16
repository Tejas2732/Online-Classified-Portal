import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}
  

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
  
  

  login(data: any) {
    return this.http.post<any>(`${this.API}/login`, data);
  }

  register(data: any) {
    return this.http.post<any>(`${this.API}/register`, data);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  saveAuth(token: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  // for forget password
  forgotPassword(data: any): Observable<any> {
    // Hum "/api/auth/forgot-password" use kar rahe hain kyunki ye public route hoga
    return this.http.put<any>(`${this.API}/forgot-password`, data);
  }
}
