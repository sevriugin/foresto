import { Component }  from '@angular/core';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import { User } from 'both/models';

@Component({
  templateUrl: './partner-page.html'
})
@InjectUser('user')
export class PartnerPage {

  user: User;

  constructor() {}
}