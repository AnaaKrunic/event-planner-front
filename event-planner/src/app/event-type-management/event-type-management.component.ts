import { Component, OnInit } from '@angular/core';
import { EventTypeService } from '../event-type.service';
import { CategoryService } from '../category.service';
import { AuthService } from '../authservice.service';

@Component({
  selector: 'app-event-type-management',
  templateUrl: './event-type-management.component.html',
  styleUrls: ['./event-type-management.component.css']
})
export class EventTypeManagementComponent implements OnInit {
  eventTypes: any[] = [];
  categories: any[] = [];

  newEventType = { name: '', description: '', selectedCategoryIds: [] as number[] };

  editingEventType: any = null;
  showAddForm: boolean = false;

  userRole: string | null = null;

  constructor(private authService: AuthService, private eventTypeService: EventTypeService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadEventTypes();
    this.loadCategories();

    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
  }

  loadEventTypes(): void {
    this.eventTypeService.getAll().subscribe(data => {
      this.eventTypes = data;
    });
  }

  loadCategories(): void {
    this.categoryService.getAllApproved().subscribe(data => {
      this.categories = data;
    });
  }

  onCategoryChange(categoryId: number, event: any, mode: 'new' | 'edit'): void {
    const checked = event.target.checked;

    if (mode === 'new') {
      if (checked) {
        this.newEventType.selectedCategoryIds.push(categoryId);
      } else {
        this.newEventType.selectedCategoryIds =
          this.newEventType.selectedCategoryIds.filter(id => id !== categoryId);
      }
    }

    if (mode === 'edit') {
      if (checked) {
        this.editingEventType.selectedCategoryIds.push(categoryId);
      } else {
        this.editingEventType.selectedCategoryIds =
          this.editingEventType.selectedCategoryIds.filter((id: number) => id !== categoryId);
      }
    }
  }

  addEventType(): void {
    const selectedCategories = this.newEventType.selectedCategoryIds.map(
      id => this.categories.find(c => c.id === id)
    );

    const payload = {
      name: this.newEventType.name,
      description: this.newEventType.description,
      suggestedCategories: selectedCategories
    };

    this.eventTypeService.create(payload).subscribe(() => {
      this.newEventType = { name: '', description: '', selectedCategoryIds: [] };
      this.loadEventTypes();
    });
  }

  startEditing(eventType: any): void {
    this.editingEventType = { 
      ...eventType,
      selectedCategoryIds: eventType.suggestedCategories?.map((c: any) => c.id) || []
    };
  }

  saveEdit(): void {
    const selectedCategories = this.editingEventType.selectedCategoryIds.map(
      (id: number) => this.categories.find(c => c.id === id)
    );

    const payload = {
      ...this.editingEventType,
      suggestedCategories: selectedCategories
    };

    this.eventTypeService.update(this.editingEventType.id, payload).subscribe(() => {
      this.editingEventType = null;
      this.loadEventTypes();
    });
  }

  cancelEdit(): void {
    this.editingEventType = null;
  }

  toggleActive(eventType: any): void {
    if (eventType.active) {
      this.eventTypeService.deactivate(eventType.id).subscribe(() => this.loadEventTypes());
    } else {
      this.eventTypeService.activate(eventType.id).subscribe(() => this.loadEventTypes());
    }
  }
}
