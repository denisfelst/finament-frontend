import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserStore } from '../../shared/store/user.store';
import { AuthStore } from '../../shared/store/auth.store';
import { ButtonComponent } from '../../shared/elements/button/button.component';
import { ButtonTypeEnum } from '../../shared/models/button-type.enum';
import { ToastStateGroupComponent } from '../../shared/toast/toast-state-group/toast-state-group.component';

@Component({
  selector: 'app-profile',
  imports: [ButtonComponent, ToastStateGroupComponent, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private userStore = inject(UserStore);
  private authStore = inject(AuthStore);

  currentUser = this.userStore.currentUser;
  loading = this.userStore.loading;
  error = this.userStore.error;
  message = this.userStore.message;

  ButtonType = ButtonTypeEnum;

  name = '';
  email = '';
  editMode = false;

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        this.name = user.name ?? '';
        this.email = user.email ?? '';
      }
    });
  }

  ngOnInit() {
    this.userStore.loadMe();
  }

  onEdit() {
    this.editMode = true;
  }

  onCancel() {
    this.editMode = false;
    const user = this.currentUser();
    if (user) {
      this.name = user.name ?? '';
      this.email = user.email ?? '';
    }
  }

  onSave() {
    this.userStore.updateMe({ name: this.name, email: this.email });
    this.editMode = false;
  }

  onLogout() {
    this.authStore.logout();
  }
}
