import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router }                       from '@angular/router';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';

import { User } from 'both/models';

@Component({
  templateUrl: './owner-page.html'
})
@InjectUser('user')
export class OwnerPage implements OnInit, OnDestroy {

  user: User;

  constructor(
    readonly router: Router
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}