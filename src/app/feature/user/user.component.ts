import { Component, inject, signal } from '@angular/core';
import { UserStore } from '../../store/user.store';
import { ErrorComponent } from '../../shared/toast/error/error.component';
import { LoadingComponent } from '../../shared/toast/loading/loading.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ErrorComponent, LoadingComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private userStore = inject(UserStore);

  currentUser = this.userStore.currentUser;
  loading = this.userStore.loading;
  error = this.userStore.error;

  private loadUser() {
    this.userStore.loadUser(1); // TODO: until auth is done
  }

  ngOnInit() {
    this.loadUser();
  }
}
