import { Component, inject } from '@angular/core';
import { UserStore } from '../../shared/store/user.store';
import { LoadingComponent } from '../../shared/toast/loading/loading.component';
import { ErrorComponent } from '../../shared/toast/error/error.component';
import { AuthStore } from '../../shared/store/auth.store';
import { ButtonComponent } from '../../shared/elements/button/button.component';
import { ButtonType } from '../../shared/models/button-type.enum';

@Component({
  selector: 'app-profile',
  imports: [LoadingComponent, ErrorComponent, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private userStore = inject(UserStore);
  private authStore = inject(AuthStore);

  currentUser = this.userStore.currentUser;
  loading = this.userStore.loading;
  error = this.userStore.error;

  ButtonType = ButtonType;

  private loadUser() {
    this.userStore.loadMe();
  }

  ngOnInit() {
    this.loadUser();
  }

  onLogout() {
    this.authStore.logout();
  }
}
