import { Users, Tokens }  from '../collections';
import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { UserRole } from '../models';

import SimpleStorage from 'imports/ethereum/SimpleStorage';

let simpleStorage;

if (Meteor.isServer) {
  simpleStorage = new SimpleStorage();
}

Meteor.methods({

  createToken: function (clientId:string) {
    check(clientId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    if (role !== UserRole.PARTNER)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const token = Tokens.collection.findOne({ user_id: clientId });
    if (token)
      throw new Meteor.Error('404', 'Token already created!');

    const client = Users.collection.findOne(clientId);
    if (! client) 
      throw new Meteor.Error('404', 'No such user!');
  
    if (! client.profile || client.profile.role != UserRole.CLIENT)
      throw new Meteor.Error('400', 'That user is not client...');
  
    if (! client.profile || client.profile._createdBy != this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    if (Meteor.isServer) {

      simpleStorage.setData(10, (result) => {
        Tokens.collection.insert({
          user_id: clientId,
          issued: false,
          activated: false,
          _createdBy: this.userId
        });
      }); 

    }
  }
  
});