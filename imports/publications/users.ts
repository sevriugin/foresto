import { User, USER_PUBLIC } from 'both/models';
import { Users }             from 'both/collections';

Meteor.publish('users', (): Mongo.Cursor <User> => {
  //if (!this.userId) {
  //  return;
  //}
   
  return Users.collection.find({}, { fields: USER_PUBLIC });
});