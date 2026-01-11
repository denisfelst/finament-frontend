import { Component, inject } from '@angular/core';
import { CreateExpenseDto } from '../../../core/swagger';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { IExpenseFormData } from '../models/expense-form-data.interface';
import { ExpenseStore } from '../../../shared/store/expense.store';
import { CategoryStore } from '../../../shared/store/category.store';
import { ToastStateGroupComponent } from '../../../shared/toast/toast-state-group/toast-state-group.component';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ExpenseFormComponent, ToastStateGroupComponent],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent {
  private expenseStore = inject(ExpenseStore);
  private categoryStore = inject(CategoryStore);

  categories = this.categoryStore.categories;
  loading = this.expenseStore.loading;
  error = this.expenseStore.error;
  message = this.expenseStore.message;

  private loadCategories() {
    this.categoryStore.load();
  }

  ngOnInit() {
    this.loadCategories();
  }

  onSubmit(data: IExpenseFormData) {
    const payload: CreateExpenseDto = {
      amount: data.amount,
      categoryId: data.category,
      date: data.date,
      tag: data.tag,
    };

    this.expenseStore.create(payload);
  }
}
