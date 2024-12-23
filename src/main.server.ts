import { bootstrapApplication, provideClientHydration ,withEventReplay} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Import withFetch
import { appConfig } from './app/app.config'; // Import your appConfig

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withFetch()),
      provideClientHydration(withEventReplay()), // Correct use of provideHttpClient with withFetch
      ...appConfig.providers, // Spread other providers from appConfig
    ],
  });

export default bootstrap;
