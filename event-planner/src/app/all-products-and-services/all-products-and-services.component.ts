import { Component } from '@angular/core';

@Component({
  selector: 'app-all-products-and-services',
  templateUrl: './all-products-and-services.component.html',
  styleUrls: ['./all-products-and-services.component.css'],
})
export class AllProductsAndServicesComponent {
  productsAndServices = [
    { image: 'assets/images/product.jpg', name: 'Live Band', description: 'Professional music band for your events.', category: 'Entertainment', city: 'New York', price: 1000 },
    { image: 'assets/images/product.jpg', name: 'Wedding Cake', description: 'Custom-made wedding cakes.', category: 'Catering', city: 'Los Angeles', price: 500 },
    { image: 'assets/images/product.jpg', name: 'Event Flags', description: 'Custom flags for your events.', category: 'Decoration', city: 'Chicago', price: 200 },
    { image: 'assets/images/product.jpg', name: 'Event Decoration', description: 'Elegant decorations for any event.', category: 'Decoration', city: 'Paris', price: 700 },
    { image: 'assets/images/product.jpg', name: 'Photography Service', description: 'Professional photography for events.', category: 'Photography', city: 'Berlin', price: 800 },
    { image: 'assets/images/product.jpg', name: 'DJ Service', description: 'Top DJ to make your event unforgettable.', category: 'Entertainment', city: 'Amsterdam', price: 1200 },
  ];

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedCity: string = '';
  sortOption: string = 'name';
  filteredProductsAndServices = [...this.productsAndServices];

  filterAndSearch() {
    this.filteredProductsAndServices = this.productsAndServices
      .filter((item) =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .filter((item) =>
        this.selectedCategory ? item.category === this.selectedCategory : true
      )
      .filter((item) =>
        this.selectedCity ? item.city === this.selectedCity : true
      );

    this.sortProductsAndServices();
  }

  sortProductsAndServices() {
    if (this.sortOption === 'name') {
      this.filteredProductsAndServices.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'price') {
      this.filteredProductsAndServices.sort((a, b) => a.price - b.price);
    }
  }
}
