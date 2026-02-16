export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
  }
  
  export interface AuthResponse {
    token: string;
    role: string;
    email: string;
  }
  