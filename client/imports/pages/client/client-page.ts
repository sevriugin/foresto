import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';
import { Subscription }                 from 'rxjs/Subscription';

import { User }  from 'both/models';

@Component({
  templateUrl: './client-page.html'
})
@InjectUser('user')
export class ClientPage implements OnInit, OnDestroy {

  user: User;

  usersSub: Subscription;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}