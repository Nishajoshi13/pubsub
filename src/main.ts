import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PageComponent } from './app/page/page.component'; // Ensure this is the correct path

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([
      { path: '', component: AppComponent },
      { path: 'page', component: PageComponent },
    ]),
  ],
}).catch(err => console.error(err));

