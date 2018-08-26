import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute }               from '@angular/router';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';
import { InjectUser }                   from 'angular2-meteor-accounts-ui'; 
 
import 'rxjs/add/operator/map';

import { SubPools, Users }     from 'both/collections';
import { SubPool, User, Role } from 'both/models';

@Component({
  templateUrl: './details.html'
})
@InjectUser('user')
export class SubPoolDetails implements OnInit , OnDestroy {

  user: User;
  role: Role;

  paramsSub: Subscription;

  subPoolId: string;
  subpool: SubPool;
  subpools: Observable <SubPool[]>;
  subpoolSub: Subscription;
  subpoolsSub: Subscription;

  payment: string;
  debit: string;
  value: string;

  owner: boolean;
  
  constructor(
    private route: ActivatedRoute
  ) {}
 
  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['subPoolId'])
      .subscribe(subPoolId => {
        this.subPoolId = subPoolId;
        this.user = Users.findOne(Meteor.userId());
        this.role = this.user && this.user.profile && this.user.profile.role;

        if(this.role == Role.OWNER) {
          this.owner = true; 
        }

        this.subpoolSub = MeteorObservable.subscribe('subpool', this.subPoolId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.subpool = SubPools.findOne(this.subPoolId);
          });
        });

        this.subpoolsSub = MeteorObservable.subscribe('subpools').subscribe(() => {
          this.subpools = SubPools.find( { _id: this.subPoolId } );
        });
      });
  }

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.funding();
    }
  }

  funding(): void {

    if (!this.valid())
      return;

    MeteorObservable.call('changeSubPool', this.subpool.subPoolId).subscribe(() => {

      MeteorObservable.call('fundSubPool', this.subpool.subPoolId, this.payment.toString(), this.debit.toString(), this.value.toString()).subscribe(() => {
        this.reset();
      }, (error) => {
        this.handleError(error);
      });
    }, (error) => {
      this.handleError(error);
    });
  }

  valid(): boolean {
    const result: boolean = 
      !! this.payment && 
      !! this.debit &&
      !! this.value;

    return result;
  }

  reset(): void {
    this.payment = "";
    this.debit = "";
    this.value = "";
  }

  handleError(e: Error): void {

    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  ngOnDestroy() {
    if (this.paramsSub)   this.paramsSub.unsubscribe();
    if (this.subpoolSub)  this.subpoolSub.unsubscribe();
    if (this.subpoolsSub) this.subpoolsSub.unsubscribe();
  }  

}