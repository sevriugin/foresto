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

  deletePartner: function (partnerId: string): void {
    check(partnerId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    if (role != UserRole.OWNER)
      throw new Meteor.Error('405', 'Not authorized!');

    const partner = Users.collection.findOne(partnerId);
    if (! partner)
      throw new Meteor.Error('404', 'No such user!');

    if (! partner.profile || partner.profile.role != UserRole.PARTNER)
      throw new Meteor.Error('400', 'That user is not partner...');

    const client = Users.collection.findOne( { 'profile._createdBy': partnerId } );
    if (client)
      throw new Meteor.Error('406', 'That user has child users...');

    Meteor.users.remove(partnerId);
  },

  deleteClient: function (clientId: string): void {
    check(clientId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    if (role !== UserRole.PARTNER)
      throw new Meteor.Error('405', 'Not authorized!');

    const client = Users.collection.findOne(clientId);
    if (! client) 
      throw new Meteor.Error('404', 'No such user!');

    if (! client.profile || client.profile.role != UserRole.CLIENT)
      throw new Meteor.Error('400', 'That user is not client...');

    if (! client.profile || client.profile._createdBy != this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    Meteor.users.remove(clientId);
  }

});