import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authservice.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  update(product: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updatePriceAndDiscount(productId: number, newPrice: number, newDiscount: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser?.token || ''}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(
      `${this.apiUrl}/${productId}/price-discount`,
      { price: newPrice, discount: newDiscount },
      { headers }
    );
  }
}
