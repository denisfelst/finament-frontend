import { Component, computed, inject, signal } from '@angular/core';
import { CategoryService, ExpenseService, UpdateExpenseDto } from '../../api';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IExpense } from '../models/expense.interface';
import { ExpenseFormComponent } from '../../shared/expense-form/expense-form.component';
import { ICategory } from '../models/category.interface';
import { IExpenseFormData } from '../models/expense-form-data.interface';

@Component({
  selector: 'app-expenses',
  imports: [ModalComponent, ExpenseFormComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  expenses = signal<IExpense[]>([]);
  categories = signal<ICategory[]>([]);
  currentModal = signal<string | null>(null);
  currentExpense = signal<IExpense | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);
  saving = signal(false);
  saved = signal(false);

  orderedExpenses = computed(() => {
    // descending: newest first, based on date
    return [...this.expenses()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  ngOnInit() {
    this.loadExpenses();
    this.loadCategories(); // TODO: cache this so it only loads once; also has to load WHEN NEEDED: when user edits an expense.
  }

  private loadExpenses() {
    this.loading.set(true);
    this.error.set(null);

    // TODO: userId hardcoded until auth exists
    this.expenseService.getApiExpenses(1).subscribe({
      next: (res) => {
        console.log(res);
        this.expenses.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading expenses');
        this.loading.set(false);
      },
    });
  }

  private findExpense(id: number) {
    return this.expenses().find((expense) => expense.id === id) ?? null;
  }

  private loadCategories() {
    // TODO: loadCategories should exist in our service. create custom service
    this.categoryService.getApiCategories(1).subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: () => {
        this.error.set('Error loading categories');
        this.loading.set(false);
      },
    });
  }

  setModal(id: number | null) {
    if (id === null) {
      this.currentModal.set(null);
      this.currentExpense.set(null);
      return;
    }
    this.currentExpense.set(this.findExpense(id));
    this.currentModal.set('#' + String(id));
  }

  onSubmit(data: IExpenseFormData) {
    console.log(data);
    this.saving.set(true);
    this.error.set(null);

    const payload: UpdateExpenseDto = {
      amount: data.amount,
      categoryId: data.category,
      date: data.date,
      tag: data.tag,
    };

    this.expenseService
      .putApiExpenses(this.currentExpense()!.id, payload)
      .subscribe({
        // TODO: until auth
        next: () => {
          this.saving.set(false);
          this.saved.set(true);
          setTimeout(() => {
            this.saved.set(false);
          }, 3000);
        },
        error: (e) => {
          this.error.set('Failed saving expense');
          console.error(e);
          this.saving.set(false);
        },
      });
  }
}
