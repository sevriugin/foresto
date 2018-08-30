import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { Owners, Partners, Clients,
         Tokens, SubPools, Users }         from '../collections';
import { Owner, OWNER_SELECTOR,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR }  from '../models';

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

      Clients.collection.update({ _id: data.clientId }, { $set: { 'profile.inprogress': false } });

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

      Tokens.collection.update({ nft_id: data.tokenId }, { $set: { activated: true, inprogress: false } });

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
      
      Tokens.collection.update({ nft_id: data.tokenId }, { $set: { paid: true, inprogress: false } });

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

  createToken: (clientId: string) => {
    check(clientId, String);

    const partner: Partner = Partners.findOne(
      Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
    );
    if (! partner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
 
    const token = Tokens.findOne({ user_id: clientId });
    if (token) {
      throw new Meteor.Error('406', 'Token already created!');
    }

    const client: Client = Clients.findOne(
      Object.assign({ _id: clientId }, CLIENT_SELECTOR)
    );
    if (! client) {
      throw new Meteor.Error('404', 'No such client!');
    }
    if (! client.profile || client.profile._createdBy != Meteor.userId()) {
      throw new Meteor.Error('403', 'No permissions!');
    }

    if (Meteor.isServer) {

      console.log('calling set data');
      tokenLoyalty.setData({ member: ownerAddress, clientId: clientId, partner: Meteor.userId() }, (result) => {

        console.log(`methods-token: createToken TX: ${result.tx}`);
      }); 
    }
  },

  activateToken: (tokenId: string) => {
    check(tokenId, String);

    const partner: Partner = Partners.findOne(
      Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
    );
    if (! partner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
 
    const token = Tokens.findOne({ nft_id: tokenId });
    if (! token) {
      throw new Meteor.Error('404', 'Token is not created!');
    }

    if (Meteor.isServer) {
      tokenLoyalty.activate({tokenId: tokenId}, (result) => {

        console.log(`methods-token: activateToken TX: ${result.tx}`);
      }); 
    }
  },

  changeToken: (tokenId: string, inprogress: boolean = true, error_message: string = '') => {
    check(tokenId, String);
    check(inprogress, Boolean);
    check(error_message, String);

    const token = Tokens.findOne({ nft_id: tokenId });
    if (! token) {
      throw new Meteor.Error('404', 'Token is not created!');
    }

    const client: Client = Clients.findOne(
      Object.assign({ _id: Meteor.userId() }, CLIENT_SELECTOR)
    );
    if (client && token.user_id !== Meteor.userId()) {
      throw new Meteor.Error('415', 'Not authorized!');
    }
    const partner: Partner = Partners.findOne(
      Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
    );
    if (partner && token._createdBy !== Meteor.userId()) {
      throw new Meteor.Error('425', 'Not authorized!');
    }
    if (! partner && ! client) {
      throw new Meteor.Error('435', 'Not authorized!');
    }
    
    Tokens.update({ nft_id: tokenId }, { $set: { inprogress: inprogress, error_message: error_message } });
  },

  changeSubPool: (subPoolId: string, inprogress: boolean = true, error_message: string = '') => {
    check(subPoolId, String);
    check(inprogress, Boolean);
    check(error_message, String);

    const owner: Owner = Owners.findOne(
      Object.assign({ _id: Meteor.userId() }, OWNER_SELECTOR)
    );
    if (! owner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
  
    const subpool = SubPools.findOne({ subPoolId: subPoolId });
    if (! subpool) {
      throw new Meteor.Error('404', 'SubPool is not created!');
    }
    
    SubPools.update({ subPoolId: subPoolId }, { $set: { inprogress: inprogress, error_message: error_message } });
  },

  fundSubPool: (subPoolId: string, payment: string, debit: string, value: string) => {
    check(subPoolId, String);
    check(payment, String);
    check(debit, String);
    check(value, String);

    const owner: Owner = Owners.findOne(
      Object.assign({ _id: Meteor.userId() }, OWNER_SELECTOR)
    );
    if (! owner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
 
    const subpool = SubPools.findOne({ subPoolId: subPoolId });
    if (! subpool) {
      throw new Meteor.Error('404', 'SubPool is not created!');
    }

    if (Meteor.isServer) {
      tokenLoyalty.fund({subPoolId: subPoolId, payment: payment, debit: debit, value: value}, (result) => {

        console.log(`methods-token: fundSubPool TX: ${result.tx}`);
      }); 
    }

  },

  payToken: (tokenId: string) => {
    check(tokenId, String);

    const client: Client = Clients.findOne(
      Object.assign({ _id: Meteor.userId() }, CLIENT_SELECTOR)
    );
    if (! client) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
 
    const token = Tokens.findOne({ nft_id: tokenId, user_id: this.userId });
    if (! token) {
      throw new Meteor.Error('404', 'Token is not created or wrong user_id!');
    }

    if (Meteor.isServer) {
      tokenLoyalty.payment({tokenId: tokenId, owner_address: ownerAddress}, (result) => {

        console.log(`methods-token: payToken TX: ${result.tx}`);
      }); 
    }
  },
  
  changeClient: (clientId: string, inprogress: boolean = true, error_message: string = '') => {
    check(clientId, String);
    check(inprogress, Boolean);
    check(error_message, String);

    const partner: Partner = Partners.findOne(
      Object.assign({ _id: Meteor.userId() }, PARTNER_SELECTOR)
    );
    if (! partner) {
      throw new Meteor.Error('405', 'Not authorized!');
    }
 
    const token = Tokens.findOne({ user_id: clientId });
    if (token) {
      throw new Meteor.Error('406', 'Token already created!');
    }

    const client: Client = Clients.findOne(
      Object.assign({ _id: clientId }, CLIENT_SELECTOR)
    );
    if (! client) {
      throw new Meteor.Error('404', 'No such client!');
    }
    if (! client.profile || client.profile._createdBy != Meteor.userId()) {
      throw new Meteor.Error('403', 'No permissions!');
    }
    
    Clients.update({ _id: clientId }, { $set: { 'profile.inprogress': inprogress, 'profile.error_message': error_message } });
  }
  
});