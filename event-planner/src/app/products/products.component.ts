import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  standalone: false,
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  solutions: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSolutions();
  }

  fetchSolutions(): void {
    console.log('Fetching solutions...'); // Log kada metoda počne
    this.http.get<any[]>('/api/solutions/top-5').subscribe(
      (data) => {
        console.log('Fetched data:', data); // Log podataka iz API-ja
        this.solutions = data;
        this.isLoading = false;
        console.log('Solutions loaded successfully:', this.solutions); // Log učitanih rešenja
      },
      (error) => {
        console.error('Error fetching solutions:', error); // Log greške
        console.log('Error details:', {
          status: error.status,
          message: error.message,
          errorBody: error.error,
        });
        this.isLoading = false;
      }
    );
  }
}
