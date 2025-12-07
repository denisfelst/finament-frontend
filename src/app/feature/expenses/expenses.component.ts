import { Component, signal } from '@angular/core';
import { ExpenseService } from '../../api';

@Component({
  selector: 'app-expenses',
  imports: [],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  expenses = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private expenseService: ExpenseService) {}

  ngOnInit() {
    this.loadExpenses();
  }

  private loadExpenses() {
    this.loading.set(true);
    this.error.set(null);

    // TODO: userId hardcoded until auth exists
    this.expenseService.getApiExpenses(1).subscribe({
      next: (res) => {
        this.expenses.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading expenses');
        this.loading.set(false);
      },
    });
  }
}
