import { User, USER_PUBLIC } from 'both/models';
import { Users }             from 'both/collections';

// Temporary: demonstration only (start page).
Meteor.publish('users', (): Mongo.Cursor <User> => {
  return Users.collection.find({}, { fields: USER_PUBLIC });
});
