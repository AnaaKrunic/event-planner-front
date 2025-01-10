import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-all-products-and-services',
  templateUrl: './all-products-and-services.component.html',
  styleUrls: ['./all-products-and-services.component.css'],
})
export class AllProductsAndServicesComponent implements OnInit {
  productsAndServices: any[] = [];
  filteredProductsAndServices: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedCity: string = '';
  sortOption: string = 'name';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllProductsAndServices();  // Fetch all products and services when component loads
  }

  // Fetch all products and services from the backend
  fetchAllProductsAndServices(): void {
    this.isLoading = true;

    this.http.get<any[]>('/api/solutions').subscribe(
      (data) => {
        this.productsAndServices = data;
        this.filteredProductsAndServices = [...this.productsAndServices]; // Initialize filtered list
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching products and services:', error);
        this.isLoading = false;
      }
    );
  }

  // Fetch filtered and sorted products and services from the backend
  fetchFilteredAndSortedProductsAndServices(): void {
    this.isLoading = true;

    let params = new HttpParams();
    if (this.searchTerm) {
      params = params.set('name', this.searchTerm); // Set search term if available
    }
    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory); // Set selected category
    }
    if (this.selectedCity) {
      params = params.set('city', this.selectedCity); // Set selected city
    }

    // Set sorting parameter
    if (this.sortOption) {
      params = params.set('sortOption', this.sortOption);
    }

    // Make the HTTP request to filter and sort products and services
    this.http.get<any[]>('/api/solutions/filter', { params }).subscribe(
      (data) => {
        this.productsAndServices = data;
        this.filteredProductsAndServices = [...this.productsAndServices]; // Update filtered list
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching filtered and sorted products:', error);
        this.isLoading = false;
      }
    );
  }

  // This function will be triggered for search, filtering, and sorting
  filterAndSearch(): void {
    this.fetchFilteredAndSortedProductsAndServices(); // Call API for updated data
  }
}
