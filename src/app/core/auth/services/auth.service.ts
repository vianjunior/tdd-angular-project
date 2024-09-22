import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  signUp(body: { username: string; email: string; password: string }) {
    return this.httpClient.post('/api/1.0/users', body);
  }

  isEmailInUse(email: string) {
    return this.httpClient.post('/api/1.0/user/email', { email: email });
  }
}
