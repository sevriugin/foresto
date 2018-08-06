import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
  userPartner: User;
  usersPartner: User[];
  userClient: User;
  usersClient_1: User[];
  usersClient_2: User[];
  usersClient_3: User[];

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('usersOwnerPartnerClient').subscribe(() => {
    
      MeteorObservable.autorun().subscribe(() => {
        this.usersOwner = Users.find({ 'profile.role': UserRole.OWNER }).fetch().slice(0, 3);
        this.userPartner = Users.findOne({ 'profile.role': UserRole.PARTNER });
        this.usersPartner = Users.find({ 'profile.role': UserRole.PARTNER }).fetch().slice(0, 3);
        this.userClient = Users.findOne({ 'profile.role': UserRole.CLIENT });
        this.usersClient_1 = Users.find({ 'profile.role': UserRole.CLIENT }).fetch().slice(0, 3);
        this.usersClient_2 = Users.find({ 'profile.role': UserRole.CLIENT }).fetch().slice(3, 6);
        this.usersClient_3 = Users.find({ 'profile.role': UserRole.CLIENT }).fetch().slice(6, 9);
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