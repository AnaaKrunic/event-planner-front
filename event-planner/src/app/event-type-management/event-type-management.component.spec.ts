import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeManagementComponent } from './event-type-management.component';

describe('EventTypeManagementComponent', () => {
  let component: EventTypeManagementComponent;
  let fixture: ComponentFixture<EventTypeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
