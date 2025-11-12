import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSolutionsComponent } from './favorite-solutions.component';

describe('FavoriteSolutionsComponent', () => {
  let component: FavoriteSolutionsComponent;
  let fixture: ComponentFixture<FavoriteSolutionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteSolutionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteSolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
