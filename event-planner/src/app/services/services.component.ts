import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceService } from '../service.service';

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

  constructor(private router: Router, private fb: FormBuilder, private serviceService: ServiceService) {}

  selectedCategory: string = '';
  selectedEventType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  selectedAvailable: boolean = false;
  selectedNotAvailable: boolean = false;
  selectedMinPrice = 0;
  selectedMaxPrice = 15000;
  thumbsize = 14;
  allServices: Service[] = [];

  displayedServices: Service[] = [];

  ngOnInit(): void {
    this.serviceService.getAll().subscribe({
      next: (data) => {
        this.allServices = data;
        this.filterAndSearch();
      },
      error: (err) => {
        console.error("Error fetching services:", err);
      }
    });
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
