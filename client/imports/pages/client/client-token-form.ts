
import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { Token }  from 'both/models';
import { Tokens } from 'both/collections';

@Component({
  selector: 'client-token-form',
  templateUrl: './client-token-form.html'
})
export class ClientTokenForm implements OnInit, OnDestroy {

  tokensSub: Subscription;
  tokens: Observable <Token[]>;
  token: Token;
  tokenReady: boolean;

  constructor() {}

  ngOnInit() {
    this.tokensSub = MeteorObservable.subscribe('tokens').subscribe(() => {

      this.tokens = Tokens.find();

      MeteorObservable.autorun().subscribe(() => {
        this.token = Tokens.findOne();
        this.tokenReady = true;
      });  
    });
  }

  ngOnDestroy() {
    if (this.tokensSub) this.tokensSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }
}


