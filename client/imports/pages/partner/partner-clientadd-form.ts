import { MeteorObservable } from 'meteor-rxjs';
import { Component }        from '@angular/core';

import { Pattern, Mask_PHONE } from 'both/models';

@Component({
  selector: 'partner-clientadd-form',
  templateUrl: './partner-clientadd-form.html'
})
export class PartnerClientAddForm {
  
  phone: string;
  token: boolean;
  readonly phonePattern = Pattern.PHONE;
  readonly phoneMask = Mask_PHONE;

  constructor() {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13 && this.valid()) {
      this.addClient();
    }
  }
 
  addClient(): void {
    MeteorObservable.call('addClient', this.phone).subscribe((clientId) => {

      // create token for the new client
      if(this.token) {

        MeteorObservable.call('createToken', clientId).subscribe(() => {
          this.reset();
        }, (error) => {
          this.handleError(error);
        });

      }
      else {
        this.reset();
      }
    }, (error) => {
      this.handleError(error);
    });
  }
 
  valid(): boolean {
    var result: boolean = 
      !! this.phone && 
      !! this.phone.match(this.phonePattern);

    return result;
  }

  reset(): void {
    this.phone = '';
    this.token = false;
  }

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}