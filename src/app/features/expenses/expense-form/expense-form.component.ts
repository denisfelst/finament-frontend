import { Component, computed, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ICategory } from '../../features/categories/models/category.interface';
import { IExpenseFormData } from '../../features/expenses/models/expense-form-data.interface';
import { IExpense } from '../../features/expenses/models/expense.interface';

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
      amount: [
        this.expense()?.amount ?? 1,
        [
          Validators.required,
          this.amountValidator.bind(this),
          Validators.min(1),
        ],
      ],
      category: [this.expense()?.categoryId ?? 0, Validators.required],
      date: [
        this.expense()?.date
          ? this.toDateInputValue(this.expense()!.date)
          : this.todayISO(),
        [Validators.required, this.dateInFutureValidator.bind(this)],
      ],
      tag: [this.expense()?.tag ?? null],
    });
  });

  amount = computed<number>(() => this.form().get('amount')?.value ?? 0);
  category = computed<number>(() => this.form().get('category')?.value ?? 0);
  date = computed<string>(() => this.form().get('date')?.value ?? '');
  tag = computed<string | null>(() => this.form().get('tag')?.value ?? null);

  private amountValidator(control: FormControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const value = Number(control.value);

    if (!Number.isInteger(value)) {
      return { notInteger: true };
    }

    return null;
  }

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

  roundAmount() {
    const control = this.form().controls.amount;
    const value = control.value;

    if (value === null || value === undefined || Number.isNaN(value)) {
      return;
    }

    const rounded = Math.round(value); // .5+ up, otherwise down

    // enforce min 1
    const finalValue = Math.max(1, rounded);

    if (finalValue !== value) {
      control.setValue(finalValue);
    }
  }

  toCamelCaseTag(): void {
    const control = this.form().controls.tag;
    let value: string = control.value ?? '';

    if (!value.trim()) {
      control.setValue('');
      return;
    }

    // 1. Remove any leading #
    value = value.replace(/^#+/, '');

    // 2. Normalize spaces and casing
    const words = value
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase());

    // 3. Convert to camelCase
    const camel =
      words[0] +
      words
        .slice(1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('');

    // 4. Add # prefix
    control.setValue(`#${camel}`);
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
