import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';

@Component({
  templateUrl: './roles-page.html'
})
export class RolesPage implements OnInit, OnDestroy {

  usersSub: Subscription;
  owners: Observable <User[]>;

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {

      this.owners = Users.find({ 'profile.role': UserRole.OWNER });
    });
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