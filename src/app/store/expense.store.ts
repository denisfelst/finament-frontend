import { effect, inject, Injectable, signal } from '@angular/core';
import { ExpenseService } from '../api';
import { CreateExpenseDto, UpdateExpenseDto } from '../api';
import { IExpense } from '../feature/models/expense.interface';

@Injectable({ providedIn: 'root' })
export class ExpenseStore {
  private api = inject(ExpenseService);

  private readonly userId = 1; // TODO: remove when auth exists

  // state
  expenses = signal<IExpense[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.message()) {
        setTimeout(() => this.message.set(null), 3000);
      }
      if (this.error()) {
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }

  // ---- queries ----

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getApiExpenses(this.userId).subscribe({
      next: (res) => {
        this.expenses.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading expenses');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }

  // ---- mutations ----

  create(dto: CreateExpenseDto) {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .postApiExpenses({
        ...dto,
        userId: this.userId,
      })
      .subscribe({
        next: () => {
          this.message.set('Expense created successfully');
          this.load();
        },
        error: (e) => {
          this.error.set('Failed to create expense');
          console.error('Error: ', e);
          this.loading.set(false);
        },
      });
  }

  update(id: number, dto: UpdateExpenseDto) {
    this.loading.set(true);
    this.error.set(null);

    this.api.putApiExpenses(id, dto).subscribe({
      next: () => {
        this.message.set('Expense updated successfully');
        this.load();
      },
      error: (e) => {
        this.error.set('Failed to update expense');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }

  delete(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.api.deleteApiExpenses(id).subscribe({
      next: () => {
        this.message.set('Expense deleted successfully');
        this.load();
      },
      error: (e) => {
        this.error.set('Failed to delete expense');
        console.error('Error: ', e);
        this.loading.set(false);
      },
    });
  }
}
