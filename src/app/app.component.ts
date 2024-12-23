import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageComponent } from './page/page.component';
import { ApiService } from './app.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,PageComponent],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private apiService: ApiService) {}

  
}

