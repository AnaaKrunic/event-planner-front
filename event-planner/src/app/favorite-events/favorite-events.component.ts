import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authservice.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-favorite-events',
  templateUrl: './favorite-events.component.html',
  styleUrls: ['./favorite-events.component.css'],
})
export class FavoriteEventsComponent implements OnInit {
  favoriteEvents: any[] = [];
  isLoading = true;
  userId: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error("There's no logged in user");
      this.isLoading = false;
      return;
    }

    this.userId = currentUser.id;
    this.loadFavoriteEvents();
  }

  loadFavoriteEvents(): void {
    if (!this.userId) return;

    const url = `${environment.apiUrl}/favorites/events/${this.userId}`;
    this.http
      .get<any[]>(url, {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          this.favoriteEvents = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error with fetching favorite events:', err);
          this.isLoading = false;
        },
      });
  }
}
