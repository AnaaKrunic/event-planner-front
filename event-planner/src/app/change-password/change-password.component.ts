import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  onConfirm() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('You must be logged in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post(`${environment.apiUrl}/profile`, {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword
    }, { headers, responseType: 'text' }).subscribe({
      next: (res: string) => {
        alert(res);
        this.router.navigate(['/profile']);
      },
      error: err => {
        alert('Error changing password: ' + err.error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
