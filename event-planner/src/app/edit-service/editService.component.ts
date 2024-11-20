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
  selector: 'app-edit-service',
  templateUrl: './editService.component.html',
  styleUrl: './editService.component.css'
})
export class EditServiceComponent {

  constructor(private router: Router) {}

  eventTypes = [
    { name: 'Birthday', selected: true },
  ];

  categories = ['All', 'Catering', 'Photography', 'Entertainment'];
  selectedCategory = 'Catering';

  serviceName: string = 'Name of Service';
  serviceDescription: string= "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
  price: number | null = 12000;
  discount: number | null = 20;

  uploadedImages: string[] = []; // Holds image URLs for preview
  duration = { hours: 2, minutes: 30, minEngagement: 1, maxEngagement: 5};
  reservationDue = 5;
  cancellationDue = 5;

  isAvailable = true;
  isVisible = false;

  addImage(): void {
    const imageUrl = prompt('Enter image URL:'); // Mock image upload
    if (imageUrl) {
      this.uploadedImages.push(imageUrl);
    }
  }

  onEdit(): void {
    // console.log('Service edited:', {
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

  onDelete() {
    this.router.navigate(['/services']);
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
