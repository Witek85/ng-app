import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error:string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form:NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    // przypisanie observable to zmiennej - tak powinno się to robić
    let authObservable: Observable<AuthResponseData>

    this.isLoading = true;
    
    // przypisanie observable to zmiennej - tak powinno się to robić
    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password)
    }
    form.reset();

    authObservable.subscribe(response => {
      console.log(response);
      this.isLoading = false;
      this.router.navigate(['./recipes']);
    }, error => {
      console.log(error);
      this.isLoading = false;
      this.error = error;
    });
    
  }

  onHandleError() {
    this.error = null;
  }

}
