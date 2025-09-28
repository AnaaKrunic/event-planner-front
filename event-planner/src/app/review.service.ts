import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateReviewDTO {
  userId: number;
  rating: number;
  comment: string;
  solutionId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = '/api/reviews';

  constructor(private http: HttpClient) {}

  createReview(dto: CreateReviewDTO): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }
}
