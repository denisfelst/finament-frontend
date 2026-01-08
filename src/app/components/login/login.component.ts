import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginRequestDto } from '../../api';
import { AuthStore } from '../../store/auth.store';
import { Router } from '@angular/router';
import { ErrorComponent } from '../../shared/toast/error/error.component';
import { LoadingComponent } from '../../shared/toast/loading/loading.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ErrorComponent, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authStore = inject(AuthStore);

  loading = signal(false);
  error = this.authStore.error;
  isLogged = this.authStore.isAuthenticated;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (!this.form.valid) {
      this.error.set('Please fill out the fields correctly');
      return;
    }

    const loginData = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    } as LoginRequestDto;

    this.authStore.login(loginData);
  }

  onLogout() {
    this.authStore.logout();
  }
}
