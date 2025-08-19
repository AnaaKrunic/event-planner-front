import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<{ id: string; name: string; token: string; role: string } | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Postavljanje trenutnog korisnika (npr. nakon prijave)
  setCurrentUser(user: { id: string; name: string; token: string; role: string }): void {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Čuvanje u localStorage
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): { id: string; name: string; token: string; role: string } | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  getRole(): string | null {
    return this.getCurrentUser()?.role || null;
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
