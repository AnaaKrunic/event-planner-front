import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  standalone: false,
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  events: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    console.log('Fetching events...'); // Log kada metoda počne
    this.http.get<any[]>('/api/events/top-5').subscribe(
      (data) => {
        console.log('Fetched data:', data); // Log podataka iz API-ja
        this.events = data;
        this.isLoading = false;
        console.log('Events loaded successfully:', this.events); // Log učitanih događaja
      },
      (error) => {
        console.error('Error fetching events:', error); // Log greške
        console.log('Error details:', {
          status: error.status,
          message: error.message,
          errorBody: error.error,
        });
        this.isLoading = false;
      }
    );
  }
}
