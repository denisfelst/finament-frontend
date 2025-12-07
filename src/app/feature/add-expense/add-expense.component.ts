import { Component, computed, inject, signal } from '@angular/core';
import { ExpenseService, CategoryService, CreateExpenseDto } from '../../api';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss',
})
export class AddExpenseComponent {
  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    amount: [0, Validators.required],
    category: [0, Validators.required],
    date: ['', Validators.required],
    tag: [''],
  });

  // UI state
  categories = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);
  saved = signal(false);

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading.set(true);
    this.categoryService.getApiCategories(1).subscribe({
      next: (res) => {
        this.categories.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading categories');
        this.loading.set(false);
      },
    });
  }

  amount = computed(() => this.form.get('amount')?.value ?? undefined);
  category = computed(() => this.form.get('category')?.value ?? undefined);
  date = computed(() => this.form.get('date')?.value ?? undefined);
  tag = computed(() => this.form.get('tag')?.value ?? undefined);

  submit() {
    this.saving.set(true);
    this.error.set(null);

    const payload: CreateExpenseDto = {
      amount: this.amount(),
      categoryId: this.category(),
      date: this.date(),
      tag: this.tag(),

      userId: 1, // TODO: until auth
    };

    this.expenseService.postApiExpenses(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => {
          this.saved.set(false);
        }, 3000);
      },
      error: () => {
        this.error.set('Failed saving expense');
        this.saving.set(false);
      },
    });
  }
}
