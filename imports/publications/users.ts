import { User, UserRole, USER_PUBLIC } from 'both/models';
import { Users }                       from 'both/collections';

// Temporary: demonstration only (start page).
Meteor.publish('usersOwnerPartnerClient', (): Mongo.Cursor <User> => {
   
  return Users.collection.find(
    { 'profile.role': { $in: [ UserRole.OWNER, UserRole.PARTNER, UserRole.CLIENT ] } }, 
    { fields: USER_PUBLIC }
  );
});

Meteor.publish('userOwner', (_id: string): Mongo.Cursor <User> => {   
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.OWNER }, { fields: USER_PUBLIC });
});

Meteor.publish('userPartner', (_id: string): Mongo.Cursor <User> => {
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.PARTNER }, { fields: USER_PUBLIC });
});

Meteor.publish('userClient', (_id: string): Mongo.Cursor <User> => {
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.CLIENT }, { fields: USER_PUBLIC });
});

Meteor.publish('usersPartner', (): Mongo.Cursor <User> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.OWNER) {

    return Users.collection.find(
      { 'profile.role': UserRole.PARTNER }, 
      { fields: USER_PUBLIC }
    );
  }
  else {
    return;
  };
});

Meteor.publish('usersClient', (): Mongo.Cursor <User> => {
   
  const user = Users.collection.findOne({ _id: Meteor.userId() });
  const role = user && user.profile && user.profile.role;
  if (role == UserRole.PARTNER) {

    return Users.collection.find(
      { 'profile.role': UserRole.CLIENT, 'profile._createdBy': user._id }, 
      { fields: USER_PUBLIC }
    );
  }
  else {
    return;
  };
});