import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ICategory } from '../../categories/models/category.interface';
import { IExpense } from '../models/expense.interface';
import { IExpenseFormData } from '../models/expense-form-data.interface';
import { ButtonComponent } from '../../../shared/elements/button/button.component';
import { ButtonType } from '../../../shared/models/button-type.enum';
import { CurrencyPipe } from '../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-expense-form',
  imports: [ReactiveFormsModule, ButtonComponent, CurrencyPipe],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent {
  private formBuilder = inject(FormBuilder);

  categories = input.required<ICategory[]>();
  expense = input<IExpense | null>(null);
  submission = output<IExpenseFormData>();
  delete = output();

  form = this.formBuilder.group({
    id: [null as number | null],
    amount: [
      1 as number | null,
      [Validators.required, this.amountValidator.bind(this), Validators.min(1)],
    ],
    category: [0 as number | null, Validators.required],
    date: [
      this.todayISO() as string | null,
      [Validators.required, this.dateInFutureValidator.bind(this)],
    ],
    tag: [null as string | null],
  });

  ButtonType = ButtonType;

  constructor() {
    effect(() => {
      const expense = this.expense();
      this.form.patchValue({
        id: expense?.id ?? null,
        amount: expense?.amount ?? 1,
        category: expense?.categoryId ?? 0,
        date: expense?.date
          ? this.toDateInputValue(expense.date)
          : this.todayISO(),
        tag: expense?.tag ?? null,
      });
    });
  }

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
    const control = this.form.controls.amount;
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
    const control = this.form.controls.tag;
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
      amount: this.form.value.amount ?? 1,
      category: this.form.value.category ?? 0,
      date: this.form.value.date ?? this.todayISO(),
      tag: this.form.value.tag ?? null,
    });
  }

  onDelete() {
    this.delete.emit();
  }
}
