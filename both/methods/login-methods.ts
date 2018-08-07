import { check } from 'meteor/check';

import { UserRole } from '../models';
import { Users }    from '../collections';
 
Meteor.methods({

  addPartner: function (email: string): string {

    check(email, String);

    const _id = Accounts.createUser({ email: email, password: '******', profile: { role: UserRole.PARTNER } });
    return _id;
  },

  addClient: function (phone: string): string {

    check(phone, String);

    const _id = Accounts.createUser({ username: phone, password: '1111', profile: { role: UserRole.CLIENT, _createdBy: this.userId } });
    return _id;
  },

  deletePartner: function (_id: string): void {

    check(_id, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    if (role != UserRole.OWNER)
      throw new Meteor.Error('405', 'Not authorized!');

    const userPartner = Users.collection.findOne(_id);
    if (! userPartner)
      throw new Meteor.Error('404', 'No such user!');

    if (! userPartner.profile || userPartner.profile.role != UserRole.PARTNER)
      throw new Meteor.Error('400', 'That user is not partner...');

    const userClient = Users.collection.findOne( { 'profile._createdBy': userPartner._id } );
    if (userClient)
      throw new Meteor.Error('406', 'That user has child users...');

    Meteor.users.remove(_id);
  },

  deleteClient: function (_id: string): void {

    check(_id, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    if (role !== UserRole.PARTNER)
      throw new Meteor.Error('405', 'Not authorized!');

    const userClient = Users.collection.findOne(_id);
    if (! userClient) 
      throw new Meteor.Error('404', 'No such user!');

    if (! userClient.profile || userClient.profile.role != UserRole.CLIENT)
      throw new Meteor.Error('400', 'That user is not client...');

    if (! userClient.profile || userClient.profile._createdBy != this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    Meteor.users.remove(_id);
  }

});