import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  description: string;
  isApprovedByAdmin: boolean;
}

export interface CreateCategory {
  name: string;
  description: string;
  isApprovedByAdmin: boolean;
}

export interface UpdateCategory {
  id: number;
  name: string;
  description: string;
  isApprovedByAdmin: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private apiUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllApproved(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/approved`);
  }

  create(category: CreateCategory): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  update(id: number, category: UpdateCategory): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
