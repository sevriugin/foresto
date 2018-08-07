import { Component }  from '@angular/core';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import { User } from 'both/models';

@Component({
  templateUrl: './client-page.html'
})
@InjectUser('user')
export class ClientPage {

  user: User;

  constructor() {}
}


