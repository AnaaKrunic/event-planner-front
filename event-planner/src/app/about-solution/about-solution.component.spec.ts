import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSolutionComponent } from './about-solution.component';

describe('AboutSolutionComponent', () => {
  let component: AboutSolutionComponent;
  let fixture: ComponentFixture<AboutSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
