import { MongoObservable } from 'meteor-rxjs';

import { Partner } from '../models';

export const Partners = MongoObservable.fromExisting <Partner> (Meteor.users);

// Not-allowing on users doesn't deny update. 
// Deny on insert is realizable only in Accounts.validateNewUser().
// Removing user doesn't work even on server side.
// Only profile is updatable.
Partners.deny ({
  update(userId, doc, fields, modifier) {
    return true;
  }
});