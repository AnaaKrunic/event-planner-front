import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateLocationDTO {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private baseUrl = '/api/locations';

  constructor(private http: HttpClient) {}

  createLocation(location: CreateLocationDTO): Observable<any> {
    return this.http.post<any>(this.baseUrl, location);
  }

  getAddress(lat: number, lng: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

    return this.http.get<any>(url);
    }
}
