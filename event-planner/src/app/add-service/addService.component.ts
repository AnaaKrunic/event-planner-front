import { Component, OnInit } from '@angular/core';

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
    eventTypes = [
      { name: 'Birthday', selected: false },
      { name: 'Wedding', selected: false },
      { name: 'Engage', selected: false },
      // Add more event types as needed
    ];
  
    categories = ['All', 'Catering', 'Photography', 'Entertainment'];
    selectedCategory = '';
  
    serviceName = '';
    serviceDescription = '';
    price: number | null = null;
    discount: number | null = null;
  
    uploadedImages: string[] = []; // Holds image URLs for preview
    duration = { hours: 0, minutes: 0, minEngagement: 1, maxEngagement: 5};
    reservationDue = 0;
    cancellationDue = 0;
  
    isAvailable = false;
    isVisible = false;
  
    toggleEventType(type: any): void {
      type.selected = !type.selected;
    }
  
    addImage(): void {
      const imageUrl = prompt('Enter image URL:'); // Mock image upload
      if (imageUrl) {
        this.uploadedImages.push(imageUrl);
      }
    }
  
    removeImage(index: number): void {
      this.uploadedImages.splice(index, 1);
    }
  
    onCreate(): void {
      console.log('Service created:', {
        eventTypes: this.eventTypes.filter(type => type.selected).map(type => type.name),
        serviceName: this.serviceName,
        price: this.price,
        discount: this.discount,
        selectedCategory: this.selectedCategory,
        uploadedImages: this.uploadedImages,
        duration: this.duration,
        reservationDue: this.reservationDue,
        cancellationDue: this.cancellationDue,
        isAvailable: this.isAvailable,
        isVisible: this.isVisible,
      });
    }
  
    onCancel(): void {
      console.log('Service creation canceled.');
    }
  }
  