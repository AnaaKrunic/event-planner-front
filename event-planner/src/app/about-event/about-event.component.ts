import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventDTO } from '../models/event.dto';
import * as L from 'leaflet';
import { AuthService } from '../authservice.service';
import { environment } from '../../environments/environment';
//import { WebSocketService } from './web-socket.service'; // Komentarisano, ako ne koristite WebSocket

@Component({
  selector: 'app-event-details',
  templateUrl: './about-event.component.html',
  styleUrls: ['./about-event.component.css']
})
export class AboutEventComponent implements OnInit {
  event!: EventDTO;
  isLoading: boolean = true;
  message: string = '';
  messages: string[] = [];

  userId: string | null = null;

  isFavorite = false;

  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
    //private webSocketService: WebSocketService // Komentarisano, ako ne koristite WebSocket
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchEventDetails(id);
    } else {
      console.error('Event ID is missing.');
      this.isLoading = false;
    }

    const currentUser = this.authService.getCurrentUser();
    this.userId = currentUser?.id || null;

    // Komentarisano, ako ne koristite WebSocket
    // this.webSocketService.connect('ws://localhost:8080/chat'); // URL WebSocket-a
  }

  fetchEventDetails(eventId: string): void {
    this.isLoading = true;
    this.http.get<EventDTO>(`/api/events/${eventId}`).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;

        if (this.userId) {
          this.checkIfFavorite(this.userId, this.event.id);
        }

        if (this.event.location) {
          setTimeout(() => {
            this.initMap(this.event.location.latitude, this.event.location.longitude);
          }, 0);
        }
      },
      error: (err) => {
        console.error('Error fetching event details:', err);
        this.isLoading = false;
      }
    });
  }

  private initMap(lat: number, lng: number): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const redPinIcon = L.icon({
      iconUrl: 'assets/images/location-pin.png',
      iconSize: [35, 40]
    });

    this.marker = L.marker([lat, lng], { icon: redPinIcon }).addTo(this.map);
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;

    const url = `${environment.apiUrl}/favorites/events/${this.userId}/${this.event.id}`;

    const request = this.isFavorite
      ? this.http.post(url, null, {
          headers: {
            Authorization: `Bearer ${this.authService.getToken()}`
          },
        responseType: 'text'
        })
      : this.http.delete(url, {
          headers: {
            Authorization: `Bearer ${this.authService.getToken()}`
          },
        responseType: 'text'
        });

    request.subscribe({
      next: () => {
        console.log(this.isFavorite ? 'Dodato u omiljene' : 'Uklonjeno iz omiljenih');
      },
      error: (err) => {
        console.error('Greška pri ažuriranju omiljenog eventa:', err);
        this.isFavorite = !this.isFavorite;
      }
    });
  }

  checkIfFavorite(userId: string, eventId: number): void {
    this.http.get<boolean>(`${environment.apiUrl}/favorites/events/events/${this.userId}/${this.event.id}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => this.isFavorite = res,
      error: (err) => console.error('Greška pri proveri omiljenog eventa:', err)
    });
  }

  // Komentarisano, ako ne koristite WebSocket
  /*sendMessage(): void {
    if (this.message.trim()) {
      this.webSocketService.sendMessage(this.message); // Slanje poruke putem WebSocket-a
      this.message = '';  // Resetuje polje za unos poruke
    }
  }*/

  // Komentarisano, ako ne koristite WebSocket
  /*onMessageReceived(message: string): void {
    this.messages.push(message);  // Dodaje novu poruku u chat
  }*/
}
