import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 

import { User }         from 'both/models';
import { LoginService } from 'imports/services';

@Component({
  selector: 'login-dashboard',
  templateUrl: './login-dashboard.html'
})
@InjectUser('user')
export class LoginDashboard implements OnInit, OnDestroy {
 
  user: User;

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {}

  logout() {
    this.loginService.logout()
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch((e) => {
      this.handleError(e);
    });
  }

  ngOnDestroy() {}    

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}