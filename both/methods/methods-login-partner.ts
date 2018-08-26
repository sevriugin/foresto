import { check } from 'meteor/check';

import { Role, 
         Owner, OWNER_SELECTOR,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR }   from '../models';
import { Owners, Partners, Clients } from '../collections';
 
Meteor.methods({

  addPartner: function (email: string, password: string = '******'): string {
    check(email,    String);
    check(password, String);

    const owner: Owner = Owners.collection.findOne(
      Object.assign({ _id: this.userId}, OWNER_SELECTOR)
    );
    if (! owner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }

    return Accounts.createUser({ 
      email: email, 
      password: password, 
      profile: { role: Role.PARTNER } 
    });
  },

  deletePartner: function (partnerId: string): void {
    check(partnerId, String);

    const owner: Owner = Owners.collection.findOne(
      Object.assign({ _id: this.userId}, OWNER_SELECTOR)
    );
    if (! owner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }

    const partner: Partner = Partners.collection.findOne(
      Object.assign({ _id: partnerId}, PARTNER_SELECTOR)
    );
    if (! partner) {
      throw new Meteor.Error('404', 'No such partner!');
    }

    const client: Client = Clients.collection.findOne(
      Object.assign({ 'profile._createdBy': partnerId }, CLIENT_SELECTOR)
    );
    if (client) {
      throw new Meteor.Error('402', 'Partner has clients!');
    }

    if (Meteor.isServer) {
      Meteor.users.remove(partnerId);
    }
  }

});