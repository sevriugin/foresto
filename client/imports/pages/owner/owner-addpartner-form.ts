import { MeteorObservable }             from 'meteor-rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Pattern } from 'both/models';

@Component({
  selector: 'owner-addpartner-form',
  templateUrl: './owner-addpartner-form.html'
})
export class OwnerAddPartnerForm implements OnInit, OnDestroy {
  
  email: string;
  readonly emailPattern = Pattern.EMAIL;

  constructor() {}

  ngOnInit() {}

  onInputKeypress({keyCode}: KeyboardEvent): void {
    if (keyCode === 13 && this.valid()) {
      this.addPartner(this.email);
    }
  }
 
  addPartner(email: string): void {
    MeteorObservable.call('addPartner', this.email).subscribe((_id) => {
      this.reset();
    }, (error) => {
      this.handleError(error);
    });
  }
 
  valid(): boolean {
    var result: boolean = 
      !!this.email && 
      !!this.email.match(this.emailPattern);

    return result;
  }

  reset(): void {
    this.email = '';
  }

  ngOnDestroy() {}

  handleError(e: Error): void {
    console.error(e);
    alert('Ошибка: ' + e.message);
  }

}