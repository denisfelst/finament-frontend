import { Routes } from '@angular/router';
import { AppContainerComponent } from './core/layout/app-container.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { CategoriesComponent } from './feature/categories/categories.component';
import { ExpensesComponent } from './feature/expenses/expenses.component';

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppContainerComponent,

    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'categories', component: CategoriesComponent },
      // { path: 'settings', component: SettingsComponent },
      // { path: 'add-expense', component: AddExpenseComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
