import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';

@Component({
  selector: 'start-roles-form',
  templateUrl: './start-roles-form.html'
})
export class StartRolesForm implements OnInit, OnDestroy {

  usersSub: Subscription;
  usersOwner: User[];
  usersPartner: User[];

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('usersOwnerPartner').subscribe(() => {
    
      MeteorObservable.autorun().subscribe(() => {
        this.usersOwner = Users.find({ 'profile.role': UserRole.OWNER }).fetch().slice(0, 3);
        this.usersPartner = Users.find({ 'profile.role': UserRole.PARTNER }).fetch().slice(0, 3);
      });
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