import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable }                   from 'rxjs';
import { Subscription }                 from 'rxjs/Subscription';

import { SubPool }          from 'both/models';
import { SubPools }         from 'both/collections';

@Component({
  selector: 'owner-subpool-form',
  templateUrl: './owner-subpool-form.html'
})
export class OwnerSubPoolForm implements OnInit, OnDestroy {

  ready: boolean;

  subpoolsSub: Subscription;
  subpools: Observable <SubPool[]>;

  subpoolSub: Subscription;
  subpoolFirst: SubPool;

  constructor() {}

  ngOnInit() {
    this.subpoolsSub = MeteorObservable.subscribe('subpools').subscribe(() => {

      this.subpools = SubPools.find();

      this.subpoolSub = MeteorObservable.autorun().subscribe(() => {
        this.subpoolFirst = SubPools.findOne();
        this.ready = true;
      }); 
    });
  }

  ngOnDestroy() {
    if (this.subpoolsSub) this.subpoolsSub.unsubscribe();
    if (this.subpoolSub)  this.subpoolSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }

}