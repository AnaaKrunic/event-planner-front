import { Component } from '@angular/core';
import { EventsComponent } from './events/events.component';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Event Planner';
}

