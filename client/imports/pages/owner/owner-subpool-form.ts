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

  subpoolsSub: Subscription;
  subpools: Observable <SubPool[]>;
  subpool: SubPool;
  subpoolReady: boolean;

  constructor() {}

  ngOnInit() {
    this.subpoolsSub = MeteorObservable.subscribe('subpools').subscribe(() => {

      this.subpools = SubPools.find();

      MeteorObservable.autorun().subscribe(() => {
        this.subpool = SubPools.findOne();
        this.subpoolReady = true;
      }); 
    });
  }


  ngOnDestroy() {
    this.subpoolsSub.unsubscribe();
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

  alert(message: string): void {
    alert(message);
  }

}