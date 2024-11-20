import { Component } from '@angular/core';

import { Router } from '@angular/router';

export interface Service {
  name: string;
  price: number;
  category: string;
  serviceEventType: string[];
  availability: boolean;
  description: string;
  discount: number;
  images: string[];
  durationHour: number;
  durationMinute: number;
  minEngageHour: number;
  minEngageminute: number; 
  maxEngageHour: number;
  maxEngageminute: number; 
  cancelation: number;
  reservation: number;
  reservationType: string
}

@Component({
  selector: 'app-add-service',
  templateUrl: './addService.component.html',
  styleUrls: ['./addService.component.css'],
})
export class AddServiceComponent {

  constructor(private router: Router) {}

  eventTypes = [
    { name: 'Birthday', selected: false },
    { name: 'Wedding', selected: false },
    { name: 'Engage', selected: false },
  ];

  categories = ['All', 'Catering', 'Photography', 'Entertainment'];
  selectedCategory = '';

  serviceName: string = '';
  serviceDescription: string= '';
  price: number | null = null;
  discount: number | null = null;

  uploadedImages: string[] = []; // Holds image URLs for preview
  duration = { hours: 0, minutes: 0, minEngagement: 1, maxEngagement: 5};
  reservationDue = 0;
  cancellationDue = 0;

  isAvailable = false;
  isVisible = false;
  showCategoryPopup: boolean = false;
  newCategoryName: string = '';
  newCategoryDescription: string = '';

  toggleEventType(type: any): void {
    type.selected = !type.selected;
  }

  addImage(): void {
    const imageUrl = prompt('Enter image URL:'); // Mock image upload
    if (imageUrl) {
      this.uploadedImages.push(imageUrl);
    }
  }

  onCreate(): void {
    // console.log('Service created:', {
    //   eventTypes: this.eventTypes.filter(type => type.selected).map(type => type.name),
    //   serviceName: this.serviceName,
    //   price: this.price,
    //   discount: this.discount,
    //   selectedCategory: this.selectedCategory,
    //   uploadedImages: this.uploadedImages,
    //   duration: this.duration,
    //   reservationDue: this.reservationDue,
    //   cancellationDue: this.cancellationDue,
    //   isAvailable: this.isAvailable,
    //   isVisible: this.isVisible,
    // });
    this.router.navigate(['/services']);    

  }

  onCancel(): void {
    this.router.navigate(['/services']);    
  }

  toggleCategoryPopup() {
      this.showCategoryPopup = !this.showCategoryPopup;
    }
  
  closeCategoryPopup() {
    this.showCategoryPopup = false;
  }
  
  addCategory() {
    this.showCategoryPopup = false;
    if (this.newCategoryName.trim()) {
      this.categories.push(this.newCategoryName);
      this.closeCategoryPopup();
      this.newCategoryName = '';
      this.newCategoryDescription = '';
    }
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
}
