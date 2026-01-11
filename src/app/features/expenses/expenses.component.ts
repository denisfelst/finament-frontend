import { Component, computed, inject, signal } from '@angular/core';
import { UpdateExpenseDto } from '../../core/swagger';
import { IExpense } from './models/expense.interface';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { IExpenseFormData } from './models/expense-form-data.interface';
import { ExpenseStore } from '../../shared/store/expense.store';
import { CategoryStore } from '../../shared/store/category.store';
import { FullFullModalComponent } from '../../shared/modal/full-modal/full-modal.component';
import { ConfirmationFullModalComponent } from '../../shared/modal/confirmation-modal/confirmation-modal.component';
import { RouterLink } from '@angular/router';
import { ToastStateGroupComponent } from '../../shared/toast/toast-state-group/toast-state-group.component';
import { CurrencyPipe } from '../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-expenses',
  imports: [
    FullFullModalComponent,
    ExpenseFormComponent,
    ConfirmationFullModalComponent,
    RouterLink,
    ToastStateGroupComponent,
    CurrencyPipe,
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
  confirmation = signal<boolean>(false);

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

  getCategoryName(categoryId: number): string {
    return (
      this.categories().find((c) => c.id === categoryId)?.name ?? 'Unknown'
    );
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

  handleDeletePress() {
    this.confirmation.set(true);
  }

  onDelete(confirmed: boolean) {
    if (!confirmed) {
      this.confirmation.set(false);
      return;
    }

    this.deleteExpense();
    this.confirmation.set(false);
  }
}
