import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from '../authservice.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-about-product',
  templateUrl: './about-product.component.html',
  styleUrls: ['./about-product.component.css'],
})
export class AboutProductComponent implements OnInit {
  product: any;
  isLoading = true;
  isFavorite = false;
  userId: string | null = null;
  loggedInUserId!: number;
  providerName: string = '';
  providerId: number = 0;

  constructor(private route: ActivatedRoute, 
              private http: HttpClient, 
              private authService: AuthService, 
              private router: Router,
              private productService: ProductService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetails(id);
    } else {
      console.error('Product ID is missing.');
      this.isLoading = false;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const userId = currentUser.id;
      
      this.loggedInUserId = Number(currentUser.id);
      console.log(this.loggedInUserId)

      this.http.get<any[]>(`${environment.apiUrl}/favorites/solutions/${userId}`, {
        headers: { Authorization: `Bearer ${this.authService.getToken()}` }
      }).subscribe({
        next: (favorites) => {
          this.isFavorite = favorites.some(fav => fav.solution.id === this.product?.id);
        },
        error: (err) => console.error('Greška pri proveri favorita:', err)
      });
    }
  }

  fetchProductDetails(id: string): void {
    this.http.get<any>(`${environment.apiUrl}/products/${id}`).subscribe({
      next: (data) => {
        const BASE_URL = environment.apiUrl;
        if (data.imageURLs && Array.isArray(data.imageURLs)) {
          data.imageURLs = data.imageURLs.map((url: string) => {
            if (!url.startsWith('http')) {
              return `${BASE_URL}${url}`;
            }
            return url;
          });
        }

        this.product = data;

        console.log(this.product)
        this.providerId = this.product.providerId;
        this.providerName = 'provider';
        console.log(this.providerId, this.providerName, this.product)
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.isLoading = false;
      },
    });
  }
  
  get eventTypeNames(): string {
    return this.product?.eventTypes?.map((e: any) => e.name).join(', ') || '';
  }

  toggleFavorite() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id;
    const url = `${environment.apiUrl}/favorites/solutions/${userId}/${this.product.id}`;

    this.isFavorite = !this.isFavorite;

    const request = this.isFavorite
      ? this.http.post(url, null, {
          headers: { Authorization: `Bearer ${this.authService.getToken()}` },
          responseType: 'text'
        })
      : this.http.delete(url, {
          headers: { Authorization: `Bearer ${this.authService.getToken()}` },
          responseType: 'text'
        });

    request.subscribe({
      next: () => {},
      error: (err) => {
        console.error('Greška pri ažuriranju omiljenog eventa:', err, this.isFavorite);
        this.isFavorite = !this.isFavorite;
      }
    });
  }

  checkIfFavorite(userId: string, serviceId: number): void {
    this.http.get<boolean>(`${environment.apiUrl}/favorite-solutions/${userId}/${serviceId}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => {
        this.isFavorite = res;
      },
      error: (err) => console.error('Greška pri proveri omiljenog servisa:', err)
    });
  }

  goToPurchase(productId: number) {
    this.router.navigate(['/purchase/', productId]);
  }

chatVisible: boolean = false;
  currentUser: string = '';
  otherUser: string = '';

  openChat() {
    this.currentUser = this.authService.getCurrentUser()?.name || '';
    
    this.productService.getById(this.product.id).subscribe(p => {
      this.otherUser = p.provider.name;
      console.log(this.currentUser, this.otherUser)
      this.chatVisible = true;
    });
  }

  closeChat() {
    this.chatVisible = false;
  }
}
