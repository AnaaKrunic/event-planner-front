import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css'],
})
export class AllEventsComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  sortOption: string = 'name';
  filterCategory: string = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllEvents();  // Fetch all events when component loads
  }

  // Fetch all events from the backend
  fetchAllEvents(): void {
    this.isLoading = true;

    this.http.get<any[]>('/api/events').subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = [...this.events]; // Initialize filtered events with all events
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    );
  }

  // Fetch filtered and sorted events from the backend based on search and filter parameters
  fetchFilteredAndSortedEvents(): void {
    this.isLoading = true;

    let params = new HttpParams();
    if (this.searchTerm) {
      params = params.set('name', this.searchTerm);
    }
    if (this.filterCategory && this.filterCategory !== 'all') {
      params = params.set('eventTypeName', this.filterCategory);
    }
    if (this.sortOption) {
      params = params.set('sortOption', this.sortOption);
    }

    // Make the HTTP request to fetch filtered and sorted events
    this.http.get<any[]>('/api/events/filter', { params }).subscribe(
      (data) => {
        this.events = data;
        this.filteredEvents = [...this.events]; // Update filtered events
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    );
  }

  // Trigger the fetch of filtered and sorted events when input changes
  onSearchTermChange(): void {
    this.fetchFilteredAndSortedEvents();
  }

  // Trigger the fetch of filtered and sorted events when category or sort option changes
  onFilterOrSortChange(): void {
    this.fetchFilteredAndSortedEvents();
  }
}
