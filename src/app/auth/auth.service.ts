import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import {_throw} from 'rxjs/observable/throw';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

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
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res)
    }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(res => {
      this.handleAuthentication(res)
    }));
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

    if (userData._token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log('expirationDuration', expirationDuration)
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

  private handleAuthentication(res: any) {
    const expirationDate = new Date(new Date().getTime() + res.expiresIn * 1000);
    console.log('handleAuthentication', res.email, res.localId, res.idToken, expirationDate)
    const user = new User(res.email, res.localId, res.idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(res.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
