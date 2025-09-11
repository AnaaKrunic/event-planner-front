import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServiceService } from '../service.service';
import { AuthService } from '../authservice.service';
import { Service } from '../service.service';
import { Category, CategoryService } from '../category.service';
import { EventType, EventTypeService } from '../event-type.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {

  constructor(private router: Router, private fb: FormBuilder, private serviceService: ServiceService, private authService: AuthService, private categoryService: CategoryService, private eventTypeService: EventTypeService) {}

  selectedCategory: string = '';
  selectedEventType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  selectedAvailable: boolean | string = 'all';
  selectedMinPrice = 0;
  selectedMaxPrice = 15000;
  thumbsize = 14;
  allServices: Service[] = [];
  displayedServices: Service[] = [];
  categories: Category[] = [];
  eventTypes: EventType[] = [];

  ngOnInit(): void {
    this.categoryService.getAllApproved().subscribe(cats => {
      this.categories = cats;
    });

    this.eventTypeService.getAll().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });

    this.serviceService.getByProvider().subscribe({
      next: (data) => {
        this.allServices = data;
        this.displayedServices = data;
        this.filterAndSearch();
      },
      error: (err) => {
        console.error("Error fetching provider services:", err);
      }
    });
  }

  filterAndSearch(): void {
    let filteredServices = [...this.allServices];
    if (this.selectedCategory) {
      filteredServices = filteredServices.filter(
        (service) => service.category.id === Number(this.selectedCategory)
      );
    }
  
    if (this.selectedEventType) {
      filteredServices = filteredServices.filter((service) => 
        service.eventTypes.some((et: EventType) => et.id === Number(this.selectedEventType))
      );
    }
    
    if (this.selectedAvailable === true) {
      filteredServices = filteredServices.filter(service => service.available === true);
    } else if (this.selectedAvailable === false) {
      filteredServices = filteredServices.filter(service => service.available === false);
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
    return Array.from({ length: Math.ceil(this.displayedServices.length / this.itemsPerPage) }, (_, i) => i + 1);
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

  getCategoryName(service: Service): string {
    const found = this.categories.find(cat => cat.id === service.category.id);
    return found ? found.name : 'Unknown';
  }

  getEventTypeNames(service: Service): string {
    if (!service.eventTypes || service.eventTypes.length === 0) {
      return 'Unknown';
    }
    return service.eventTypes.map((et: any) => et.name).join(', ');
  }

  getServiceImage(service: Service): string {
    return environment.apiUrl + service.imageURLs[0];
  }
}
