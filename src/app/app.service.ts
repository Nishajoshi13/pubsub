import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // No need to declare in a module
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/publish'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const body = { message }; // Prepare the request body
    return this.http.post(this.apiUrl, body); // Send POST request
  }
}
