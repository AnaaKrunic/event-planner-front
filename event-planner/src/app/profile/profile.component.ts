import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/korisnik/me`).subscribe(
      data => {
        this.user = data;
      },
      error => {
        console.error('Greška pri dohvatanju profila:', error);
      }
    );
  }
}
