import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ServiceService } from '../service.service';
import { AuthService } from '../authservice.service';
import { Service } from '../service.service';
import { Category, CategoryService } from '../category.service';
import { EventType, EventTypeService } from '../event-type.service';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private categoryService: CategoryService,
    private eventTypeService: EventTypeService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  selectedCategory: string = '';
  selectedEventType: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  selectedAvailable: boolean | string = 'all';
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 0;
  maxServicePrice: number = 0;
  thumbsize = 14;
  allServices: Service[] = [];
  displayedServices: Service[] = [];
  categories: Category[] = [];
  eventTypes: EventType[] = [];

  userRole: string | null = null;
  mode: '' | 'my' = '';

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;

    this.route.url.subscribe((segments) => {
      const path = segments.map((s) => s.path).join('/');
      this.mode = path === 'services' ? 'my' : '';
      this.loadProducts();
    });

    this.categoryService.getAllApproved().subscribe(cats => {
      this.categories = cats;
    });

    this.eventTypeService.getAll().subscribe(eventTypes => {
      this.eventTypes = eventTypes;
    });
  }

  loadProducts(): void {
    if (this.mode === 'my') {
      this.fetchMyProducts();
    } else {
      this.fetchAllProducts();
    }
  }

  fetchMyProducts(): void {
    this.serviceService.getByProvider().subscribe({
      next: (data) => {
        this.allServices = data;

        this.maxServicePrice = this.allServices.length > 0 
          ? Math.max(...this.allServices.map(s => s.price)) 
          : 0;

        this.selectedMaxPrice = this.maxServicePrice;
        this.displayedServices = this.allServices;
        this.filterAndSearch();
      },
      error: (err) => {
        this.snackBar.open('Error fetching provider services', undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }

  fetchAllProducts(): void {
    this.serviceService.getAll().subscribe({
      next: (data) => {
        this.allServices = data;

        this.maxServicePrice = this.allServices.length > 0 
          ? Math.max(...this.allServices.map(s => s.price)) 
          : 0;

        this.selectedMaxPrice = this.maxServicePrice;
        this.displayedServices = this.allServices;
        this.filterAndSearch();
      },
      error: (err) => {
        this.snackBar.open('Error fetching provider services', undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
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
    return Array.from(
      { length: Math.ceil(this.displayedServices.length / this.itemsPerPage) }, 
      (_, i) => i + 1
    );
  }

  toggleAvailability(): void {
    this.filterAndSearch(); 
  } 

  goToEditService(service: Service) {
    if (this.mode === 'my') {
      this.router.navigate(['/edit-service', service.id], { queryParams: { viewOnly: false } });
    } else {
      this.router.navigate(['/edit-service', service.id], { queryParams: { viewOnly: true } });
    }
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
