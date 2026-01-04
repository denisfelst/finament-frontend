import { effect, inject, Injectable, signal } from '@angular/core';
import { UserService } from '../api';
import { CreateUserDto, UpdateUserDto } from '../api';
import { IUser } from '../feature/models/user.interface';

@Injectable({ providedIn: 'root' })
export class UserStore {
  // state
  users = signal<IUser[]>([]);
  currentUser = signal<IUser | null>(null);

  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

  private api = inject(UserService);

  constructor() {
    effect(() => {
      if (this.message()) {
        setTimeout(() => this.message.set(null), 3000);
      }
      if (this.error()) {
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }

  // ---- queries ----

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getApiUsers().subscribe({
      next: (res) => {
        this.users.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading users');
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  loadUser(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.api.getApiUsers1(id).subscribe({
      next: (res) => {
        this.currentUser.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading user');
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  // TODO: use after auth for user.component ngOnInit
  loadCurrentUser() {
    this.loading.set(true);
    this.error.set(null);

    const id = this.currentUser()?.id;

    if (id) {
      this.api.getApiUsers1(id).subscribe({
        next: (res) => {
          this.currentUser.set(res);
          this.loading.set(false);
        },
        error: (e) => {
          this.error.set('Error loading user');
          console.error('Error:', e);
          this.loading.set(false);
        },
      });
    } else {
      this.error.set('Currently no existent signed in user.');
      console.error('Error: no currentUser');
      this.loading.set(false);
    }
  }

  // ---- mutations ----

  create(dto: CreateUserDto) {
    this.loading.set(true);
    this.error.set(null);

    this.api.postApiUsers(dto).subscribe({
      next: (res) => {
        this.message.set('User created successfully');
        this.loadUsers();
        this.currentUser.set(res);
      },
      error: (e) => {
        this.error.set('Failed creating user');
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  update(id: number, dto: UpdateUserDto) {
    this.loading.set(true);
    this.error.set(null);

    this.api.putApiUsers(id, dto).subscribe({
      next: () => {
        this.message.set('User updated successfully');
        this.loadUser(id);
      },
      error: (e) => {
        this.error.set('Failed to update user');
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  delete(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.api.deleteApiUsers(id).subscribe({
      next: () => {
        this.message.set('User deleted successfully');
        this.loadUsers();
        if (this.currentUser()?.id === id) {
          this.currentUser.set(null);
        }
      },
      error: (e) => {
        this.error.set('Failed to delete user');
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  // ---- auth-ready helpers ----

  setCurrentUser(user: IUser) {
    this.currentUser.set(user);
  }

  clearCurrentUser() {
    this.currentUser.set(null);
  }
}
