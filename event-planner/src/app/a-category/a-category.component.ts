import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { AuthService } from '../authservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-a-category',
  templateUrl: './a-category.component.html',
  styleUrls: ['./a-category.component.css']
})
export class ACategoryComponent implements OnInit {
  categories: any[] = [];
  suggestions: any[] = [];

  newCategory = { name: '', description: '', isApprovedByAdmin: true };

  editingCategory: any = null;
  showAddForm = false;

  userRole: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || null;
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data.filter((c: any) => c.approvedByAdmin);
      this.suggestions = data.filter((c: any) => !c.approvedByAdmin);
    });
  }

  addCategory(): void {
    this.categoryService
      .create(this.newCategory).subscribe(() => {
        this.newCategory = { name: '', description: '', isApprovedByAdmin: true };
        this.showAddForm = false;
        this.loadCategories();
    });
  }

  startEditing(category: any): void {
    this.editingCategory = { ...category };
  }

  saveEdit(): void {
    this.categoryService.update(this.editingCategory.id, this.editingCategory)
      .subscribe(() => {
        this.editingCategory = null;
        this.loadCategories();
      });
  }

  saveSuggestionEdit(): void {
    const payload = { ...this.editingCategory, isApprovedByAdmin: true };
    this.categoryService.update(this.editingCategory.id, payload)
      .subscribe(() => {
        this.editingCategory = null;
        this.loadCategories();
      });
  }

  cancelEdit(): void {
    this.editingCategory = null;
  }

  deleteCategory(id: number): void {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.loadCategories();
        this.snackBar.open("Category successfully deleted", undefined, { duration: 3000 });
      },
      error: () => {
        this.snackBar.open("Unable to delete category as it is linked to other data", undefined, { duration: 5000 });
      }
    });
  }

  approveSuggestion(suggestion: any): void {
    const payload = { ...suggestion, isApprovedByAdmin: true };
    this.categoryService.update(suggestion.id, payload).subscribe(() => {
      this.loadCategories();
    });
  }
}
