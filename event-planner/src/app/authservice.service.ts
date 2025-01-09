import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: { id: string; name: string; token: string } | null = null;

  constructor() {}

  // Postavljanje trenutnog korisnika (npr. nakon prijave)
  setCurrentUser(user: { id: string; name: string; token: string }): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user)); // Čuvanje u localStorage
  }

  getCurrentUser(): { id: string; name: string; token: string } | null {
    if (!this.currentUser) {
      const savedUser = localStorage.getItem('currentUser');
      this.currentUser = savedUser ? JSON.parse(savedUser) : null;
    }
    return this.currentUser;
  }

  getUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  clearUser(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }
}
