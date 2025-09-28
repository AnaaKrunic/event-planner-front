import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { PurchaseService, CreatePurchaseDTO } from '../purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { EventTypeService } from '../event-type.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { BudgetService } from '../budget.service';
import { AuthService } from '../authservice.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from '../review/review.component';
import { ReviewService, CreateReviewDTO } from '../review.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  @Input() productHistoryId!: number;
  @Input() categoryId!: number;
  @Input() organizerId!: number;

  eventsWithBudget: any[] = [];
  selectedEventId?: number;
  productId!: number;

  constructor(
    private eventService: EventService,
    private purchaseService: PurchaseService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private eventTypeService: EventTypeService,
    private budgetService: BudgetService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('productId'));

    this.productService.getById(this.productId).pipe(
      switchMap(product => {
        this.categoryId = product.category.id;
        return this.eventService.getAll();
      }),
      switchMap((events: any[]) => {
        return this.eventTypeService.getAll().pipe(
          map((types: any[]) => ({ events, types }))
        );
      }),
      switchMap(({ events, types }) => {
        const eventsWithTypes = events.map(ev => {
          const foundType = types.find(t => t.name === ev.eventTypeName);
          if (foundType) {
            ev.eventType = foundType;
          }
          return ev;
        });

        const budgetObservables = eventsWithTypes.map(ev =>
          this.budgetService.getBudgetByEventId(ev.id).pipe(
            map(budget => ({ ev, budget })),
            catchError(() => of({ ev, budget: null }))
          )
        );

        return forkJoin(budgetObservables);
      }),
      map(results => {
        return results.filter(({ ev, budget }) => {
          const hasCategory = ev.eventType?.suggestedCategories?.some(
            (cat: any) => cat.id === this.categoryId
          );

          const hasBudget = budget?.items?.some(
            (item: any) => item.categoryId === this.categoryId
          );

          return hasCategory && !!hasBudget;
        }).map(r => r.ev);
      })
    ).subscribe(filteredEvents => {
      this.eventsWithBudget = filteredEvents;
    });
  }

  createPurchase() {
    if (!this.selectedEventId) return;
    const currentUser = this.authService.getCurrentUser();

    const dto: CreatePurchaseDTO = {
      productId: Number(this.productId),
      eventOrganizerId: Number(currentUser?.id),
      eventId: Number(this.selectedEventId)
    };

    this.purchaseService.createPurchase(dto).subscribe(res => {
      console.log('Purchase created', res);

      const dialogRef = this.dialog.open(ReviewComponent, {
        width: '400px',
        data: { solutionId: this.productId }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const reviewDto = {
            userId: Number(currentUser?.id),
            rating: result.rating,
            comment: result.comment,
            solutionId: this.productId
          };

          console.log('Review data', reviewDto);
          this.reviewService.createReview(reviewDto).subscribe(() => {
            alert('Thank you for your review!');
            this.router.navigate(['/all-products/']);
          });
        } else {
          this.router.navigate(['/all-products/']);
        }
      });
    });
  }
}
