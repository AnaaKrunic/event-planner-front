import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events = [
    { image: 'assets/images/event.jpg' },
    { image: 'assets/images/event.jpg' },
    { image: 'assets/images/event.jpg' },
    { image: 'assets/images/event.jpg' },
    { image: 'assets/images/event.jpg' },
  ];
}
