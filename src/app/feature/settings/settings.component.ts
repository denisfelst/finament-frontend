import { Component, inject, signal } from '@angular/core';
import { SettingStore } from '../../store/setting.store';
import { ErrorComponent } from '../../shared/toast/error.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ErrorComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private settingStore = inject(SettingStore);

  settings = this.settingStore.settings;
  loading = this.settingStore.loading;
  error = this.settingStore.error;

  ngOnInit() {
    this.settingStore.load();
  }
}
