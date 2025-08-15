import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../authservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Token doesn't exist - user not logged in.");
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${environment.apiUrl}/profile`, { headers }).subscribe(
    data => {
      this.user = data;

      const BASE_URL = environment.apiUrl;
      if (this.user.imageURLs && Array.isArray(this.user.imageURLs)) {
        this.user.imageURLs = this.user.imageURLs.map((url: string) => {
          if (!url.startsWith('http')) {
            return `${BASE_URL}${url}`;
          }
          return url;
        });
      }
    },
    error => {
      console.error('Error:', error);
    }
  );
  }

  isEditing = false;

  toggleEdit() {
    if (this.isEditing) {
      console.log('Saving user:', this.user);
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.user.imageURLs = this.user.imageURLs.map((url: string) => {
        return url.replace(environment.apiUrl, '').replace('/api', '');
      });

      this.http.put(`${environment.apiUrl}/profile`, this.user, { headers }).subscribe(
        res => {
          console.log('Profile updated:', res);
        },
        err => {
          console.error('Error updating profile:', err);
        }
      );
    }
    this.isEditing = !this.isEditing;
  }

  changePassword() {
    console.log('Change password clicked');
  }

  deactivateProfile() {
    if (!confirm('Are you sure you want to deactivate your account?')) {
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

    this.http.delete(`${environment.apiUrl}/profile`, { headers, observe: 'response' }).subscribe({
      next: response => {
        if (response.status === 204) {
          alert('Account successfully deactivated');
          this.authService.clearUser();
          this.router.navigate(['/login']); 
        } else {
          alert('Account deactivation returned status: ' + response.status);
        }
      },
      error: err => {
        console.error('Error deactivating account:', err);
        alert('Error deactivating account.');
      }
    });
  }

}
