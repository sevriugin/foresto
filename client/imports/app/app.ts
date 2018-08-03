import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 

import { User }         from 'both/models';
import { LoginService } from 'imports/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
@InjectUser('user')
export class App implements OnInit, OnDestroy {
 
  user: User;

  userStr: string;

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {this.userStr = JSON.stringify(this.user);}

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