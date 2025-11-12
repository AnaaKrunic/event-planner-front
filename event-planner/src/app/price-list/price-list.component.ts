import { Component, OnInit } from '@angular/core';
import { PriceListService } from '../price-list.service';
import { AuthService } from '../authservice.service';
import { take } from 'rxjs/operators';
import { ServiceService, Service } from '../service.service';
import { ProductService } from '../product.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {

  solutions: any[] = [];
  userId!: string;

  editing = false;
  editingSolution: any | null = null;
  editModel = { price: 0, discount: 0 };
  saving = false;
  errorMessage = '';

  constructor(
    private priceListService: PriceListService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    this.userId = currentUser.id;
    this.loadPriceList();
  }

  loadPriceList(): void {
    this.priceListService.getProviderSolutions(Number(this.userId))
      .pipe(take(1))
      .subscribe({
        next: (data: any[]) => {
          const uniqueSolutions = Array.from(new Map(data.map((s: any) => [s.id, s])).values());
          this.solutions = uniqueSolutions;
        },
        error: (err) => console.error(err)
      });
  }

  calcDiscountedPrice(solution: Service): number {
    return solution.price * (1 - solution.discount / 100);
  }

  openEditModal(solution: Service) {
    this.editingSolution = { ...solution };
    this.editModel.price = this.editingSolution.price;
    this.editModel.discount = this.editingSolution.discount;
    this.errorMessage = '';
    this.editing = true;
  }

  closeEditModal() {
    if (this.saving) return;
    this.editing = false;
    this.editingSolution = null;
    this.errorMessage = '';
  }

  submitEdit() {
    if (!this.editingSolution) return;
    const newPrice = Number(this.editModel.price);
    const newDiscount = Number(this.editModel.discount);

    if (
      isNaN(newPrice) || newPrice < 0 ||
      isNaN(newDiscount) || newDiscount < 0 || newDiscount > 100
    ) {
      this.errorMessage = 'Invalid values';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    if (!this.editingSolution.id) {return; }
    console.log('Editing solution ID:', this.editingSolution);

    if (!this.editingSolution.cancelationDue) {
      this.productService.updatePriceAndDiscount(this.editingSolution.id, newPrice, newDiscount)
        .pipe(take(1))
        .subscribe({
          next: (updated: any) => {
            this.solutions = this.solutions.map(s => s.id === updated.id ? updated : s);
            this.saving = false;
            this.closeEditModal();
          },
          error: (err) => {
            console.error('Failed to update price', err);
            this.errorMessage = 'Failed to save changes. Try again.';
            this.saving = false;
          }
        });
    } else {
      this.serviceService.updatePriceAndDiscount(this.editingSolution.id, newPrice, newDiscount)
        .pipe(take(1))
        .subscribe({
          next: (updated: Service) => {
            this.solutions = this.solutions.map(s => s.id === updated.id ? updated : s);
            this.saving = false;
            this.closeEditModal();
          },
          error: (err) => {
            console.error('Failed to update price', err);
            this.errorMessage = 'Failed to save changes. Try again.';
            this.saving = false;
          }
        });
      }
    }

  generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Price List - Provider: ' + (this.solutions[0]?.provider?.name || 'Provider'), 14, 22);
    const tableData = this.solutions.map((s, index) => [
      index + 1,
      s.name,
      s.provider?.name || 'N/A',
      s.price.toFixed(2),
      s.discount + '%',
      (s.price * (1 - s.discount / 100)).toFixed(2)
    ]);
    const tableColumns = ['#', 'Name', 'Provider', 'Price', 'Discount', 'Discounted Price'];
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 }
    });
    doc.save('price-list.pdf');    
  }
}
