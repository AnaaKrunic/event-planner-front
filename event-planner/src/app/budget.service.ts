import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BudgetItemDTO {
  categoryId: number | null;
  amount: number | null;
  purchaseId?: number | null;
  reservationId?: number | null;
}

// export interface BudgetPlanDTO {
//   eventId: number;
//   itemsDTO: BudgetItemDTO[];
//   total?: number;
// }

export interface BudgetPlanDTO {
  eventId: number;
  items: BudgetItemDTO[];
  total?: number;
}

export interface BudgetItemDTO {
  id?: number;
  categoryId: number | null;
  amount: number | null;
  purchaseId?: number | null;
  reservationId?: number | null;
}

export interface CreateBudgetPlanDTO {
  eventId: number;
  itemsDTO: BudgetItemDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private apiUrl = '/api/budget';
  constructor(private http: HttpClient) {}

  createBudgetPlan(dto: any): Observable<BudgetPlanDTO> {
    return this.http.post<BudgetPlanDTO>(this.apiUrl, dto);
  }

  updateBudgetPlan(id: number, dto: any): Observable<any> {
    console.log('uso')
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  getBudgetPlansByOrganizer(organizerId: number): Observable<BudgetPlanDTO[]> {
    return this.http.get<BudgetPlanDTO[]>(`${this.apiUrl}/organizer/${organizerId}`);
  }

//   getBudgetPlanById(id: number): Observable<BudgetPlanDTO> {
//     return this.http.get<BudgetPlanDTO>(`${this.apiUrl}/${id}`);
//   }

  getBudgetByEventId(eventId: number): Observable<BudgetPlanDTO> {
    return this.http.get<BudgetPlanDTO>(`/api/budget/${eventId}`)
    }

}
