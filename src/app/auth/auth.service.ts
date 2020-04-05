import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import {_throw} from 'rxjs/observable/throw';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData{
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<User>(null)

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBIxPyCMKgzsJ9BEoK8zWDnHXTJsOiMrYE', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBIxPyCMKgzsJ9BEoK8zWDnHXTJsOiMrYE', {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res)
    }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth'])
  }

  private handleAuthentication(res: any) {
    const expirationDate = new Date(new Date().getTime() + res.expiresIn * 1000);
    console.log('handleAuthentication', res.email, res.localId, res.idToken, expirationDate)
    const user = new User(res.email, res.localId, res.idToken, expirationDate);
    this.user.next(user);
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    let errorMessage = "An unknown error occured";
    if (!error.error || !error.error.error) {
      return _throw(errorMessage);
    }
    switch (error.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = "This email exists already!";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = "Email not found!";
        break;
      case 'INVALID_PASSWORD':
        errorMessage = "Invalid password!";
        break;
    }
    return _throw(errorMessage);
  }

}
