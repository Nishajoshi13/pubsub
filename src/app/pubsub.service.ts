import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubSubService {
  private backendUrl = 'http://localhost:3000'; // Backend server ka URL.

  constructor(private http: HttpClient) {}
  publishMessage(message: string): Observable<any> {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }
  
    const payload = { message };
    return this.http.post(`${this.backendUrl}/publish`, payload);
  }
  

  pullMessages(): Observable<any> {
    return this.http.get(`${this.backendUrl}/pull`,);
  }
  // private publishUrl = 'https://us-central1-my-kubernetes-project-444304.cloudfunctions.net/publishMessage';
  // private pullUrl = 'https://us-central1-my-kubernetes-project-444304.cloudfunctions.net/publishMessage/pull';

  // constructor(private http: HttpClient) {}

  // publishMessage(message: string): Observable<any> {
  //   return this.http.post(this.publishUrl, { message });
  // }

  // pullMessages(): Observable<any> {
  //   return this.http.get(this.pullUrl);
  // }
}
