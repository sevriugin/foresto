import { Component }  from '@angular/core';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import { User } from 'both/models';

@Component({
  templateUrl: './owner-page.html'
})
@InjectUser('user')
export class OwnerPage {

  user: User;

  constructor() {}
}