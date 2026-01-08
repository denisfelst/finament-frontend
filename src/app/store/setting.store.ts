import { effect, inject, Injectable, signal } from '@angular/core';
import { SettingService } from '../api';
import { UpsertSettingDto } from '../api';
import { ISetting } from '../components/models/setting.interface';

@Injectable({ providedIn: 'root' })
export class SettingStore {
  private api = inject(SettingService);

  // state
  settings = signal<ISetting | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  message = signal<string | null>(null);

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

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getApiSettings().subscribe({
      next: (res) => {
        this.settings.set(res);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set('Error loading settings: ' + e.body.message);
        console.error('Error:', e);
        this.loading.set(false);
      },
    });
  }

  // ---- mutations ----

  upsert(dto: UpsertSettingDto) {
    this.loading.set(true);
    this.error.set(null);

    this.api
      .putApiSettings({
        ...dto,
      })
      .subscribe({
        next: () => {
          this.message.set('Settings saved successfully');
          this.load();
        },
        error: (e) => {
          this.error.set('Failed saving settings: ' + e.body.message);
          console.error('Error:', e);
          this.loading.set(false);
        },
      });
  }
}
