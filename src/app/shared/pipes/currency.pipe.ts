import { inject, Pipe, PipeTransform } from '@angular/core';
import { SettingStore } from '../store/setting.store';

@Pipe({
  name: 'appCurrency',
  standalone: true,
  pure: false,
})
export class CurrencyPipe implements PipeTransform {
  constructor(public settingStore: SettingStore) {
    settingStore.load();
  }

  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    const currency = this.settingStore.settings()?.currency ?? 'EUR';

    if (value === '') {
      return currency;
    }

    const intValue = Number(value);
    return new Intl.NumberFormat(navigator.language ?? 'en-US', {
      style: 'currency',
      currency: currency,
    }).format(intValue);
  }
}
