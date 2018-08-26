import { Users, Tokens, SubPools }  from '../collections';
import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Role }   from '../models';

import TokenLoyalty from 'imports/ethereum/TokenLoyalty';
const ownerAddress = "0x2952920b5813447f86D6c30Ad1e5C0975Fe563dd";

let tokenLoyalty;

if (Meteor.isServer) {

  tokenLoyalty = new TokenLoyalty();

  tokenLoyalty.setWatch(Meteor.bindEnvironment((data) => {
    
    if(data.event === "Created" && ! Tokens.collection.findOne({ user_id: data.clientId })) {
      
      Tokens.collection.insert({
        owner_address: data.member,
        nft_id: data.tokenId,
        user_id: data.clientId,
        issued: true,
        activated: false,
        _createdBy: data.partner,
        value: 500,
        tx: data.tx,
        subPoolId: data.supPoolId,
        inprogress: false
      });

      if( ! SubPools.collection.findOne({ subPoolId: data.supPoolId }) ) {
        SubPools.collection.insert({
          subPoolId: data.supPoolId,
          inprogress: false,
          created: data.subPool.created,
          closed: data.subPool.closed,
          numberOfMembers: data.subPool.numberOfMembers,
          numberOfActivated: data.subPool.numberOfActivated,
          debitValue: data.subPool.debitValue,
          paymentAmount: data.subPool.paymentAmount,
          value: data.subPool.value
        });
      }
      else {
        SubPools.collection.update({ subPoolId: data.supPoolId },{ $set: {
          numberOfMembers: data.subPool.numberOfMembers,
          value: data.subPool.value
        }})
      }
    }
    else if(data.event === "Activated" && Tokens.collection.findOne({ nft_id: data.tokenId })) {
      Tokens.collection.update({ nft_id: data.tokenId }, { $set: { activated:true, inprogress:false } });

      if( ! SubPools.collection.findOne({ subPoolId: data.supPoolId }) ) {
        SubPools.collection.insert({
          subPoolId: data.supPoolId,
          inprogress: false,
          created: data.subPool.created,
          closed: data.subPool.closed,
          numberOfMembers: data.subPool.numberOfMembers,
          numberOfActivated: data.subPool.numberOfActivated,
          debitValue: data.subPool.debitValue,
          paymentAmount: data.subPool.paymentAmount,
          value: data.subPool.value
        });
      }
      else {
        SubPools.collection.update({ subPoolId: data.supPoolId },{ $set: {
          numberOfActivated: data.subPool.numberOfActivated
        }})
      }
    }
    else if(data.event === "Funded" && SubPools.collection.findOne({ subPoolId: data.supPoolId })) {
      
      SubPools.collection.update({ subPoolId: data.supPoolId },{ $set: {
        closed: data.subPool.closed,
        inprogress: false,
        debitValue: data.subPool.debitValue,
        paymentAmount: data.subPool.paymentAmount
      }})
    
    }
    else if(data.event === "Paid" && Tokens.collection.findOne({ nft_id: data.tokenId })) {
      Tokens.collection.update({ nft_id: data.tokenId }, { $set: { paid:true, inprogress:false } });

      if( ! SubPools.collection.findOne({ subPoolId: data.supPoolId }) ) {
        SubPools.collection.insert({
          subPoolId: data.supPoolId,
          inprogress: false,
          created: data.subPool.created,
          closed: data.subPool.closed,
          numberOfMembers: data.subPool.numberOfMembers,
          numberOfActivated: data.subPool.numberOfActivated,
          debitValue: data.subPool.debitValue,
          paymentAmount: data.subPool.paymentAmount,
          value: data.subPool.value
        });
      }
      else {
        SubPools.collection.update({ subPoolId: data.supPoolId },{ $set: {
          value: data.subPool.value
        }})
      }
    }
    else {
      console.error(`methods-token: Can't process event ${data.event} `);
    }
  }));
}

Meteor.methods({

  createToken: function (clientId:string) {
    check(clientId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;

    if (role !== Role.PARTNER)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const token = Tokens.collection.findOne({ user_id: clientId });

    if (token)
      throw new Meteor.Error('404', 'Token already created!');

    const client = Users.collection.findOne(clientId);

    if (! client) 
      throw new Meteor.Error('404', 'No such user!');
  
    if (! client.profile || client.profile.role != Role.CLIENT)
      throw new Meteor.Error('400', 'That user is not client...');
  
    if (! client.profile || client.profile._createdBy != this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    if (Meteor.isServer) {
      tokenLoyalty.setData({member:ownerAddress, clientId:clientId, partner:this.userId}, (result) => {
        console.log(`methods-token: createToken TX: ${result.tx}`);
      }); 
    }
  },

  activateToken: function (tokenId:string) {
    check(tokenId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;

    if (role !== Role.PARTNER)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const token = Tokens.collection.findOne({ nft_id: tokenId });

    if (!token)
      throw new Meteor.Error('404', 'Token is not created!');

    if (Meteor.isServer) {
      tokenLoyalty.activate({tokenId:tokenId}, (result) => {
        console.log(`methods-token: activateToken TX: ${result.tx}`);
      }); 
    }
  },

  changeToken: function (tokenId:string) {
    check(tokenId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;
    const token = Tokens.collection.findOne({ nft_id: tokenId });

    if (!token)
      throw new Meteor.Error('404', 'Token is not created!');

    if (role === Role.CLIENT && token.user_id !== this.userId)
      throw new Meteor.Error('405', 'CLIENT: Not authorized!');

    if (role === Role.PARTNER && token._createdBy !== this.userId)
      throw new Meteor.Error('405', 'PARTNER: Not authorized!');
    
    Tokens.collection.update({ nft_id: tokenId }, { $set: { inprogress:true } });
    
  },

  changeSubPool: function (subPoolId:string) {
    check(subPoolId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;

    if (role !== Role.OWNER)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const subpool = SubPools.collection.findOne({ subPoolId: subPoolId });

    if (!subpool)
      throw new Meteor.Error('404', 'SubPool is not created!');
    
    SubPools.collection.update({ subPoolId: subPoolId }, { $set: { inprogress:true } });
    
  },

  fundSubPool: function (subPoolId:string, payment:string, debit:string, value:string) {
    check(subPoolId, String);
    check(payment, String);
    check(debit, String);
    check(value, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;

    if (role !== Role.OWNER)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const subpool = SubPools.collection.findOne({ subPoolId: subPoolId });

    if (!subpool)
      throw new Meteor.Error('404', 'SubPool is not created!');

    if (Meteor.isServer) {
      tokenLoyalty.fund({subPoolId: subPoolId, payment:payment, debit:debit, value:value}, (result) => {
        console.log(`methods-token: fundSubPool TX: ${result.tx}`);
      }); 
    }

  },

  payToken: function (tokenId:string) {
    check(tokenId, String);

    const user = Users.collection.findOne(this.userId);
    const role = user && user.profile && user.profile.role;

    if (role !== Role.CLIENT)
      throw new Meteor.Error('405', 'Not authorized!');
 
    const token = Tokens.collection.findOne({ nft_id: tokenId, user_id : this.userId });

    if (!token)
      throw new Meteor.Error('404', 'Token is not created or wrong user_id!');

    if (Meteor.isServer) {
      tokenLoyalty.payment({tokenId:tokenId, owner_address:ownerAddress}, (result) => {
        console.log(`methods-token: payToken TX: ${result.tx}`);
      }); 
    }
  },
  
});