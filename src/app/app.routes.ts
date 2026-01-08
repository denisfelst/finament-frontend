import { Routes } from '@angular/router';
import { AppContainerComponent } from './core/layout/app-container.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { SettingsComponent } from './features/settings/settings.component';
import { AddExpenseComponent } from './features/expenses/add-expense/add-expense.component';
import { LoginComponent } from './features/login/login.component';
import { authGuard } from './core/auth/guard/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [authGuard],
    children: [
      { path: 'expenses', component: ExpensesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'add-expense', component: AddExpenseComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'login', component: LoginComponent },

      { path: '', redirectTo: 'add-expense', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
