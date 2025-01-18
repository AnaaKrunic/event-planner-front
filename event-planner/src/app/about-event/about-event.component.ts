//student 1 implementira tacku 2.6 - detalji o dogadjaju

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import { WebSocketService } from './web-socket.service'; // Komentarisano, ako ne koristite WebSocket

@Component({
  selector: 'app-event-details',
  templateUrl: './about-event.component.html',
  styleUrls: ['./about-event.component.css']
})
export class AboutEventComponent implements OnInit {
  event: any;
  isLoading: boolean = true;
  message: string = '';
  messages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
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

    // Komentarisano, ako ne koristite WebSocket
    // this.webSocketService.connect('ws://localhost:8080/chat'); // URL WebSocket-a
  }

  fetchEventDetails(eventId: string): void {
    this.isLoading = true;
    this.http.get<any>(`/api/events/${eventId}`).subscribe(
      (data) => {
        this.event = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching event details:', error);
        this.isLoading = false;
      }
    );
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
