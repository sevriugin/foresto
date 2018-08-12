import { MongoObservable } from 'meteor-rxjs';

import { User } from '../models';

export const Users = MongoObservable.fromExisting <User> (Meteor.users);

// Allow on users doesn't deny update. 
// Deny on insert is realizable only in Accounts.validateNewUser().
// Removing user doesn't work even on server side.
// Only profile is updatable.
Users.deny ({
  update(_id, user, fields, modifier) {
    return true;
  }
});