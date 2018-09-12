import { Meteor }           from 'meteor/meteor';

declare function require(url: string);

export default class TokenLCST {

  readonly HDWalletProvider = require('truffle-hdwallet-provider');
  readonly Web3 = require('web3');
  readonly contract = require('truffle-contract');
  readonly moment = require('meteor/momentjs:moment');
  readonly TokenLoyaltyArtifact = require('./build/contracts/LCSToken.json');

  protected web3Provider = new this.HDWalletProvider(
    Meteor.settings.mnemonic, 
    Meteor.settings.networks.rinkeby,
    0, 2
  );
  protected address = this.web3Provider.addresses[0];
  protected tokenAddr = this.web3Provider.addresses[1];

  protected web3 = new this.Web3(this.web3Provider);
  protected contr = this.contract(this.TokenLoyaltyArtifact);

  protected instance = undefined;
  protected data = undefined;
  protected watch = undefined;
  protected partner = undefined;

  constructor() {

    console.log(`Set provider with contract LCST owner: [${this.address}]`);
    this.contr.setProvider(this.web3.currentProvider);

    if(this.instance === undefined) {
      this._deployed()
    }
  }

  _deployed() {
    const that = this;

    this.contr.deployed()
    .then(function(instance) {
      console.log(`LCSToken address: [${instance.address}]`);
      instance.RST().then(function(val) {
        console.log(`LCSToken RST address: [${val}]`);
      });
      instance.owner().then(function(val) {
        console.log(`LCSToken Owner address: [${val}]`);
      });
      instance.joinAmountRST().then(function(val) {
        console.log(`LCSToken Join Amount: ${val}`);
      });
      instance.appNumber().then(function(val) {
        const appNumber = parseInt(val, 10);
        console.log(`LCSToken Applications number: ${appNumber}`);
        if(appNumber > 0) {
          that.instance.fssf( {from: that.address, gas:900000, gasPrice:"20000000000"} )
            .then(result => {
              console.log(`LCSToken Scoring TX: ${result.tx}`);
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
      that._setInstance(instance);
      that._refreshData();

      instance.Apply()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          console.log(`LCSToken Appication TX: ${responce.transactionHash}`);
          console.log(`LCSToken Applicaton ID: ${responce.args.appId.toString()} from Address: ${responce.args.member}.`);
          that.instance.fssf( {from: that.address, gas:900000, gasPrice:"20000000000"} )
            .then(result => {
              console.log(`LCSToken Scoring TX: ${result.tx}`);
            })
            .catch(error => {
              console.error(error);
            });
        }
      });
    });
  }

  getData() {
    return this.data;
  }

  setWatch(cb) {
    this.watch = cb;
  }

  resetWatch() {
    this.watch = undefined;
  }

  _setData(data) {
    if(this.data !== data) {
      this.data = data;

      if(this.watch !== undefined) {
        this.watch(data);
      }

    }
  }

  _getInstance() {
    return this.instance;
  }

  _setInstance(instance) {
    if(this.instance !== instance) {
      this.instance = instance;
    }
  }

  _refreshData() {
    return;
  }

}
