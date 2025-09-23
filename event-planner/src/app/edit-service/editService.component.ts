import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService, Service, UpdateService } from '../service.service';
import { EventTypeService } from '../event-type.service'; 
import { forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './editService.component.html',
  styleUrls: ['./editService.component.css']
})
export class EditServiceComponent implements OnInit {

  serviceId!: number;
  service!: any;

  serviceName = '';
  price = 0;
  discount = 0;
  serviceDescription = '';
  durations = { 
    hours: null as number | null, 
    minutes: null as number | null, 
    minEngagement: null as number | null, 
    maxEngagement: null as number | null 
  };
  reservationDue = 0;
  cancelationDue = 0;
  selectedCategory = '';
  uploadedImages: string[] = [];
  newFiles: File[] = [];
  isAvailable = true;
  isVisible = false;
  allEventTypes: { id: number, name: string, selected: boolean }[] = [];
  durationType: 'fixed' | 'range' = 'fixed';
  readonlyMode = false;
  SPPId!: number;
  isFavorite = false;
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private eventTypeService: EventTypeService,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.readonlyMode = params['viewOnly'] === 'true';
    });

    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.serviceService.getById(this.serviceId).subscribe({
      next: (data) => {
        this.service = data;
        this.SPPId = data.provider.id;
        this.fillForm(data);
        this.loadEventTypesForCategory(this.selectedCategory);

        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          const userId = currentUser.id;
          this.http.get<any[]>(`${environment.apiUrl}/favorites/solutions/${userId}`, {
            headers: { Authorization: `Bearer ${this.authService.getToken()}` }
          }).subscribe({
            next: (favorites) => {
              this.isFavorite = favorites.some(fav => fav.solution.id === this.serviceId);
            },
            error: (err) => console.error('Greška pri proveri favorita:', err)
          });
        }
      }
    });
  }

  fillForm(service: Service) {
    this.serviceId = service.id!;
    this.serviceName = service.name;
    this.serviceDescription = service.description;
    this.price = service.price;
    this.discount = service.discount;
    this.isVisible = service.visible;
    if (service.duration != null && service.duration > 0) {
      this.durations.hours = Math.floor(service.duration / 60);
      this.durations.minutes = service.duration % 60;
      this.durationType = 'fixed';
    } else if (service.minEngagement != null || service.maxEngagement != null) {
      this.durations.minEngagement = service.minEngagement ?? null;
      this.durations.maxEngagement = service.maxEngagement ?? null;
      this.durationType = 'range';
    }
    this.reservationDue = service.reservationDue;
    this.cancelationDue = service.cancelationDue;
    this.selectedCategory = service.category.name;
    this.uploadedImages = service.imageURLs;
    this.isAvailable = service.available;
  }

  loadEventTypesForCategory(category: string) {
    this.eventTypeService.getAll().subscribe({
      next: (eventTypes) => {
        const filtered = eventTypes.filter((et: any) => {
          return et.suggestedCategories?.some((cat: any) => cat.name === category);
        });
        this.allEventTypes = filtered.map((et: any) => ({
          id: et.id,
          name: et.name,
          selected: this.service.eventTypes.some(
            (selectedEt: any) => selectedEt.id === et.id
          )
        }));
      },
      error: (err) => {
        console.error('Error loading event types:', err);
      }
    });
  }

  toggleEventType(eventType: any) {
    if (this.readonlyMode) return;
    eventType.selected = !eventType.selected;
  }

  onEdit() {
    if (this.readonlyMode) return;
    const selectedEventTypes = this.allEventTypes
      .filter((t) => t.selected)
      .map((t) => t.id);
    forkJoin(
      selectedEventTypes.map((id) => this.eventTypeService.getById(id))
    ).subscribe((selectedEventObjects) => {
      this.service.eventTypes = selectedEventObjects;
      const selectedEventTypeIds = this.allEventTypes
        .filter((t) => t.selected)
        .map((t) => t.id);
      const updatedService: UpdateService = {
        ...this.service,
        id: this.serviceId,
        name: this.serviceName,
        price: this.price,
        discount: this.discount,
        description: this.serviceDescription,
        duration:
          this.durationType === 'fixed'
            ? (this.durations.hours ?? 0) * 60 + (this.durations.minutes ?? 0)
            : null,
        minEngagement:
          this.durationType === 'range' ? this.durations.minEngagement : null,
        maxEngagement:
          this.durationType === 'range' ? this.durations.maxEngagement : null,
        reservationDue: this.reservationDue,
        cancelationDue: this.cancelationDue,
        imageURLs: this.uploadedImages,
        available: this.isAvailable,
        eventTypeIds: selectedEventTypeIds,
        visible: this.service.visible,
        reservationType: this.service.reservationType,
        deleted: this.service.deleted,
        providerId: this.service.providerId
      };

      const formData = new FormData();
      formData.append(
        'dto',
        new Blob([JSON.stringify(updatedService)], { type: 'application/json' })
      );
      if (this.newFiles.length > 0) {
        this.newFiles.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      this.serviceService.update(this.service.id!, formData).subscribe({
        next: () => {
          alert('Service updated');
          this.router.navigate(['/services']);
        },
        error: (err) => {
          console.error('Error updating service:', err.error);
        }
      });
    });
  }

  onCancel() {
    this.router.navigate(['/services']);
  }

  onDelete() {
    this.serviceService.delete(this.serviceId).subscribe(() => {
      this.router.navigate(['/services']);
    });
  }

  onFileSelect(event: any): void {
    if (this.readonlyMode) return;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.newFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  getServiceImage(service: Service | undefined): string {
    if (!service || !service.imageURLs || service.imageURLs.length === 0) {
      return 'assets/default-image.png';
    }
    return environment.apiUrl + service.imageURLs[0];
  }


  removeImage(imgUrl: string, service: Service) {
    if (this.readonlyMode) return;
    const index = service.imageURLs.indexOf(imgUrl);
    if (index > -1) {
      service.imageURLs.splice(index, 1);
    }
  }

  onSPP() {
    this.router.navigate(['/profile', this.SPPId]);
  }

  toggleFavorite() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const userId = currentUser.id;
    const url = `${environment.apiUrl}/favorites/solutions/${userId}/${this.service.id}`;

    this.isFavorite = !this.isFavorite;

    const request = this.isFavorite
      ? this.http.post(url, null, {
          headers: { Authorization: `Bearer ${this.authService.getToken()}` },
          responseType: 'text'
        })
      : this.http.delete(url, {
          headers: { Authorization: `Bearer ${this.authService.getToken()}` },
          responseType: 'text'
        });

    request.subscribe({
      next: () => {},
      error: (err) => {
        console.error('Greška pri ažuriranju omiljenog eventa:', err, this.isFavorite);
        this.isFavorite = !this.isFavorite;
      }
    });
  }

  checkIfFavorite(userId: string, serviceId: number): void {
    this.http.get<boolean>(`${environment.apiUrl}/favorite-solutions/${userId}/${serviceId}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => {
        this.isFavorite = res;
      },
      error: (err) => console.error('Greška pri proveri omiljenog servisa:', err)
    });
  }

  chatVisible: boolean = false;

  openChat() {
    this.chatVisible = true;
  }

  closeChat() {
    this.chatVisible = false;
  }
}
