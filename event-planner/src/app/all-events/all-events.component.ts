import { Component } from '@angular/core';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent {

  events = [
    { image: 'assets/images/event.jpg', title: 'Music Festival', description: 'Join us for an unforgettable night of music and fun.', date: new Date('2024-11-20') },
    { image: 'assets/images/event.jpg', title: 'Art Exhibition', description: 'Explore stunning artworks from local artists.', date: new Date('2024-12-05') },
    { image: 'assets/images/event.jpg', title: 'Tech Conference', description: 'Learn about the latest advancements in technology.', date: new Date('2024-11-25') },
    { image: 'assets/images/event.jpg', title: 'Charity Run', description: 'Run for a cause and make a difference.', date: new Date('2024-11-30') },
    { image: 'assets/images/event.jpg', title: 'Cooking Workshop', description: 'Master the art of Italian cooking.', date: new Date('2024-12-10') },
    { image: 'assets/images/event.jpg', title: 'Book Fair', description: 'Discover new books and meet your favorite authors.', date: new Date('2024-12-15') },
    { image: 'assets/images/event.jpg', title: 'Photography Contest', description: 'Showcase your photography skills and win prizes.', date: new Date('2024-12-20') },
    { image: 'assets/images/event.jpg', title: 'Dance Marathon', description: 'Dance the night away and compete for the title.', date: new Date('2024-11-28') },
    { image: 'assets/images/event.jpg', title: 'Film Screening', description: 'Enjoy a special screening of an indie movie.', date: new Date('2024-12-18') },
    { image: 'assets/images/event.jpg', title: 'Fitness Bootcamp', description: 'Start your fitness journey with expert trainers.', date: new Date('2024-11-22') },
  ];


  searchTerm: string = '';
  sortOption: string = 'name';
  filteredEvents = [...this.events]; // Kopija originalnih događaja

  filterEvents() {
    this.filteredEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortEvents(); // Ponovo sortiraj nakon filtriranja
  }

  sortEvents() {
    if (this.sortOption === 'name') {
      this.filteredEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOption === 'date') {
      this.filteredEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  }
}
