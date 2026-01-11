import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingStore } from '../../shared/store/setting.store';
import { ToastStateGroupComponent } from '../../shared/toast/toast-state-group/toast-state-group.component';
import { CurrencyEnum } from './models/currency.enum';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ToastStateGroupComponent, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private settingStore = inject(SettingStore);

  settings = this.settingStore.settings;
  loading = this.settingStore.loading;
  error = this.settingStore.error;

  currencies = Object.values(CurrencyEnum);

  ngOnInit() {
    this.settingStore.load();
  }

  onCurrencyChange(currency: string) {
    this.settingStore.upsert({ currency });
  }
}
