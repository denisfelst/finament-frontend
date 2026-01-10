import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { OpenAPI } from './app/core/swagger';

OpenAPI.BASE = process.env['BASE_URL'] ?? 'https://localhost:7001';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
