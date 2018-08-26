import { MongoObservable } from 'meteor-rxjs';

import { Owner } from '../models';

export const Owners = MongoObservable.fromExisting <Owner> (Meteor.users);

// Not-allowing on users doesn't deny update. 
// Deny on insert is realizable only in Accounts.validateNewUser().
// Removing user doesn't work even on server side.
// Only profile is updatable.
Owners.deny ({
  update(userId, doc, fields, modifier) {
    return true;
  }
});