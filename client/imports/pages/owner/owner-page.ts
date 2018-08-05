import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';

@Component({
  templateUrl: './owner-page.html'
})
@InjectUser('user')
export class OwnerPage implements OnInit, OnDestroy {

  user: User;
  ready: boolean;

  usersSub: Subscription;
  usersPartner: Observable <User[]>;
  userPartner: User;

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('usersOwnerPartner').subscribe(() => {
      
      const selector = { 'profile.role': UserRole.PARTNER };
      this.usersPartner = Users.find(selector);

      MeteorObservable.autorun().subscribe(() => {
        this.userPartner = Users.findOne(selector);
        this.ready = true;
      });  
    });
  }

  deletePartner(user: User): void {
    MeteorObservable.call('deletePartner', user._id).subscribe(() => {}, (error) => {
      this.handleError(error);
    });
  }
 
  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }
}