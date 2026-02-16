export interface User {
    id: number;
    email: string;
    fullName: string;
    phoneNumber?: string;
    address?: string;
    role: 'USER' | 'ADMIN';
    active: boolean;
    blocked: boolean; // ✅ Add this line
  }
  