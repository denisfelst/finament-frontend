import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequestDto } from '../../core/swagger';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly TOKEN_KEY = 'finament_auth_token';

  private router = inject(Router);
  private api = inject(AuthService);

  token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  isAuthenticated = signal(!!this.token());

  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token.set(token);
    this.isAuthenticated.set(true);
  }

  login(data: LoginRequestDto) {
    if (!data) return;

    this.loading.set(true);
    this.error.set(null);

    this.api.postApiAuthLogin(data).subscribe({
      next: (res) => {
        this.setToken(res.token);
        this.loading.set(false);
        this.router.navigate(['/add-expense']);
      },
      error: (e) => {
        if (e.status === 400) {
          this.error.set('Invalid credentials. Please try again.');
        } else {
          this.error.set('Error: ' + e.message);
        }
        this.loading.set(false);
      },
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
