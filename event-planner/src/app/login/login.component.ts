import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDTO } from '../models/login-request.dto';
import { LoginResponseDTO } from '../models/login-response.dto';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    const requestData: LoginRequestDTO = {
      email: this.email,
      password: this.password
    };

    this.http.post<LoginResponseDTO>('http://localhost:8080/api/auth/login', requestData)
      .subscribe({
        next: (response) => {
          this.authService.setCurrentUser({
            id: response.userId.toString(),
            name: response.email,
            token: response.token,
            role: response.role
          });

          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert(err.error?.message || 'Invalid credentials');
        }
      });
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }
}
