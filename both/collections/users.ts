import { MongoObservable } from 'meteor-rxjs';

import { User } from '../models';

export const Users = MongoObservable.fromExisting <User> (Meteor.users);

// Allow on users doesn't work correctly. 
// Deny on insert is realizable only in Accounts.validateNewUser().
// Removing user doesn't work even on server side.
Users.deny ({
  update(_id, user, fields, modifier) {
    return false; //userId && !!task._createdBy && task._createdBy === userId;
  }
});