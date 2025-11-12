import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Solution {
  id: number;
  name: string;
  price: number;
  discount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

  private apiUrl = '/api/price-list';

  constructor(private http: HttpClient) {}

  getProviderSolutions(userId: number): Observable<Solution[]> {
    return this.http.get<Solution[]>(`${this.apiUrl}/${userId}`);
  }
  
  updateSolutionPrice(id: number, payload: { price: number; discount: number; }): Observable<Solution> {
    return this.http.put<Solution>(`${this.apiUrl}/${id}/price`, payload);
  }
}
