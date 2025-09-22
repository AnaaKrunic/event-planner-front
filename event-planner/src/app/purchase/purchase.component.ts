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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('productId'));

    // 1️⃣ Učitaj proizvod i izvuci categoryId
    this.productService.getById(this.productId).pipe(
      switchMap(product => {
        this.categoryId = product.category.id;
        console.log('📌 Učitana kategorija iz proizvoda:', this.categoryId);

        // 2️⃣ Učitaj sve evente
        return this.eventService.getAll();
      }),
      switchMap((events: any[]) => {
        console.log('📌 Svi eventovi:', events);

        // 3️⃣ Učitaj sve event tipove
        return this.eventTypeService.getAll().pipe(
          map((types: any[]) => ({ events, types }))
        );
      }),
      switchMap(({ events, types }) => {
        // Za svaki event nađi njegov tip
        const eventsWithTypes = events.map(ev => {
          const foundType = types.find(t => t.name === ev.eventTypeName);
          if (foundType) {
            ev.eventType = foundType;
          }
          return ev;
        });

        // 4️⃣ Za svaki event pozovi BudgetService, hvataj greške
        const budgetObservables = eventsWithTypes.map(ev =>
          this.budgetService.getBudgetByEventId(ev.id).pipe(
            map(budget => ({ ev, budget })),
            catchError(() => of({ ev, budget: null })) // Ako nema budžet, vrati null
          )
        );

        // forkJoin čeka sve pozive
        return forkJoin(budgetObservables);
      }),
      map(results => {
        // 5️⃣ Filtriraj evente po kategoriji i prisustvu budžeta
        return results.filter(({ ev, budget }) => {
          const hasCategory = ev.eventType?.suggestedCategories?.some(
            (cat: any) => cat.id === this.categoryId
          );

          const hasBudget = budget?.items?.some(
            (item: any) => item.categoryId === this.categoryId
          );

          return hasCategory && !!hasBudget; // samo ako postoji budžet
        }).map(r => r.ev);
      })
    ).subscribe(filteredEvents => {
      this.eventsWithBudget = filteredEvents;
      console.log('✅ Eventovi sa traženom kategorijom i budžetom:', this.eventsWithBudget);
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
    console.log(dto);
    this.purchaseService.createPurchase(dto).subscribe(res => {
      console.log('Purchase created', res);
      alert('Purchase successfully created!');
      this.router.navigate(['/all-products/']);
    });
  }
}
