import { Component, signal } from '@angular/core';
import { SettingService } from '../../api';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  settings = signal<any | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private settingsService: SettingService) {}

  ngOnInit() {
    this.loadSettings();
  }

  private loadSettings() {
    this.loading.set(true);
    this.error.set(null);

    this.settingsService.getApiSettings(1).subscribe({
      // TODO: hardcoded until auth
      next: (res) => {
        this.settings.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error loading settings');
        this.loading.set(false);
      },
    });
  }
}
