import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { EventTypeService } from '../event-type.service';

export interface Service {
  id?: number;
  name: string;
  price: number;
  category: string;
  serviceEventType: string[];
  availability: boolean;
  description: string;
  discount: number;
  images: string[];
  durationHour: number | null;
  durationMinute: number | null;
  minEngageHour: number | null;
  maxEngageHour: number | null;
  cancelation: number;
  reservation: number;
  reservationType: 'AUTO' | 'MANUAL';
  visible: boolean;
  status?: 'ACTIVE' | 'PENDING' | 'DELETED';
}

@Component({
  selector: 'app-add-service',
  templateUrl: './addService.component.html',
  styleUrls: ['./addService.component.css'],
})
export class AddServiceComponent implements OnInit {
  constructor(private router: Router, private serviceService: ServiceService, 
    private eventTypeService: EventTypeService) {}

  eventTypes: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  serviceName = '';
  serviceDescription = '';
  price: number | null = null;
  discount: number | null = null;
  uploadedImages: string[] = [];
  duration = { hours: 0, minutes: 0, minEngagement: 1, maxEngagement: 5 };
  reservationDue = 0;
  cancellationDue = 0;
  isAvailable = false;
  isVisible = false;

  durationType: 'fixed' | 'range' = 'fixed'; // default je fixed

  showCategoryPopup = false;
  newCategoryName = '';
  newCategoryDescription = '';

  reservationType: 'AUTO' | 'MANUAL' = 'AUTO';
  private categoryCounter: { [key: string]: number } = {};

  ngOnInit(): void {

    if (this.durationType === 'fixed') {
      this.duration.hours = this.duration.hours;
      this.duration.minutes = this.duration.minutes;
      this.duration.minEngagement = 0;
      this.duration.maxEngagement = 0;
    } else {
      this.duration.minEngagement = this.duration.minEngagement;
      this.duration.maxEngagement = this.duration.maxEngagement;
      this.duration.hours = 0;
      this.duration.minutes = 0;
    }
    
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes) => {
        this.eventTypes = eventTypes;
      },
      error: (err) => console.error('Error with database', err),
    });

    this.categories = [];
   }
            
  toggleEventType(type: any): void {
    type.selected = !type.selected;

  if (type.selected && type.suggestedCategories) {
    type.suggestedCategories
      .filter((c: any) => c.approvedByAdmin)
      .forEach((c: any) => {
      const name = c.name;
      if (!this.categoryCounter[name]) {
        this.categoryCounter[name] = 1;
        this.categories.push(name);
      } else {
        this.categoryCounter[name]++;
      }
    });
  } else if (!type.selected && type.suggestedCategories) {
    type.suggestedCategories
      .filter((c: any) => c.approvedByAdmin)
      .forEach((c: any) => {
        const name = c.name;
        if (this.categoryCounter[name]) {
          this.categoryCounter[name]--;
          if (this.categoryCounter[name] === 0) {
            delete this.categoryCounter[name];
            this.categories = this.categories.filter(cat => cat !== name);
          }
        }
      });
    }
  }

  toggleCategoryPopup() {
    this.showCategoryPopup = !this.showCategoryPopup;
  }

  closeCategoryPopup() {
    this.showCategoryPopup = false;
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      this.categories.push(this.newCategoryName.trim());
      this.selectedCategory = this.newCategoryName.trim();
    }
    this.closeCategoryPopup();
    this.newCategoryName = '';
    this.newCategoryDescription = '';
  }

  onFileSelect(event: any) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }

  onCreate(): void {

    if (this.durationType === 'range' && this.duration.minEngagement > this.duration.maxEngagement) {
      alert('Maksimalni angažman mora biti veći ili jednak minimalnom!');
      return;
    }

    // mapiranje event types
    const selectedEventTypes = this.eventTypes
      .filter((t) => t.selected)
      .map((t) => t.name);

    // kreiranje Service objekta
    const newService: Service = {
      name: this.serviceName,
      price: this.price ?? 0,
      category: this.selectedCategory,
      serviceEventType: selectedEventTypes,
      availability: this.isAvailable,
      description: this.serviceDescription,
      discount: this.discount ?? 0,
      images: this.uploadedImages,


      durationHour: this.durationType === 'fixed' ? this.duration.hours : null,
      durationMinute: this.durationType === 'fixed' ? this.duration.minutes : null,
      minEngageHour: this.durationType === 'range' ? this.duration.minEngagement : null,
      maxEngageHour: this.durationType === 'range' ? this.duration.maxEngagement : null,
      cancelation: this.cancellationDue,
      reservation: this.reservationDue,
      reservationType: this.reservationType,
      visible: this.isVisible,
    };

    // ako je kategorija nova → usluga ide u pending
    if (!this.categories.includes(newService.category)) {
      newService.status = 'PENDING';
      // ovde bi backend trebalo da šalje notifikaciju adminu
      this.serviceService.create(newService).subscribe({
        next: () => {
          alert(
            'Nova kategorija predložena. Usluga je u statusu PENDING dok admin ne odobri.'
          );
          this.router.navigate(['/services']);
        },
        error: (err) => console.error('Greška prilikom kreiranja usluge', err),
      });
      return;
    }

    // inače kreiramo uslugu normalno
    newService.status = 'ACTIVE';
    this.serviceService.create(newService).subscribe({
      next: () => {
        alert('Usluga uspešno kreirana!');
        this.router.navigate(['/services']);
      },
      error: (err) => console.error('Greška prilikom kreiranja usluge', err),
    });
  }

  onCancel(): void {
    this.router.navigate(['/services']);
  }
}
