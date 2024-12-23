import { bootstrapApplication } from '@angular/platform-browser';


import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { appConfig } from './app.config';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(), // Add HttpClient provider
      ...appConfig.providers, // Spread other providers from appConfig
    ],
  });

export default bootstrap;
