import { Component, inject } from '@angular/core';
import { UserStore } from '../../shared/store/user.store';
import { AuthStore } from '../../shared/store/auth.store';
import { ButtonComponent } from '../../shared/elements/button/button.component';
import { ButtonTypeEnum } from '../../shared/models/button-type.enum';
import { ToastStateGroupComponent } from '../../shared/toast/toast-state-group/toast-state-group.component';

@Component({
  selector: 'app-profile',
  imports: [ButtonComponent, ToastStateGroupComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private userStore = inject(UserStore);
  private authStore = inject(AuthStore);

  currentUser = this.userStore.currentUser;
  loading = this.userStore.loading;
  error = this.userStore.error;

  ButtonType = ButtonTypeEnum;

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
