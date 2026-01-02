import { Component, inject, signal } from '@angular/core';
import { ExpenseService, CategoryService, CreateExpenseDto } from '../../api';
import { ExpenseFormComponent } from '../../shared/expense-form/expense-form.component';
import { ICategory } from '../models/category.interface';
import { IExpenseFormData } from '../models/expense-form-data.interface';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ExpenseFormComponent],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  categories = signal<ICategory[]>([]);

  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);
  saved = signal(false);

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getApiCategories(1).subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: () => {
        this.error.set('Failed to load categories');
        this.loading.set(false);
      },
    });
  }

  onSubmit(data: IExpenseFormData) {
    this.loading.set(true);
    this.error.set(null);

    const payload: CreateExpenseDto = {
      amount: data.amount,
      categoryId: data.category,
      date: data.date,
      tag: data.tag,

      userId: 1, // TODO: until auth
    };

    this.expenseService.postApiExpenses(payload).subscribe({
      next: () => {
        this.saved.set(true);
        this.loading.set(false);
        setTimeout(() => {
          this.saved.set(false);
        }, 3000);
      },
      error: () => {
        this.error.set('Failed to save expense');
        this.loading.set(false);
        this.saving.set(false);
      },
    });
  }
}
