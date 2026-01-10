import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { OpenAPI } from './app/core/swagger';
import { environment } from './environments/environment';

OpenAPI.BASE = environment.baseUrl;

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
