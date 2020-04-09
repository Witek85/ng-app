import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs/Observable';

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from 'app/shared/placeholder/placeholder.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error:string = null;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  private closeSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

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
      this.showErrorAlert(error);
    });
    
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    // const alertComponent = new AlertComponent();
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

}
