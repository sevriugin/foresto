import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { User, UserRole } from 'both/models';
import { Users }          from 'both/collections';

@Component({
  selector: 'partner-client-form',
  templateUrl: './partner-client-form.html'
})
export class PartnerClientForm implements OnInit, OnDestroy {

  clientsSub: Subscription;
  clients: Observable <User[]>;
  client: User;
  clientReady: boolean;

  constructor() {}

  ngOnInit() {
    this.clientsSub = MeteorObservable.subscribe('clients').subscribe(() => {

      const selector = { 'profile.role': UserRole.CLIENT };
      this.clients = Users.find(selector);

      MeteorObservable.autorun().subscribe(() => {
        this.client = Users.findOne(selector);
        this.clientReady = true;
      });  
    });
  }

  deleteClient(user: User): void {
    MeteorObservable.call('deleteClient', user._id).subscribe(() => {}, (error) => {
      this.handleError(error);
    });
  }

  ngOnDestroy() {
    this.clientsSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }

}