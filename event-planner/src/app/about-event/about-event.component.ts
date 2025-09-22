import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventDTO } from '../models/event.dto';
import * as L from 'leaflet';
import { AuthService } from '../authservice.service';
import { environment } from '../../environments/environment';
//import { WebSocketService } from './web-socket.service'; // Komentarisano, ako ne koristite WebSocket
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router'; 
import { BudgetService } from '../budget.service'

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
    private authService: AuthService,
    private router: Router,
    private budgetService: BudgetService
    
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


  generatePDF(): void {
    if (!this.event) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Event: ${this.event.name}`, 14, 20);

    doc.setFontSize(12);

    const maxWidth = 180;

    const descLines = doc.splitTextToSize(`Description: ${this.event.description}`, maxWidth);
    const start = this.event.startDate ? new Date(this.event.startDate) : null;
    const startStr = start ? start.toLocaleDateString('sr-RS', { dateStyle: 'medium' }) : 'N/A';

    let currentY = 30;
    doc.text(`Event type: ${this.event.eventTypeName}`, 14, currentY);
    currentY += 6;

    doc.text(descLines, 14, currentY);
    currentY += descLines.length * 6;

    doc.text(`Max. participants: ${this.event.participants}`, 14, currentY);
    currentY += 6;

    doc.text(`Privacy type: ${this.event.isPublic ? 'Public' : 'Private'}`, 14, currentY);
    currentY += 6;

    const locationText = this.event.location?.address || 'N/A';
    const locLines = doc.splitTextToSize(`Location: ${locationText}`, maxWidth);
    doc.text(locLines, 14, currentY);
    currentY += locLines.length * 6;
    
    doc.text(`Date: ${startStr}`, 14, currentY);
    currentY += 10;

    const tableData = this.event.activities.map(act => [
      act.startTime && act.endTime
        ? `${new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(act.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        : '',
      act.name,
      act.description,
      act.location
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Time', 'Activity name', 'Description', 'Location']],
      body: tableData,
      styles: { fontSize: 10, minCellHeight: 6 },
      columnStyles: { 2: { cellWidth: 80, overflow: 'linebreak' } },
      headStyles: { fillColor: [220, 220, 220], fontStyle: 'bold' }
    });

    doc.save(`${this.event.name}.pdf`);
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

  goToBudget(eventId: any){
    this.router.navigate(['/budget/', eventId]);
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
