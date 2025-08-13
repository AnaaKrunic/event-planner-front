import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDTO } from '../models/login-request.dto';
import { LoginResponseDTO } from '../models/login-response.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const requestData: LoginRequestDTO = {
      email: this.email,
      password: this.password
    };

    this.http.post<LoginResponseDTO>('http://localhost:8080/api/auth/login', requestData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('email', response.email);
          localStorage.setItem('role', response.role);

          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login error:', err);
          alert(err.error || 'Invalid credentials');
        }
      });
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }
}
