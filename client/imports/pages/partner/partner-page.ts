import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';

@Component({
  templateUrl: './partner-page.html'
})
@InjectUser('user')
export class PartnerPage implements OnInit, OnDestroy {

  user: User;
  ready: boolean;

  usersSub: Subscription;
  usersClient: Observable <User[]>;
  userClient: User;

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('usersClient').subscribe(() => {

      const selector = { 'profile.role': UserRole.CLIENT };
      this.usersClient = Users.find(selector);

      MeteorObservable.autorun().subscribe(() => {
        this.userClient = Users.findOne(selector);
        this.ready = true;
      });  
    });
  }

  deleteClient(user: User): void {
    MeteorObservable.call('deleteClient', user._id).subscribe(() => {}, (error) => {
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