import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId!: number;
  editForm!: FormGroup;
  product: any;

  eventTypes: any[] = [];   
  selectedEventTypes: number[] = []; 

  selectedFiles: File[] = [];
  removedImages: string[] = []; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEventTypes();
    this.loadProduct();
  }

  loadEventTypes(): void {
    this.http.get<any[]>('/api/event-types').subscribe({
      next: (data) => (this.eventTypes = data),
      error: (err) => console.error('Error loading event types:', err),
    });
  }

  loadProduct(): void {
    this.http.get<any>(`/api/products/${this.productId}`).subscribe({
      next: (data) => {
        this.product = data;

        this.selectedEventTypes = data.eventTypes?.map((et: any) => et.id) || [];

        this.editForm = this.fb.group({
          name: [data.name, Validators.required],
          description: [data.description],
          price: [data.price, [Validators.required, Validators.min(0)]],
          discount: [data.discount, [Validators.min(0), Validators.max(100)]],
          isVisible: [!!data.isVisible],
          isAvailable: [!!data.isAvailable]
        });
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }

  toggleEventType(typeId: number): void {
    if (this.selectedEventTypes.includes(typeId)) {
      this.selectedEventTypes = this.selectedEventTypes.filter(id => id !== typeId);
    } else {
      this.selectedEventTypes.push(typeId);
    }
  }

  onFileChange(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  removeExistingImage(index: number): void {
    const removed = this.product.imageURLs[index];
    this.removedImages.push(removed);   
    this.product.imageURLs.splice(index, 1);
  }

  saveChanges(): void {
    const formData = new FormData();
    const dtoValue = {
      ...this.editForm.value,
      productId: this.productId,
      eventTypes: this.selectedEventTypes,
      imageURLs: this.product.imageURLs.filter((url: string) => !this.removedImages.includes(url))
    };

    dtoValue['visible'] = dtoValue['isVisible'];
    dtoValue['available'] = dtoValue['isAvailable'];
    delete dtoValue['isVisible'];
    delete dtoValue['isAvailable'];

    formData.append('dto', new Blob([JSON.stringify(dtoValue)], { type: 'application/json' }));
    this.selectedFiles.forEach(file => formData.append('files', file));

    this.http.put<any>(`/api/products/${this.productId}`, formData).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/all-products']);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Failed to update product. Please try again.');
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/all-products']); 
  }
}
