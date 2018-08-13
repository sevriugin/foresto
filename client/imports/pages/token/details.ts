import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 
 
import 'rxjs/add/operator/map';

import { Tokens }      from 'both/collections';
import { Token, User } from 'both/models';

@Component({
  templateUrl: './details.html'
})
@InjectUser('user')
export class TokenDetails implements OnInit , OnDestroy {

  user: User;

  paramsSub: Subscription;

  tokenId: string;
  token: Token;
  tokens: Observable <Token[]>;
  tokenSub: Subscription;
  tokensSub: Subscription;
  
  constructor(
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['tokenId'])
      .subscribe(tokenId => {
        this.tokenId = tokenId;

        this.tokenSub = MeteorObservable.subscribe('token', this.tokenId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.token = Tokens.findOne(this.tokenId);
          });
        });

        this.tokensSub = MeteorObservable.subscribe('tokens').subscribe(() => {
          this.tokens = Tokens.find( { _id: this.tokenId } );
        });
      });
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.tokenSub.unsubscribe();
    this.tokensSub.unsubscribe();
  }  

}