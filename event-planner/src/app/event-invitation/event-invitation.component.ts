import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-invitation',
  templateUrl: './event-invitation.component.html',
  styleUrls: ['./event-invitation.component.css']
})
export class EventInvitationComponent {
  emailInput: string = '';
  emailList: string[] = [];

  constructor(private http: HttpClient) {}

  // Dodavanje e-maila u listu
  addEmail() {
    if (this.emailInput && this.validateEmail(this.emailInput)) {
      this.emailList.push(this.emailInput.trim());
      this.emailInput = ''; // Resetuje unos
    } else {
      alert('Invalid email address');
    }
  }

  removeEmail(index: number) {
    this.emailList.splice(index, 1);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  sendInvitations() {
    const eventId = 1; // ID događaja, treba da se poveže sa backend-om
    const payload = {
      eventId: eventId,
      emailList: this.emailList
    };

    this.http.post('/api/invitations/send', payload).subscribe(
      response => {
        alert('Invitations sent successfully!');
        this.emailList = []; // Resetuje listu nakon uspešnog slanja
      },
      error => {
        alert('Failed to send invitations');
        console.error(error);
      }
    );
  }
}
