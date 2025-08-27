import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    this.http.get<any>(`/api/products/${id}`).subscribe({
      next: (data) => {
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
