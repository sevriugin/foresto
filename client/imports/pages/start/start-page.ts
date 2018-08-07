import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';
import { LoginService }    from 'imports/services';

@Component({
  templateUrl: './start-page.html'
})
@InjectUser('user')
export class StartPage implements OnInit, OnDestroy {

  user: User;
  usersSub: Subscription;

  userOwnerCount: number;
  userPartner: User;
  userClient: User;

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {
    if (this.user) {
      const role = this.user.profile && this.user.profile.role;
      if (role && [ UserRole.OWNER, UserRole.PARTNER, UserRole.CLIENT ].indexOf(role) != -1) {
        this.router.navigate(['/' + role]);
      }
      else {
        this.loginService.logout()
        .catch((e) => {
          this.handleError(e);
        });
        this.user = null;
      }
    }

    if (! this.user) {
      this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {

        const selectorOwner = { 'profile.role': UserRole.OWNER };
        const usersOwner = Users.collection.find(selectorOwner);
        this.userOwnerCount = usersOwner.count();

        const selectorPartner = { 'profile.role': UserRole.PARTNER };
        this.userPartner = Users.collection.findOne(selectorPartner);

        const selectorClient = { 'profile.role': UserRole.CLIENT };
        this.userClient = Users.collection.findOne(selectorPartner);

        if (this.userOwnerCount == 0) {

          this.router.navigate(['/owner-register']);
        } 
        else if (this.userOwnerCount <= 1 && ! this.userPartner && ! this.userClient) {

          const _id = usersOwner.fetch()[0]._id;
          this.router.navigate(['/owner-login', _id]);
        }
        
      });
    }
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }  

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}