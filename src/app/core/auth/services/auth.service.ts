import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUserSignUp } from '../interfaces/auth-user-sign-up.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  signUp(requestBody: AuthUserSignUp) {
    return this.httpClient.post<{ feedBackMessage: string }>('/api/1.0/auth/signup', requestBody);
  }

  isEmailInUse(email: string) {
    return this.httpClient.post<{ emailInUse: boolean }>('/api/1.0/auth/ckeckEmailInUse', { email: email });
  }
}
