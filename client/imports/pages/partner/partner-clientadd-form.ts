import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Pattern, Mask_PHONE } from 'both/models';

@Component({
  selector: 'partner-clientadd-form',
  templateUrl: './partner-clientadd-form.html'
})
export class PartnerClientAddForm implements OnInit, OnDestroy {
  
  phone: string;
  readonly phonePattern = Pattern.PHONE;
  //public phoneMask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  readonly phoneMask = Mask_PHONE;

  constructor() {}

  ngOnInit() {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13 && this.valid()) {
      this.addClient(this.phone);
    }
  }
 
  addClient(phone: string): void {
    MeteorObservable.call('addClient', this.phone).subscribe((_id) => {
      this.reset();
    }, (error) => {
      this.handleError(error);
    });
  }
 
  valid(): boolean {
    var result: boolean = 
      !!this.phone && 
      !!this.phone.match(this.phonePattern);

    return result;
  }

  reset(): void {
    this.phone = '';
  }

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}