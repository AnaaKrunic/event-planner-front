import { Component, OnInit } from '@angular/core';
import { EventTypeService } from '../event-type.service';

@Component({
  selector: 'app-event-type-management',
  templateUrl: './event-type-management.component.html',
  styleUrls: ['./event-type-management.component.css']
})
export class EventTypeManagementComponent implements OnInit {
  eventTypes: any[] = [];
  newEventType = { name: '', description: '', suggestedCategories: '' };
  editingEventType: any = null;

  constructor(private eventTypeService: EventTypeService) {}

  showAddForm: boolean = false;

  ngOnInit(): void {
    this.loadEventTypes();
  }

  loadEventTypes(): void {
    this.eventTypeService.getAll().subscribe(data => {
      this.eventTypes = data;
    });
  }

  addEventType(): void {
    const payload = {
      name: this.newEventType.name,
      description: this.newEventType.description,
      suggestedCategories: this.newEventType.suggestedCategories
        ? this.newEventType.suggestedCategories.split(',')
            .map((id: string) => Number(id.trim()))
        : []
    };

    this.eventTypeService.create(payload).subscribe(() => {
      this.newEventType = { name: '', description: '', suggestedCategories: '' };
      this.loadEventTypes();
    });
  }

  startEditing(eventType: any): void {
    this.editingEventType = { 
      ...eventType, 
      suggestedCategories: (eventType.suggestedCategories || []).join(", ") 
    };
  }

  saveEdit(): void {
    const payload = {
      ...this.editingEventType,
      suggestedCategories: this.editingEventType.suggestedCategories
        ? this.editingEventType.suggestedCategories.split(',')
            .map((id: string) => Number(id.trim()))
        : []
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
