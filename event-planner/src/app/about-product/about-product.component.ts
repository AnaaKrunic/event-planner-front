import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about-product',
  templateUrl: './about-product.component.html',
  styleUrls: ['./about-product.component.css'],
})
export class AboutProductComponent implements OnInit {
  product: any;
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProductDetails(id);
    } else {
      console.error('Product ID is missing.');
      this.isLoading = false;
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
}
