import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, Offer } from 'both/models';
import { Offers }      from 'both/collections';

@Component({
  templateUrl: './client-page.html'
})
@InjectUser('user')
export class ClientPage implements OnInit, OnDestroy {

  user: User;

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

  ngOnDestroy() {
    this.offersSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}


