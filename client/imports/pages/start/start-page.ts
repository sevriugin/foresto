import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 

import { User, Role }   from 'both/models';
import { Users }        from 'both/collections';
import { ServiceLogin } from 'imports/services';

@Component({
  templateUrl: './start-page.html'
})
@InjectUser('user')
export class StartPage implements OnInit, OnDestroy {

  user: User;
  usersSub: Subscription;

  ownerCount: number;
  partner: User;
  client: User;

  constructor(
    readonly router: Router,
    readonly loginService: ServiceLogin
  ) {}

  ngOnInit() {
    if (this.user) {
      const role = this.user.profile && this.user.profile.role;
      if (role && [ Role.OWNER, Role.PARTNER, Role.CLIENT ].indexOf(role) != -1) {
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

        const owners = Users.collection.find({ 'profile.role': Role.OWNER });
        this.ownerCount = owners.count();

        this.partner = Users.collection.findOne({ 'profile.role': Role.PARTNER });
        this.client =  Users.collection.findOne({ 'profile.role': Role.CLIENT  });

        if (this.ownerCount == 0) {

          this.router.navigate(['/owner-register']);
          return;
        } 
        if (this.ownerCount <= 1 && ! this.partner && ! this.client) {

          const _id = owners.fetch()[0]._id;
          this.router.navigate(['/owner-login', _id]);
          return;
        }        
      });
    }
  }

  ngOnDestroy() {
    if (this.usersSub) this.usersSub.unsubscribe();    
  }  

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}