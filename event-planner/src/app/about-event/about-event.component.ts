import { Component } from '@angular/core';

@Component({
  selector: 'app-about-event',
  templateUrl: './about-event.component.html',
  styleUrls: ['./about-event.component.css']
})
export class AboutEventComponent {
  eventName: string = 'EVENT NAME';
  eventDate: string = '02/11/2024';
  eventDescription: string = 'Lore ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  eventLocation: string = 'Some Street, Birmingham';
  maxParticipants: number = 160;
  mapUrl: string = 'https://maps.google.com/maps/api/staticmap?center=Birmingham&zoom=14&size=400x400';
}
