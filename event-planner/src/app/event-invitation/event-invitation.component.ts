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
  eventId: number = 1; // Dinamički postavljen ID događaja

  constructor(private http: HttpClient) {}

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
    if (this.emailList.length === 0) {
      alert('Please add at least one email address');
      return;
    }

    const payload = {
      eventId: this.eventId,
      emailList: this.emailList
    };

    this.http.post('/api/invitations/send', payload).subscribe(
      () => {
        alert('Invitations sent successfully!');
        this.emailList = []; // Resetuje listu nakon uspešnog slanja
      },
      (error) => {
        alert('Failed to send invitations');
        console.error(error);
      }
    );
  }
}
