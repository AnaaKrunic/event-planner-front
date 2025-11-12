import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreatePurchaseDTO {
  productId: number;
  eventOrganizerId: any;
  eventId: number;
}

export interface PurchaseDTO {
  id: number;
  productHistoryId: number;
  eventOrganizerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = '/api/purchase';

  constructor(private http: HttpClient) {}

  createPurchase(dto: CreatePurchaseDTO): Observable<PurchaseDTO> {
    return this.http.post<PurchaseDTO>(this.apiUrl, dto);
  }

  getPurchaseById(id: number): Observable<PurchaseDTO> {
    return this.http.get<PurchaseDTO>(`${this.apiUrl}/${id}`);
  }
}
