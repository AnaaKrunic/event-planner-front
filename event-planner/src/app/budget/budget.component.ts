import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetService, BudgetPlanDTO, BudgetItemDTO } from '../budget.service';
import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { EventTypeService } from '../event-type.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  constructor(
    private budgetService: BudgetService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private eventTypeService: EventTypeService
  ) {}

  @Input() eventId!: number;
  @Input() suggestedCategories: { id: number; name: string }[] = [];

  newEventNewBudget?: number;

  budget: any | null = null;
  budgetData: BudgetPlanDTO = { eventId: 0, items: [], total: 0 };
  event :any;

  ngOnInit() {
    if (this.eventId) {
      this.newEventNewBudget = this.eventId;
    }

    this.route.paramMap.subscribe(params => {
      this.eventId = Number(params.get('eventId'));
      this.budgetData.eventId = this.eventId;
      this.eventService.getById(this.eventId).subscribe({
        next: (event) => {
          this.event = event;
          this.eventTypeService.getAll().subscribe({
            next: (types) => {
              const selectedType = types.find(t => t.name === this.event.eventTypeName);
              this.suggestedCategories = selectedType ? selectedType.suggestedCategories : [];
            },
            error: (err) => console.error('Greška pri dobavljanju tipova događaja', err)
          });
        },
        error: (err) => {
          console.error('Greška pri učitavanju eventa', err);
        }
      });
      this.budgetService.getBudgetByEventId(this.eventId).subscribe({
        next: (res) => {
          this.budget = res;
          this.budgetData = {
            eventId: this.eventId,
            items: res.items ?? [],
            total: 0
          };
          this.updateTotalBudget();
        },
        error: () => {
          this.budget = null;
          this.budgetData = { eventId: this.eventId, items: [], total: 0 };
        }
      });
    });
  }

  removeBudgetItem(index: number) {
    const item = this.budgetData.items[index];
    if (item.reservationId || item.purchaseId) {
      alert("This budget item cannot be removed because it has reservations or purchases.");
      return;
    }
    this.budgetData.items.splice(index, 1);
    this.updateTotalBudget();
  }

  confirmBudget() {
    const validItems = this.budgetData.items
      .filter(item => item.categoryId != null && item.amount != null && item.amount >= 0);
    if (this.budget && this.budget.id) {
      const payloadUpdated = {
        id: this.budget.id,
        itemsDTO: validItems.map(item => ({
          categoryId: item.categoryId,
          amount: item.amount,
          purchaseId: item.purchaseId ?? null,
          reservationId: item.reservationId ?? null,
          budgetPlanId: this.budget.id
        }))
      };
      this.budgetService.updateBudgetPlan(this.budget.id, payloadUpdated).subscribe({
        next: (res) => this.router.navigate(['/event/' + this.event.id]),
        error: (err) => console.error("Error updating budget:", err)
      });
    } else {
      console.log(this.newEventNewBudget)
      console.log(this.eventId)
      const payloadCreate = {
        eventId: this.newEventNewBudget ?? this.eventId,
        itemsDTO: validItems.map(item => ({
          categoryId: item.categoryId,
          amount: item.amount,
          purchaseId: item.purchaseId ?? null,
          reservationId: item.reservationId ?? null
        }))
      };
      console.log(payloadCreate)
      this.budgetService.createBudgetPlan(payloadCreate).subscribe({
        next: (res) => this.router.navigate(['/all-events']),
        error: (err) => console.error("Error creating budget:", err)
      });
    }
  }

  resetBudget() {
    this.budget = null;
    this.budgetData.items = [];
    this.budgetData.total = 0;
  }

  addBudgetItem() {
    if (this.budgetData.items.length < this.suggestedCategories.length) {
      this.budgetData.items.push({ categoryId: null, amount: 0 });
    }
  }

  removeIfZero(index: number) {
    if (this.budgetData.items[index].amount === 0) {
      this.budgetData.items[index].amount = null;
    }
  }

  updateTotalBudget() {
    if (!this.budgetData || !this.budgetData.items) {
      this.budgetData.total = 0;
      return;
    }
    this.budgetData.total = this.budgetData.items
      .filter(item => item.categoryId != null && item.amount != null)
      .reduce((sum, item) => sum + (item.amount || 0), 0);
  }

  getAvailableCategories(currentItem: BudgetItemDTO) {
    if (!this.suggestedCategories) return [];
    const selectedIds = this.budgetData.items
      .filter(item => item !== currentItem)
      .map(item => item.categoryId)
      .filter(id => id != null)
      .map(id => Number(id));
    return this.suggestedCategories.filter(
      cat => cat.id === currentItem.categoryId || !selectedIds.includes(cat.id)
    );
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
