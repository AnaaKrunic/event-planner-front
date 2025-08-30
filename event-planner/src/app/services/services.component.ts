import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface Service {
  name: string;
  price: number;
  category: string;
  serviceEventType: string[];
  availability: boolean;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder) {}

  selectedCategory: string = '';
  selectedEventType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  selectedAvailable: boolean = false;
  selectedNotAvailable: boolean = false;

  // range slider vrednosti
  selectedMinPrice = 0;
  selectedMaxPrice = 15000;

  // Angular Material slider group
  // priceRangeGroup!: FormGroup;

  thumbsize = 14;
  
  allServices: Service[] = [
    {
      name: 'Service 1',
      price: 1250,
      category: 'Entertainment',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 2',
      price: 3200,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 3',
      price: 500,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 4',
      price: 3000,
      category: 'Catering',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 5',
      price: 6000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 6',
      price: 8000,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 7',
      price: 2000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 8',
      price: 7500,
      category: 'Catering',
      serviceEventType: ['Wedding', 'Birthday'],
      availability: true,
    },
    {
      name: 'Service 9',
      price: 3000,
      category: 'Entertainment',
      serviceEventType: ['Birthday'],
      availability: false,
    },
    {
      name: 'Service 12',
      price: 3000,
      category: 'Catering',
      serviceEventType: ['Wedding'],
      availability: false,
    },
    {
      name: 'Service 10',
      price: 1200,
      category: 'Catering',
      serviceEventType: ['Birthday'],
      availability: true,
    },
    {
      name: 'Service 11',
      price: 200,
      category: 'Entertainment',
      serviceEventType: ['Wedding'],
      availability: false,
    }
  ];

  displayedServices: Service[] = [];

  ngOnInit(): void {
    // // inicijalizuj formu za slider
    // this.priceRangeGroup = this.fb.group({
    //   startPrice: [this.selectedMinPrice],
    //   endPrice: [this.selectedMaxPrice]
    // });

    // // slušaj promene slidera
    // this.priceRangeGroup.valueChanges.subscribe(val => {
    //   this.selectedMinPrice = val.startPrice;
    //   this.selectedMaxPrice = val.endPrice;
    //   this.filterAndSearch();
    // });

    this.filterAndSearch();
  }

  filterAndSearch(): void {
    let filteredServices = this.allServices;
  
    if (this.selectedCategory) {
      filteredServices = filteredServices.filter(
        (service) => service.category === this.selectedCategory
      );
    }
  
    if (this.selectedEventType) {
      filteredServices = filteredServices.filter((service) =>
        service.serviceEventType.includes(this.selectedEventType)
      );
    }
  
    if (this.selectedAvailable && !this.selectedNotAvailable) {
      filteredServices = filteredServices.filter((service) => service.availability === true);
    }
  
    if (this.selectedNotAvailable && !this.selectedAvailable) {
      filteredServices = filteredServices.filter((service) => service.availability === false);
    }
  
    if (this.selectedAvailable && this.selectedNotAvailable) {
      filteredServices = filteredServices.filter(
        (service) => service.availability === true || service.availability === false
      );
    }
  
    filteredServices = filteredServices.filter(
      (service) => service.price >= this.selectedMinPrice && service.price <= this.selectedMaxPrice
    );
  
    filteredServices = filteredServices.filter(
      (service) => service.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedServices = filteredServices.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.filterAndSearch();
  }

  get totalPages(): number[] {
    return Array.from({ length: Math.ceil(this.allServices.length / this.itemsPerPage) }, (_, i) => i + 1);
  }

  toggleAvailability(): void {
    this.filterAndSearch(); 
  } 
  
  goToEditService() {
    this.router.navigate(['/edit-service']);
  }

  goToAddService() {
    this.router.navigate(['/add-service']);    
  }
}
