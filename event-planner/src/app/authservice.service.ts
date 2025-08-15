import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<{ id: string; name: string; token: string } | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // Postavljanje trenutnog korisnika (npr. nakon prijave)
  setCurrentUser(user: { id: string; name: string; token: string }): void {
    localStorage.setItem('currentUser', JSON.stringify(user)); // Čuvanje u localStorage
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): { id: string; name: string; token: string } | null {
    return this.currentUserSubject.value;
  }

  getUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  changePassword(oldPassword: string, newPassword: string) {
    const token = this.getToken();
    if (!token) {
      throw new Error('User not logged in');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${environment.apiUrl}/change-password`, {
      oldPassword,
      newPassword
    }, { headers });
  }
}
