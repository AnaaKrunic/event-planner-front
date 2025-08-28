import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  isLoading = true;

  // Filters & sort
  searchTerm = '';
  sortOption = 'name';
  filterCategory = 'all';
  filterAvailability = 'all';
  categories: any[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalProducts = 0;

  userRole: string | null = null;
  mode: 'all' | 'my' = 'all';

  constructor(private authService: AuthService, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;

    this.route.url.subscribe((segments) => {
      const path = segments.map((s) => s.path).join('/');
      this.mode = path === 'my-products' ? 'my' : 'all';
      this.loadProducts();
    });

    this.fetchCategories();
  }

  loadProducts(): void {
    if (this.mode === 'my') {
      this.fetchMyProducts();
    } else {
      this.fetchAllProducts();
    }
  }

  fetchCategories(): void {
    this.http.get<any[]>('/api/categories').subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  fetchAllProducts(): void {
    this.isLoading = true;
    this.http.get<any[]>('/api/products').subscribe({
      next: (data) => {
        this.products = data || [];
        this.filteredProducts = [...this.products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      },
    });
  }

  fetchMyProducts(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.isLoading = true;
    this.http.get<any[]>(`/api/products/my-products?providerId=${currentUser.id}`).subscribe({
      next: (data) => {
        this.products = data || [];
        this.filteredProducts = [...this.products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching my products:', err);
        this.isLoading = false;
      },
    });
  }

  // Search
  onSearchTermChange(): void {
    if (this.searchTerm.trim() === '') {
      this.fetchAllProducts();
    } else {
      let params = new HttpParams().set('name', this.searchTerm);
      this.http.get<any>('/api/products/search', { params }).subscribe({
        next: (resp) => {
          this.products = resp || [];
          this.filteredProducts = [...this.products];
          this.totalPages = resp.totalPages;
          this.currentPage = resp.number;
        },
        error: (err) => console.error('Error searching products:', err),
      });
    }
  }

  // Filtering + sorting
  onFilterOrSortChange(): void {
    let params = new HttpParams().set('sort', this.sortOption);

    if (this.filterCategory !== 'all') {
      params = params.set('categoryId', this.filterCategory);
    }
    if (this.filterAvailability !== 'all') {
      params = params.set('available', this.filterAvailability);
    }

    this.http.get<any>('/api/products/filter', { params }).subscribe({
      next: (resp) => {
        this.products = resp || [];
        this.filteredProducts = [...this.products];
        this.totalPages = resp.totalPages;
        this.currentPage = resp.number;
      },
      error: (err) => console.error('Error filtering products:', err),
    });
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.onFilterOrSortChange();
    }
  }

  deleteProduct(productId: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.http.delete(`/api/products/${productId}`).subscribe({
      next: () => {
        // alert('Product deleted successfully!');
        this.products = this.products.filter(p => p.id !== productId);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    });
  }
}
