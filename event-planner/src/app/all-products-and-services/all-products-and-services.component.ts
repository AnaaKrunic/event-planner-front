import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-all-products-and-services',
  templateUrl: './all-products-and-services.component.html',
  styleUrls: ['./all-products-and-services.component.css'],
})
export class AllProductsAndServicesComponent implements OnInit {
  solutions: any[] = [];
  filteredSolutions: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedCity: string = '';
  sortOption: string = 'name';
  pageSize: number = 10; // Adjust as needed
  currentPage: number = 0;
  totalPages: number = 0;
  totalSolutions: number = 0;
  categories: string[] = [];


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllSolutions(); // Fetch all solutions when the component loads
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get<string[]>('/api/categories').subscribe(
      (data) => {
        this.categories = data; // Spremite kategorije za filtriranje
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Fetch all solutions from the backend
  fetchAllSolutions(): void {
    this.isLoading = true;

    this.http.get<any[]>('/api/solutions').subscribe(
      (data) => {
        this.solutions = data;
        this.filteredSolutions = [...this.solutions]; // Initialize filtered list
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching solutions:', error);
        this.isLoading = false;
      }
    );
  }

  // Fetch search results with pagination, sorting, and filtering
  fetchSearchResults(page: number = 0): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', this.pageSize.toString())
      .set('sort', this.sortOption);

    // Add search term if provided
    if (this.searchTerm) {
      params = params.set('name', this.searchTerm);
    }

    // Add category filter if selected
    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory);
    }

    // Add city filter if selected
    if (this.selectedCity) {
      params = params.set('city', this.selectedCity);
    }

    console.log('Search params:', params.toString()); // Log for debugging

    this.http.get<any>('/api/solutions/search', { params }).subscribe(
      (response) => {
        console.log('Search results:', response); // Log for debugging
        this.solutions = response.content || [];
        this.filteredSolutions = [...this.solutions];
        this.totalPages = response.totalPages;
        this.totalSolutions = response.totalElements;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching search results:', error);
        this.isLoading = false;
      }
    );
  }

  // Navigate to a specific page
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchSearchResults(page);
    }
  }

  // Trigger for search when input changes
  onSearchTermChange(): void {
    if (this.searchTerm.trim() === '') {
      // If search input is empty, reload all solutions
      this.fetchAllSolutions();
    } else {
      // Otherwise, perform the search
      this.currentPage = 0; // Reset to first page
      this.fetchSearchResults();
    }
  }

  // Trigger for sorting and filtering change
  onFilterOrSortChange(): void {
    this.currentPage = 0; // Reset to first page when filter or sort changes
    this.fetchSearchResults();
  }
}
