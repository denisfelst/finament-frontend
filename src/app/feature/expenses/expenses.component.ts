import { Component, computed, inject, signal } from '@angular/core';
import { CategoryService, ExpenseService, UpdateExpenseDto } from '../../api';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IExpense } from '../models/expense.interface';
import { ExpenseFormComponent } from '../../shared/expense-form/expense-form.component';
import { ICategory } from '../models/category.interface';
import { IExpenseFormData } from '../models/expense-form-data.interface';
import { ExpenseStore } from '../../store/expense.store';
import { CategoryStore } from '../../store/category.store';
import { ErrorComponent } from '../../shared/toast/error.component';

@Component({
  selector: 'app-expenses',
  imports: [ModalComponent, ExpenseFormComponent, ErrorComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  private expenseStore = inject(ExpenseStore);
  private categoryStore = inject(CategoryStore);

  currentExpense = signal<IExpense | null>(null);
  currentModal = signal<string | null>(null);

  expenses = this.expenseStore.expenses;
  categories = this.categoryStore.categories;
  loading = this.expenseStore.loading;
  error = this.expenseStore.error;
  message = this.expenseStore.message;

  orderedExpenses = computed(() => {
    // descending: newest first, based on date
    return [...this.expenses()].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  private updateExpense(data: IExpenseFormData) {
    const payload: UpdateExpenseDto = {
      amount: data.amount,
      categoryId: data.category,
      date: data.date,
      tag: data.tag,
    };

    this.expenseStore.update(this.currentExpense()!.id, payload);
  }

  private deleteExpense() {
    this.expenseStore.delete(this.currentExpense()!.id);
  }

  private findExpense(id: number) {
    return this.expenses().find((expense) => expense.id === id) ?? null;
  }

  private loadCategories() {
    this.loading.set(true);
    // TODO: loadCategories should exist in our service. create custom service
    this.categoryService.getApiCategories(1).subscribe({
      next: (res) => {
        this.categories.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load categories');
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
    this.updateExpense(data);
  }

  onDelete() {
    this.deleteExpense();
  }
}
