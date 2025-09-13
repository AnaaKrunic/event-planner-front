import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService, CreateService } from '../service.service';
import { EventTypeService } from '../event-type.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryService } from '../category.service';
import { AuthService } from '../authservice.service';


@Component({
  selector: 'app-add-service',
  templateUrl: './addService.component.html',
  styleUrls: ['./addService.component.css'],
})
export class AddServiceComponent implements OnInit {
  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private eventTypeService: EventTypeService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  categories: { id: number; name: string; isApprovedByAdmin: boolean }[] = [];
  selectedCategory: string = '';
  category: Category | null = null;
  categoryId: number | null = null;
  categoryName: string = '';
  eventTypes: any[] = [];

  serviceName = '';
  serviceDescription = '';
  price: number | null = null;
  discount: number | null = null;
  uploadedImages: string[] = [];

  durations = { hours: null as number | null, minutes: null as number | null, minEngagement: null as number | null, maxEngagement: null as number | null };
  reservationDue: number | null = null;
  cancellationDue: number | null = null;
  isAvailable = false;
  isVisible = true;

  providerId: number = 0;

  durationType: 'fixed' | 'range' = 'fixed'; // default je fixed

  showCategoryPopup = false;
  newCategoryName = '';
  newCategoryDescription = '';

  reservationType: 'AUTOMATIC' | 'MANUAL' = 'MANUAL';
  private categoryCounter: { [key: string]: number } = {};

  ngOnInit(): void {
    this.providerId = Number(this.authService.getCurrentUser()?.id);

    if (this.durationType === 'fixed') {
      this.durations.minEngagement = null;
      this.durations.maxEngagement = null;
    } else {
      this.durations.hours = null;
      this.durations.minutes = null;
    }

    this.eventTypeService.getAll().subscribe({
      next: (eventTypes) => {
        this.eventTypes = eventTypes;
      },
      error: () =>
        this.snackBar.open('Error with database (event-types)', undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }),
    });

    this.categories = [];
  }

  toggleEventType(type: any): void {
    type.selected = !type.selected;
    
    if (type.selected && type.suggestedCategories) {
      type.suggestedCategories
      .filter((c: any) => c.approvedByAdmin)
      .forEach((c: any) => {
        const id = c.id;
        const name = c.name;
        const isApprovedByAdmin = c.isApprovedByAdmin;
        
          if (!this.categoryCounter[name]) {
            this.categoryCounter[name] = 1;
            this.categories.push({ id, name, isApprovedByAdmin });
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
              this.categories = this.categories.filter((cat) => cat.name !== name);
              console.log(this.categories);
            }
          }
        });
    }
  }

  toggleCategoryPopup() {
    this.showCategoryPopup = !this.showCategoryPopup;
  }

  onCategoryChange(event: any) {
    const selectedName = event.target.value;
    this.selectedCategory = selectedName;

    const selected = this.categories.find((c) => c.name === selectedName);
    this.categoryId = selected ? selected.id : null;
    this.categoryService.getAll().subscribe(categories => {
      this.category = categories.find(c => c.id === this.categoryId) || null;
    });
  }

  closeCategoryPopup() {
    this.showCategoryPopup = false;
  }

  addCategory() {
    if (this.newCategoryName && this.newCategoryDescription) {
      const newCategory = {
        name: this.newCategoryName,
        description: this.newCategoryDescription,
        isApprovedByAdmin: false,
      };

      this.categoryService.create(newCategory).subscribe({
        next: (createdCategory) => {
          this.categories.push({ id: createdCategory.id, name: createdCategory.name, isApprovedByAdmin: false });
          this.selectedCategory = newCategory.name;
          this.categoryId = createdCategory.id;
          this.closeCategoryPopup();
        },
        error: () => {
          this.snackBar.open('Error creating category', undefined, {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
      });
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

  onCreate(): void {
  if (
    this.durationType === 'range' &&
    this.durations.minEngagement !== null &&
    this.durations.maxEngagement !== null &&
    this.durations.minEngagement > this.durations.maxEngagement
  ) {
    this.snackBar.open('Max Engagement must be greater or equal to Min Engagement', undefined, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return;
  }
  console.log(this.durations);

  this.categoryId = this.selectedCategory
    ? this.categories.find((c) => c.name === this.selectedCategory)?.id || -1
    : -1;

  const selectedEventTypes = this.eventTypes.filter((t) => t.selected).map((t) => t.id);
  
  this.isVisible = this.category?.isApprovedByAdmin || false;

  const newService: CreateService = {
    name: this.serviceName,
    description: this.serviceDescription,
    price: this.price ?? 0,
    discount: this.discount ?? 0,
    imageURLs: [],
    available: this.isAvailable,
    visible: this.isVisible,
    providerId: this.providerId,
    categoryId: this.categoryId,
    eventTypes: selectedEventTypes,
    duration: this.durationType === 'fixed' && this.durations.hours !== null && this.durations.minutes !== null
      ? this.durations.hours * 60 + this.durations.minutes
      : 0,
    minEngagement: this.durationType === 'range' ? this.durations.minEngagement : null,
    maxEngagement: this.durationType === 'range' ? this.durations.maxEngagement : null,
    reservationDue: this.reservationDue ?? 0,
    cancelationDue: this.cancellationDue ?? 0,
    reservationType: this.reservationType,
  };
  if (this.categoryId !== -1) {
    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(newService)], { type: 'application/json' }), 'dto.json');

    if ((<HTMLInputElement>document.getElementById('fileInput')).files) {
      const fileInput = <HTMLInputElement>document.getElementById('fileInput');
      if (fileInput && fileInput.files) {
        for (let i = 0; i < fileInput.files.length; i++) {
          formData.append('files', fileInput.files[i]);
        }
      }
    }

    this.serviceService.create(formData).subscribe({
      next: () => {
        this.router.navigate(['/services']);
        this.snackBar.open('Service successfully created!', undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Error creating service:', err, err.error);
        this.snackBar.open('Error creating service: ' + err, undefined, {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      },
    });
  } else {
      this.snackBar.open('Please select a category', undefined, {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/services/my-services']);
  }
}
