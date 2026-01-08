import { Component, computed, inject, signal } from '@angular/core';
import {
  CategoryService,
  ExpenseService,
  UpdateExpenseDto,
} from '../../core/swagger';
import { ModalComponent } from '../../shared/modal/modal.component';
import { IExpense } from './models/expense.interface';
import { ExpenseFormComponent } from '../../shared/expense-form/expense-form.component';
import { ICategory } from '../categories/models/category.interface';
import { IExpenseFormData } from './models/expense-form-data.interface';
import { ExpenseStore } from '../../shared/store/expense.store';
import { CategoryStore } from '../../shared/store/category.store';
import { ErrorComponent } from '../../shared/toast/error/error.component';
import { LoadingComponent } from '../../shared/toast/loading/loading.component';

@Component({
  selector: 'app-expenses',
  imports: [
    ModalComponent,
    ExpenseFormComponent,
    ErrorComponent,
    LoadingComponent,
  ],
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

  ngOnInit() {
    this.categoryStore.load();
    this.expenseStore.load();
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
