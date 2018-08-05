import { User, UserRole, USER_PUBLIC } from 'both/models';
import { Users }                       from 'both/collections';

Meteor.publish('usersOwnerPartner', (): Mongo.Cursor <User> => {
   
  return Users.collection.find(
    { 'profile.role': { $in: [ UserRole.OWNER, UserRole.PARTNER ] } }, 
    { fields: USER_PUBLIC }
  );
});