import { Component, signal } from '@angular/core';
import { ExpenseService } from '../../api';
import { ModalComponent } from '../../shared/modal/modal.component';

interface IExpense {
  id: number;
  categoryId?: number;
  amount?: number;
  date?: string;
  tag?: string | null;
}

@Component({
  selector: 'app-expenses',
  imports: [ModalComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  expenses = signal<IExpense[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentModal = signal<string | null>(null);

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
        console.log(res);
        this.expenses.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading expenses');
        this.loading.set(false);
      },
    });
  }

  setModal(id: number | null) {
    if (id === null) {
      this.currentModal.set(null);
      return;
    }
    this.currentModal.set('#' + String(id));
  }
}
