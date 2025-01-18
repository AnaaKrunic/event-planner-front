import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css'],
})
export class AllEventsComponent implements OnInit {
  events: any[] = []; // Lista događaja
  filteredEvents: any[] = []; // Filtrirani događaji
  isLoading: boolean = true; // Stanje učitavanja

  // Pretraga, filtriranje i sortiranje
  searchTerm: string = '';
  sortOption: string = 'name';
  filterCategory: string = 'all';

  // Paginacija
  currentPage: number = 0; // Trenutna stranica
  pageSize: number = 10; // Broj stavki po stranici
  totalPages: number = 0; // Ukupan broj stranica
  totalEvents: number = 0; // Ukupan broj događaja

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAllEvents(); // Učitavanje događaja pri inicijalizaciji
  }

  // Metoda za dohvat svih događaja
  fetchAllEvents(): void {
    this.isLoading = true;

    this.http.get<any[]>('/api/events').subscribe(
      (data) => {
        console.log('Fetched events:', data);
        this.events = Array.isArray(data) ? data : []; // Osigurajte da `this.events` bude niz
        this.filteredEvents = [...this.events]; // Kopiranje podataka u `filteredEvents`
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching events:', error);
        this.events = []; // Postavite na prazan niz u slučaju greške
        this.filteredEvents = [];
        this.isLoading = false;
      }
    );
  }

  // Search events
  fetchSearchResults(page: number = 0): void {
    this.isLoading = true;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', this.pageSize.toString())
      .set('sort', this.sortOption);

    if (this.searchTerm) {
      params = params.set('name', this.searchTerm);
    }


    console.log('Search params:', params.toString()); // Log za proveru

    this.http.get<any>('/api/events/search', { params }).subscribe(
      (response) => {
        console.log('Search results:', response); // Log za proveru odgovora
        this.events = response.content || [];
        this.filteredEvents = [...this.events];
        this.totalPages = response.totalPages;
        this.totalEvents = response.totalElements;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching search results:', error);
        this.isLoading = false;
      }
    );
  }

  // Navigacija na određenu stranicu
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.fetchSearchResults(page);
    }
  }

  // Trigger za pretragu pri promeni unosa
  onSearchTermChange(): void {
    if (this.searchTerm.trim() === '') {
      // Ako je polje za pretragu prazno, ponovo učitajte sve događaje
      this.fetchAllEvents();
    } else {
      // Inače izvršite pretragu
      this.currentPage = 0; // Resetuje na prvu stranicu
      this.fetchSearchResults();
    }
  }

  // Trigger za filtriranje ili sortiranje
  onFilterOrSortChange(): void {
    this.currentPage = 0; // Resetuje na prvu stranicu
    this.fetchSearchResults();
  }
}
