import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';

import { LoginService } from 'imports/services';
import { Pattern }      from 'both/models';

@Component({
  templateUrl: './owner-register.html'
})
export class OwnerRegisterPage implements OnInit, OnDestroy {
  
  email: string;
  readonly emailPattern = Pattern.EMAIL;

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.register();
    }
  }
 
  register(): void {
    if (!this.valid()) {
      return;
    }

    //->>
    //Meteor.users.update({ _id: Meteor.userId() }, { $addToSet: { roles: 'admin' } })
    //const n = Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.role': 'owner' } }, {}, (err) => {
    const n = Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'emails[0].address': 'a.neznakhin@mail.ru' } }, {}, (err) => {
      if (err) {
        alert('error: ' + err);
      };
    });
    alert('n: ' + n);
    //this.loginService.registerOwner(this.email)
    //.then(() => {
    //  this.router.navigate(['/owner']);
    //})
    //.catch((e) => {
    //  this.handleError(e);
    //});
  }
 
  valid(): boolean {
    var result: boolean = 
      !!this.email && 
      !!this.email.match(this.emailPattern);

    return result;
  }

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}