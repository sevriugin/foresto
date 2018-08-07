import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router }       from '@angular/router';
import { Subscription }                 from 'rxjs/Subscription';

import { Users }        from 'both/collections';
import { LoginService } from 'imports/services';

@Component({
  templateUrl: './client-login-page.html'
})
export class ClientLoginPage implements OnInit, OnDestroy {
  
  phone: string;
  code: string;

  paramsSub: Subscription;
  clientSub: Subscription;

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
    .map(params => params['_id'])
    .subscribe(_id => {

      this.clientSub = MeteorObservable.subscribe('client', _id).subscribe(() => {
        const user = Users.findOne(_id);
        if (! user) {
          this.handleError(new Error('Пользователь не найден!'));
          return;
        }

        this.phone = user.username;
        if (! this.phone) {
          this.handleError(new Error('Телефон пользователя не задан!'));
        }
      });

    });
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.login();
    }
  }
 
  login(): void {
    if (! this.valid()) {
      return;
    }

    if (! this.phone) {
      this.handleError(new Error('Телефон пользователя не задан!'));
      return;
    }

    this.loginService.loginClient(this.phone, this.code)
    .then(() => {
      this.router.navigate(['/client']);
    })
    .catch((e) => {
      this.handleError(e);
    })
  }
 
  valid(): boolean {
    return !! this.code;
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.clientSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}