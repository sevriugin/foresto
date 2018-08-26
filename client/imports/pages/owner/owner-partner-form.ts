import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { Partner, PARTNER_SELECTOR } from 'both/models';
import { Partners }                  from 'both/collections';

@Component({
  selector: 'owner-partner-form',
  templateUrl: './owner-partner-form.html'
})
export class OwnerPartnerForm implements OnInit, OnDestroy {

  ready: boolean;

  partnersSub: Subscription;
  partners: Observable <Partner[]>;

  partnerSub: Subscription;
  partnerFirst: Partner;

  constructor() {}

  ngOnInit() {
    this.partnersSub = MeteorObservable.subscribe('partners').subscribe(() => {
      
      this.partners = Partners.find(PARTNER_SELECTOR);

      this.partnerSub = MeteorObservable.autorun().subscribe(() => {
        this.partnerFirst = Partners.findOne(PARTNER_SELECTOR);
        this.ready = true;
      });  
    });
  }

  deletePartner(partner: Partner): void {
    MeteorObservable.call('deletePartner', partner._id).subscribe(() => {}, (error) => {
      this.handleError(error);
    });
  }
 
  ngOnDestroy() {
    if (this.partnersSub) this.partnersSub.unsubscribe();
    if (this.partnerSub)  this.partnerSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }
}