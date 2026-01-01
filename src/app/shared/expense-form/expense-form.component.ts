import { Component, computed, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ICategory } from '../../feature/models/category.interface';
import { IExpenseFormData } from '../../feature/models/expense-form-data.interface';
import { IExpense } from '../../feature/models/expense.interface';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent {
  private formBuilder = inject(FormBuilder);

  categories = input.required<ICategory[]>();
  expense = input<IExpense | null>(null);
  submission = output<IExpenseFormData>();
  delete = output();

  form = computed(() => {
    return this.formBuilder.group({
      id: [this.expense()?.id ?? null],
      amount: [this.expense()?.amount ?? 0, Validators.required],
      category: [this.expense()?.categoryId ?? 0, Validators.required],
      date: [
        this.expense()?.date
          ? this.toDateInputValue(this.expense()!.date)
          : this.todayISO(),
        [Validators.required, this.dateInFutureValidator.bind(this)],
      ],
      tag: [this.expense()?.tag ?? ''],
    });
  });

  amount = computed(() => this.form().get('amount')?.value ?? 0);
  category = computed(() => this.form().get('category')?.value ?? 0);
  date = computed(() => this.form().get('date')?.value ?? '');
  tag = computed(() => this.form().get('tag')?.value ?? '');

  private todayISO(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toDateInputValue(iso: string): string {
    return iso.slice(0, 10);
  }

  private dateInFutureValidator(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const today = new Date().toISOString().slice(0, 10);
    return control.value > today ? { dateInFuture: true } : null;
  }

  onSubmit() {
    this.submission.emit({
      amount: this.amount(),
      category: this.category(),
      date: this.date(),
      tag: this.tag(),
    });
  }

  onDelete() {
    this.delete.emit();
  }
}
