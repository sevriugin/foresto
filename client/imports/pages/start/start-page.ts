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

  constructor(
    readonly router: Router,
    readonly loginService: LoginService
  ) {}

  ngOnInit() {
    if (this.user) {
      var role;
      if (this.user.profile) {
        role = this.user.profile.role;
      }

      if (role == UserRole.OWNER) {
        this.router.navigate(['/owner']);
      }
      // other roles...
      else {
        this.loginService.logout()
          .catch((e) => {
            this.handleError(e);
          });
      }
      this.user = null;
    }

    if (!this.user) {
      this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {

        const ownerUser: User = Users.collection.findOne({ 'profile.role': UserRole.OWNER });
        const partnerExists: boolean = !!Users.collection.findOne({ profile: { role: UserRole.PARTNER } });

        if (!ownerUser) {
          this.router.navigate(['/owner-register']);
        } 
        else if (!partnerExists) {
          this.router.navigate(['/owner-login', ownerUser._id]);
        }
        else {
          this.router.navigate(['/roles']);
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