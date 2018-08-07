import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole }  from 'both/models';
import { Users }           from 'both/collections';

@Component({
  selector: 'owner-partner-form',
  templateUrl: './owner-partner-form.html'
})
export class OwnerPartnerForm implements OnInit, OnDestroy {

  ready: boolean;

  partnersSub: Subscription;
  partners: Observable <User[]>;
  partner: User;

  constructor() {}

  ngOnInit() {
    this.partnersSub = MeteorObservable.subscribe('partners').subscribe(() => {
      
      const selector = { 'profile.role': UserRole.PARTNER };
      this.partners = Users.find(selector);

      MeteorObservable.autorun().subscribe(() => {
        this.partner = Users.findOne(selector);
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
    this.partnersSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }
}