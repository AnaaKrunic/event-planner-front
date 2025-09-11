import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventType {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class EventTypeService {
  private apiUrl = '/api/event-types';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, dto);
  }

  activate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}
