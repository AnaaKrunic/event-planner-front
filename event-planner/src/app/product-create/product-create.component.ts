import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { EventTypeService } from '../event-type.service';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  eventTypes: any[] = [];
  categories: any[] = [];

  product: any = {
    name: '',
    description: '',
    price: null,
    discount: 0,
    available: true,
    visible: true,
    categoryId: null,
    newCategoryName: '',
    newCategoryDescription: '',
    eventTypeIds: []
  };


  files: File[] = [];

  selectedEventTypes: { [id: number]: boolean } = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private eventTypeService: EventTypeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });

    this.eventTypeService.getAll().subscribe(data => {
      this.eventTypes = data;
    });
  }

  toggleAvailability() {
    this.product.available = !this.product.available;
  }

  toggleVisibility() {
    this.product.visible = !this.product.visible;
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      for (let file of event.target.files) {
        this.files.push(file);
      }
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  onSubmit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // ako se kreira nova kategorija
    if (this.product.newCategoryName && this.product.newCategoryDescription) {
      const newCategory = {
        name: this.product.newCategoryName,
        description: this.product.newCategoryDescription,
        isApprovedByAdmin: false
      };

      this.categoryService.create(newCategory).subscribe({
        next: (createdCategory) => {
          console.log("New category created:", createdCategory);

          this.product.visible = false;

          this.createProductRequest(currentUser.id, createdCategory.id);
        },
        error: (err) => {
          console.error("Error creating category", err);
        }
      });

    } else {
      this.createProductRequest(currentUser.id, this.product.categoryId);
    }
  }

  private createProductRequest(providerId: string, categoryId: number | null) {
    const dto = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      discount: this.product.discount,
      visible: this.product.visible,
      available: this.product.available,
      providerId: providerId,
      categoryId: categoryId,
      eventTypes: this.product.eventTypeIds
    };

    const formData = new FormData();
    formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    for (let file of this.files) {
      formData.append('files', file);
    }

    this.productService.create(formData).subscribe({
      next: (res) => {
        console.log('Product successfully created:', res);
        alert('Product successfully created!');
        this.router.navigate(['/all-products']);
      },
      error: (err) => {
        console.error('Error creating product', err);
      }
    });
  }

  updateEventTypes() {
    this.product.eventTypeIds = Object.keys(this.selectedEventTypes)
      .filter(id => this.selectedEventTypes[+id])
      .map(id => +id);
  }
}
