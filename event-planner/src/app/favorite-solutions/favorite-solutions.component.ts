import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authservice.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-solutions',
  templateUrl: './favorite-solutions.component.html',
  styleUrls: ['./favorite-solutions.component.css']
})
export class FavoriteSolutionsComponent implements OnInit {
  favoriteSolutions: any[] = [];
  isLoading = true;
  userId: string | null = null;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error("There's no logged in user");
      this.isLoading = false;
      return;
    }
    this.userId = currentUser.id;
    this.loadFavoriteSolutions();
  }

  loadFavoriteSolutions(): void {
    if (!this.userId) return;

    const url = `${environment.apiUrl}/favorites/solutions/${this.userId}`;
    this.http
      .get<any[]>(url, {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`,
        },
      })
      .subscribe({
        next: (data) => {
          this.favoriteSolutions = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error with fetching favorite solutions:', err);
          this.isLoading = false;
        },
      });
  }

  getServiceImage(solution: any): string {
    return environment.apiUrl + solution.solution.imageURLs[0];
  }

  getSolutionName(solution: any): string {
    return solution && solution?.solution.name ? solution?.solution.name : 'No name';
  }

  getSolutionDescription(solution: any): string {
    return solution && solution?.solution.description ? solution?.solution.description : 'No description';
  }

  viewDetails(solution: any): void {
    if (solution.solution.cancelationDue > 0) {
      this.router.navigate(['/edit-service', solution.solution.id], { queryParams: { viewOnly: true } });
    } else {
      this.router.navigate(['/product', solution.solution.id]);
    }
  }

}
