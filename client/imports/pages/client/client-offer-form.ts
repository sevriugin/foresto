import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { Offer }  from 'both/models';
import { Offers } from 'both/collections';

@Component({
  selector: 'client-offer-form',
  templateUrl: './client-offer-form.html'
})
export class ClientOfferForm implements OnInit, OnDestroy {

  offersSub: Subscription;
  offers: Observable <Offer[]>;
  offer: Offer;
  offerReady: boolean;

  constructor() {}

  ngOnInit() {
    this.offersSub = MeteorObservable.subscribe('client-offers').subscribe(() => {

      this.offers = Offers.find();

      MeteorObservable.autorun().subscribe(() => {
        this.offer = Offers.findOne();
        this.offerReady = true;
      });  
    });
  }

  ngOnDestroy() {
    if (this.offersSub) this.offersSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}


