import { check }  from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { Owners, Partners, Clients,
         Tokens, SubPools, Users }         from '../collections';
import { Owner, OWNER_SELECTOR,
         Partner, PARTNER_SELECTOR,
         Client, CLIENT_SELECTOR }  from '../models';

import TokenLCST from 'imports/ethereum/TokenLCST';

let tokenLCST;

if (Meteor.isServer) {

  tokenLCST = new TokenLCST();
  
}

Meteor.methods({

});