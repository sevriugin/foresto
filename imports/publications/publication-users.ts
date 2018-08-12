import { User, UserRole, USER_PUBLIC } from 'both/models';
import { Users }                       from 'both/collections';

// Temporary: demonstration only (start page).
Meteor.publish('users', (): Mongo.Cursor <User> => {
  return Users.collection.find({}, { fields: USER_PUBLIC });
});

Meteor.publish('owner', (_id: string): Mongo.Cursor <User> => {
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.OWNER }, { fields: USER_PUBLIC });
});

Meteor.publish('partners', (): Mongo.Cursor <User> => {
   
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

Meteor.publish('partner', (_id: string): Mongo.Cursor <User> => {
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.PARTNER }, { fields: USER_PUBLIC });
});

Meteor.publish('clients', (): Mongo.Cursor <User> => {
   
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

Meteor.publish('client', (_id: string): Mongo.Cursor <User> => {
  return Users.collection.find({ _id: _id, 'profile.role': UserRole.CLIENT }, { fields: USER_PUBLIC });
});

