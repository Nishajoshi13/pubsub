import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PubSubService } from '../pubsub.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  message = '';
  messages: string[] = [];

  constructor(private pubSubService: PubSubService) {}

  private backendUrl = 'http://localhost:3000'; // Set the correct backend URL

  publish() {
    if (!this.message.trim()) {
      console.error('Message cannot be empty.');
      return;
    }

    this.pubSubService.publishMessage(this.message).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
      },
      error: (error) => {
        console.error('Error sending message:', error);
      },
    });
  }

  pull() {
    this.pubSubService.pullMessages().subscribe({
      next: (response) => {
        this.messages = response.messages || [];
        console.log('Pulled messages:', this.messages);
      },
      error: (err) => console.error('Error pulling messages:', err),
    });
  }
}
