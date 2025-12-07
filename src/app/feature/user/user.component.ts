import { Component, signal } from '@angular/core';
import { UserService } from '../../api';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    this.loading.set(false);
    this.error.set(null);

    // TODO: Hardcoded userId until auth exists
    this.userService.getApiUsers1(1).subscribe({
      next: (res) => {
        this.user.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading user data');
        this.loading.set(false);
      },
    });
  }
}
