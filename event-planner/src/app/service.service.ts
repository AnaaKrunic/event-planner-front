import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../app/authservice.service';
import { Category } from './category.service';
import { EventType } from './event-type.service';

export interface Service {
  id?: number;
  name: string;
  price: number;
  eventTypes: EventType[];
  available: boolean;
  description: string;
  discount: number;
  imageURLs: string[];
  duration: number | null;
  minEngagement: number | null;
  maxEngagement: number | null;
  cancelationDue: number;
  reservationDue: number;
  reservationType: 'AUTOMATIC' | 'MANUAL';
  visible: boolean;
  deleted: boolean;
  providerId: number;
  category: Category;
}

export interface UpdateService {
  id: number;
  name: string;
  price: number;
  eventTypeIds: number[];
  available: boolean;
  visible: boolean;
  description: string;
  discount: number;
  imageURLs: string[];
  duration: number | null;
  minEngagement: number | null;
  maxEngagement: number | null;
  cancelationDue: number;
  reservationDue: number;
  reservationType: 'AUTOMATIC' | 'MANUAL';
  deleted: boolean;
  providerId: number;
}

export interface CreateService {
  name: string;
  description: string;
  price: number;
  discount: number;
  imageURLs: string[];
  available: boolean;
  visible: boolean;
  providerId: number;
  categoryId: number;
  eventTypes: number[];
  duration: number | null;
  minEngagement: number | null;
  maxEngagement: number | null;
  reservationDue: number;
  cancelationDue: number;
  reservationType: 'AUTOMATIC' | 'MANUAL';
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = '/api/services';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getByProvider(): Observable<Service[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser.token}`
    });

    return this.http.get<Service[]>(`${this.apiUrl}/my-services?providerId=${currentUser.id}`, { headers });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(formData: FormData) {
    const currentUser = this.authService.getCurrentUser();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${currentUser?.token || ''}`
    });
    return this.http.post(this.apiUrl, formData, { headers });
  }

  update(id: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt') || ''}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
