import { Component, OnInit, OnDestroy } from '@angular/core';
import { InjectUser }                   from 'angular2-meteor-accounts-ui';

import { User, OfferSize } from 'both/models';
import { Offers }          from 'both/collections';

@Component({
  selector: 'partner-addoffer-form',
  templateUrl: './partner-addoffer-form.html'
})
@InjectUser('user')
export class PartnerAddOfferForm implements OnInit, OnDestroy {
  
  user: User;

  validFrom: string;
  expired: string;
  header: string;
  size: string;

  readonly sizes = OfferSize;

  constructor() {}

  ngOnInit() {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13) {
      this.addOffer();
    }
  }
 
  addOffer(): void {
    if (!this.valid())
      return;

    Offers.insert({ 
      validFrom: this.validFrom, 
      expired: this.expired, 
      header: this.header, 
      size: this.size, 
      _createdBy: this.user._id 
    }).subscribe((_id) => {

      this.reset();

    }, (error) => {

      this.handleError(error);
      
    });
  }
 
  valid(): boolean {
    const result: boolean = 
      !! this.valid && 
      !! this.expired &&
      !! this.header &&
      !! this.size;
    
    if (!! this.size && OfferSize.indexOf(this.size) == -1)
      alert('Значение' + '\n' + 'размера отображения предложения' + '\n' + 'должно быть из списка!');
    

    return result;
  }

  reset(): void {
    this.validFrom = '';
    this.expired = '';
    this.header = '';
    this.size = '';
  }

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}