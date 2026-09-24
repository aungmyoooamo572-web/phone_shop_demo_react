import api from './api';
import type { LoginResponse, User } from '../types';

export const authService = {
  async register(data: {
    username: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }): Promise<User> {
    const res = await api.post<User>('/users/register', data);
    return res.data;
  },

  async login(data: { username: string; password: string }): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/users/login', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
          address: res.data.address,
          role: res.data.role,
        })
      );
    }
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  },
};
