import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Nema tokena — korisnik nije ulogovan.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get(`${environment.apiUrl}/profile`, { headers }).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Greška pri dohvatanju profila:', error);
      }
    );
  }

}
