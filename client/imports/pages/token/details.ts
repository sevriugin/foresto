import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 
 
import 'rxjs/add/operator/map';

import { Tokens, Users }            from 'both/collections';
import { Token, User, UserRole }    from 'both/models';

@Component({
  templateUrl: './details.html'
})
@InjectUser('user')
export class TokenDetails implements OnInit , OnDestroy {

  user: User;
  role: UserRole;

  paramsSub: Subscription;

  tokenId: string;
  token: Token;
  tokens: Observable <Token[]>;
  tokenSub: Subscription;
  tokensSub: Subscription;

  partner: boolean;
  client: boolean;
  
  constructor(
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['tokenId'])
      .subscribe(tokenId => {
        this.tokenId = tokenId;
        this.user = Users.findOne(Meteor.userId());
        this.role = this.user && this.user.profile && this.user.profile.role;
        if(this.role == UserRole.PARTNER) {
          this.partner = true; this.client = false;
        }
        else if(this.role == UserRole.CLIENT) {
          this.partner = false; this.client = true;
        }
        else {
          this.partner = false; this.client = false;
        }

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

  activate(tokenId:string): void {

    MeteorObservable.call('changeToken', tokenId).subscribe(() => {

      MeteorObservable.call('activateToken', tokenId).subscribe(() => {
        this.reset();
      }, (error) => {
        this.handleError(error);
      });
    }, (error) => {
      this.handleError(error);
    });
  }

  reset(): void {
  }

  handleError(e: Error): void {

    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.tokenSub.unsubscribe();
    this.tokensSub.unsubscribe();
  }  

}