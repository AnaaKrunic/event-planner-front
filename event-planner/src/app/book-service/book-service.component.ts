import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-service',
  templateUrl: './book-service.component.html',
  styleUrls: ['./book-service.component.css'],
})
export class BookServiceComponent implements OnInit {
  selectedService: any; // Odabrana usluga
  reservation = {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  };

  minDate: string;

  constructor(private http: HttpClient) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Za onemogućavanje prošlih datuma
  }

  ngOnInit(): void {
    this.selectedService = { name: 'Photography', duration: 2 }; // Primer; ovde treba preuzeti stvarnu uslugu
  }

  onStartTimeChange(): void {
    const start = new Date(`${this.reservation.startDate}T${this.reservation.startTime}`);
    const durationInHours = this.selectedService?.duration || 0;

    const end = new Date(start.getTime() + durationInHours * 60 * 60 * 1000);

    this.reservation.endTime = end.toISOString().split('T')[1].substring(0, 5); // Formatiranje vremena
    this.reservation.endDate = this.reservation.startDate; // Postavljanje datuma završetka
  }

  onSubmit(): void {
    const reservationRequest = {
      startDate: this.reservation.startDate,
      endDate: this.reservation.endDate,
      startTime: this.reservation.startTime,
      endTime: this.reservation.endTime,
      serviceId: this.selectedService.id,
      eventOrganizerId: 1 // Primer ID organizatora događaja
    };

    this.http.post('/api/reservations', reservationRequest).subscribe(
      (response) => {
        console.log('Reservation created:', response);
        alert('Reservation successful!');
      },
      (error) => {
        console.error('Error creating reservation:', error);
        alert('Error making reservation.');
      }
    );
  }
}
