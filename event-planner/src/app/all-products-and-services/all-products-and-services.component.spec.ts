import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProductsAndServicesComponent } from './all-products-and-services.component';

describe('AllProductsAndServicesComponent', () => {
  let component: AllProductsAndServicesComponent;
  let fixture: ComponentFixture<AllProductsAndServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProductsAndServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProductsAndServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
