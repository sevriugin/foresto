import { Users, Tokens }  from '../collections';
import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { UserRole } from '../models';

import TokenLoyalty from 'imports/ethereum/TokenLoyalty';
const ownerAddress = "0x2952920b5813447f86D6c30Ad1e5C0975Fe563dd";

let tokenLoyalty;

if (Meteor.isServer) {
  tokenLoyalty = new TokenLoyalty();
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

      tokenLoyalty.setWatch(Meteor.bindEnvironment((data) => {
        tokenLoyalty.resetWatch();

        Tokens.collection.insert({
          owner_address: data.member,
          nft_id: data.tokenId,
          user_id: data.clientId,
          issued: true,
          activated: false,
          _createdBy: this.userId,
          value: 500,
          tx: data.tx,
          subPoolId: data.supPoolId
        });
      }));

      tokenLoyalty.setData({member:ownerAddress, clientId:clientId}, (result) => {
        console.log(`methods-token: TX: ${result.tx}`);
      }); 

    }
  }
  
});