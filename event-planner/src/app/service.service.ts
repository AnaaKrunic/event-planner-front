import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../app/authservice.service';
import { Category } from './category.service';
import { EventType } from './event-type.service';


export interface Service {
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
  isVisible: boolean;
  providerId: number;
  category: Category;
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

  update(service: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, service);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
