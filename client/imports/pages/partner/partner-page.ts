import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole, Offer } from 'both/models';
import { Users, Offers }         from 'both/collections';

@Component({
  templateUrl: './partner-page.html'
})
@InjectUser('user')
export class PartnerPage implements OnInit, OnDestroy {

  user: User;

  clientsSub: Subscription;
  clients: Observable <User[]>;
  client: User;
  clientReady: boolean;

  offersSub: Subscription;
  offers: Observable <Offer[]>;
  offer: Offer;
  offerReady: boolean;

  constructor() {}

  ngOnInit() {
    this.clientsSub = MeteorObservable.subscribe('usersClient').subscribe(() => {

      const selector = { 'profile.role': UserRole.CLIENT };
      this.clients = Users.find(selector);

      MeteorObservable.autorun().subscribe(() => {
        this.client = Users.findOne(selector);
        this.clientReady = true;
      });  
    });

    this.offersSub = MeteorObservable.subscribe('offers').subscribe(() => {

      this.offers = Offers.find();

      MeteorObservable.autorun().subscribe(() => {
        this.offer = Offers.findOne();
        this.offerReady = true;
      });  
    });
  }

  deleteClient(user: User): void {
    MeteorObservable.call('deleteClient', user._id).subscribe(() => {}, (error) => {
      this.handleError(error);
    });
  }

  deleteOffer(offer: Offer): void {
    if (!offer)
      return;

    Offers.remove(offer._id).subscribe(() => {
    }, (error) => {
      this.handleError(error);
    });
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
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