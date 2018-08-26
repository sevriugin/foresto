import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription }                 from 'rxjs/Subscription';

import { User, Role } from 'both/models';
import { Users }      from 'both/collections';

@Component({
  selector: 'start-roles-form',
  templateUrl: './start-roles-form.html'
})
export class StartRolesForm implements OnInit, OnDestroy {

  usersSub: Subscription;

  ownerTable:   User[][] = [];
  partnerTable: User[][] = [];
  clientTable:  User[][] = [];

  constructor() {}

  ngOnInit() {
    this.usersSub = MeteorObservable.subscribe('users').subscribe(() => {
    
      MeteorObservable.autorun().subscribe(() => {
        this.ownerTable =   this.sliceBy( Users.find({ 'profile.role': Role.OWNER   }).fetch(), 3);
        this.partnerTable = this.sliceBy( Users.find({ 'profile.role': Role.PARTNER }).fetch(), 3);
        this.clientTable =  this.sliceBy( Users.find({ 'profile.role': Role.CLIENT  }).fetch(), 3);
      });
    });
  }

  sliceBy<T>(array: T[], width: number): T[][] {
    let table: T[][] = [];
    for (let i = 0, l = array.length; i < l; i += width) {
      table.push(array.slice(i, i + width));
    }
    return table;
  }

  ngOnDestroy() {
    if (this.usersSub) this.usersSub.unsubscribe();
  }  

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}