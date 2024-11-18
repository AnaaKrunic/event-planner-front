import { Component } from '@angular/core';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css'],
})
export class AllEventsComponent {
  events = [
    { image: 'assets/images/event.jpg', title: 'Music Festival', description: 'Join us for an unforgettable night of music.', date: new Date('2024-11-20'), category: 'Music' },
    { image: 'assets/images/event.jpg', title: 'Art Exhibition', description: 'Explore stunning artworks from local artists.', date: new Date('2024-12-05'), category: 'Art' },
    { image: 'assets/images/event.jpg', title: 'Tech Conference', description: 'Learn about the latest advancements in technology.', date: new Date('2024-11-25'), category: 'Technology' },
    { image: 'assets/images/event.jpg', title: 'Charity Run', description: 'Run for a cause and make a difference.', date: new Date('2024-11-30'), category: 'Fitness' },
    { image: 'assets/images/event.jpg', title: 'Cooking Workshop', description: 'Master the art of Italian cooking.', date: new Date('2024-12-10'), category: 'Cooking' },
    { image: 'assets/images/event.jpg', title: 'Book Fair', description: 'Discover new books and meet your favorite authors.', date: new Date('2024-12-15'), category: 'Books' },
    { image: 'assets/images/event.jpg', title: 'Photography Contest', description: 'Showcase your photography skills.', date: new Date('2024-12-20'), category: 'Photography' },
    { image: 'assets/images/event.jpg', title: 'Dance Marathon', description: 'Dance the night away.', date: new Date('2024-11-28'), category: 'Dance' },
    { image: 'assets/images/event.jpg', title: 'Film Screening', description: 'Enjoy a special indie movie screening.', date: new Date('2024-12-18'), category: 'Film' },
    { image: 'assets/images/event.jpg', title: 'Fitness Bootcamp', description: 'Start your fitness journey.', date: new Date('2024-11-22'), category: 'Fitness' },
  ];

  searchTerm: string = '';
  sortOption: string = 'name';
  filterCategory: string = 'all';

  filteredEvents = [...this.events];

  filterAndSortEvents() {
    // Pretraga
    let tempEvents = this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Filtriranje po kategoriji
    if (this.filterCategory !== 'all') {
      tempEvents = tempEvents.filter(event => event.category === this.filterCategory);
    }

    // Sortiranje
    if (this.sortOption === 'name') {
      tempEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOption === 'date') {
      tempEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    this.filteredEvents = tempEvents;
  }
}
