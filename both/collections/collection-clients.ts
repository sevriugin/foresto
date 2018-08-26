import { MongoObservable } from 'meteor-rxjs';

import { Client } from '../models';

export const Clients = MongoObservable.fromExisting <Client> (Meteor.users);

// Not-allowing on users doesn't deny update. 
// Deny on insert is realizable only in Accounts.validateNewUser().
// Removing user doesn't work even on server side.
// Only profile is updatable.
Clients.deny ({
  update(userId, doc, fields, modifier) {
    return true;
  }
});