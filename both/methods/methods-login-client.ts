import { check } from 'meteor/check';

import { Role,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR,
         Token }                     from '../models';
import { Partners, Clients, Tokens } from '../collections';
import { Mongo } from 'meteor/mongo';
 
Meteor.methods({

  addClient: function (phone: string, password: string = '1111'): string {
    check(phone,    String);
    check(password, String);

    const partner: Partner = Partners.collection.findOne(
      Object.assign({ _id: this.userId}, PARTNER_SELECTOR)
    );
    if (!partner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }

    return Accounts.createUser({ 
      username: phone, 
      password: password, 
      profile: { role: Role.CLIENT, _createdBy: this.userId } 
    });
  },

  deleteClient: function (clientId: string): void {
    check(clientId, String);

    const partner: Partner = Partners.collection.findOne(
      Object.assign({ _id: this.userId}, PARTNER_SELECTOR)
    );
    if (!partner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }

    const client: Client = Clients.collection.findOne(
      Object.assign({ _id: clientId}, CLIENT_SELECTOR)
    );
    if (! client) {
      throw new Meteor.Error('404', 'No such client!');
    }
    if (! client.profile || client.profile._createdBy != this.userId) {
      throw new Meteor.Error('403', 'No permissions!');
    }

    if (client.profile && client.profile.inprogress) {
      throw new Meteor.Error('403', 'Waits for token create confirmation!');
    }
    const token: Token = Tokens.collection.findOne( { 'user_id': clientId } );
    if (token) {
      throw new Meteor.Error('402', 'Client has tokens!');
    }
  
    if (Meteor.isServer) {
      Meteor.users.remove(clientId);
    }
  }

});