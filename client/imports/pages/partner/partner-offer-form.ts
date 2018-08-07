import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { Offer }  from 'both/models';
import { Offers } from 'both/collections';

@Component({
  selector: 'partner-offer-form',
  templateUrl: './partner-offer-form.html'
})
export class PartnerOfferForm implements OnInit, OnDestroy {

  offersSub: Subscription;
  offers: Observable <Offer[]>;
  offer: Offer;
  offerReady: boolean;

  constructor() {}

  ngOnInit() {
    this.offersSub = MeteorObservable.subscribe('offers').subscribe(() => {

      this.offers = Offers.find();

      MeteorObservable.autorun().subscribe(() => {
        this.offer = Offers.findOne();
        this.offerReady = true;
      });  
    });
  }

  deleteOffer(offer: Offer): void {
    if (! offer)
      return;

    Offers.remove(offer._id).subscribe(() => {
    }, (error) => {
      this.handleError(error);
    });
  }

  ngOnDestroy() {
    this.offersSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }

}