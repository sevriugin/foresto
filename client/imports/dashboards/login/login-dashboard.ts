import { Component }  from '@angular/core';
import { Router }     from '@angular/router';
import { InjectUser } from 'angular2-meteor-accounts-ui'; 

import { User }         from 'both/models';
import { ServiceLogin } from 'imports/services';

@Component({
  selector: 'login-dashboard',
  templateUrl: './login-dashboard.html'
})
@InjectUser('user')
export class LoginDashboard {
 
  user: User;

  constructor(
    readonly router: Router,
    readonly service: ServiceLogin
  ) {}

  logout() {
    this.service.logout()
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch((e) => {
      this.handleError(e);
    });
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}