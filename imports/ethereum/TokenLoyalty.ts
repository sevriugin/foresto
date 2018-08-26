import { Meteor } from 'meteor/meteor';

declare function require(url: string);

export default class TokenLoyalty {

  protected instance;
  protected data;
  protected web3Provider;
  protected address;
  protected tokenAddr;
  protected web3;
  protected contr;
  protected watch;
  protected partner;

  readonly HDWalletProvider = require('truffle-hdwallet-provider');
  readonly Web3 = require('web3');
  readonly contract = require('truffle-contract');
  readonly moment = require('meteor/momentjs:moment');

  readonly TokenLoyaltyArtifact = require('./build/contracts/TokenLoyalty.json');

  constructor() {

    this.web3Provider = new this.HDWalletProvider(Meteor.settings.mnemonic, Meteor.settings.networks.rinkeby, 0, 2);
    this.address = this.web3Provider.addresses[0];
    this.tokenAddr = this.web3Provider.addresses[1];
    console.log(`Set provider with contract owner: [${this.address}] and token owner: [${this.tokenAddr}]`);
    
    this.web3 = new this.Web3(this.web3Provider);

    this.contr = this.contract(this.TokenLoyaltyArtifact);
    this.contr.setProvider(this.web3.currentProvider);
    this.watch = undefined;
    this.partner = undefined;

    const that = this;

    this.contr.deployed()
    .then(function(instance) {
      console.log('TokenLoyalty: instance is ready');
      that._setInstance(instance);
      that._refreshData();

      instance.Created()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          console.log(`Loyalty Token TX: ${responce.transactionHash}`);
          console.log(`Loyalty Token ID ${responce.args.tokenId.toString()} is created. Sub Pool ID ${responce.args.supPoolId.toString()}. Address ${responce.args.member}. Client ID ${responce.args.clientId}`);
          
          that.getSubPoolInfo(responce.args.supPoolId.toString(), (result) => {
            const timestamp = this.moment.unix(result[0].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const closure = this.moment.unix(result[1].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const subPool = {
              created:timestamp,
              closed:closure,
              numberOfMembers:result[2].toString(),
              numberOfActivated:result[3].toString(),
              debitValue:result[4].toString(),
              paymentAmount:result[5].toString(),
              value:result[6].toString()
            };
            that._setData({ event:responce.event, partner:that.partner, tx:responce.transactionHash, tokenId:responce.args.tokenId.toString(), supPoolId:responce.args.supPoolId.toString(), member:responce.args.member, clientId:responce.args.clientId, subPool:subPool });
          });
        }
      });

      instance.Activated()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          console.log(`Loyalty Token TX: ${responce.transactionHash}`);
          console.log(`Loyalty Token ID ${responce.args.tokenId.toString()} is activated. Sub Pool ID ${responce.args.subPoolId.toString()}`);

          that.getSubPoolInfo(responce.args.subPoolId.toString(), (result) => {
            const timestamp = this.moment.unix(result[0].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const closure = this.moment.unix(result[1].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const subPool = {
              created:timestamp,
              closed:closure,
              numberOfMembers:result[2].toString(),
              numberOfActivated:result[3].toString(),
              debitValue:result[4].toString(),
              paymentAmount:result[5].toString(),
              value:result[6].toString()
            };
            that._setData({ event:responce.event ,tx:responce.transactionHash, tokenId:responce.args.tokenId.toString(), supPoolId:responce.args.subPoolId.toString(), subPool:subPool});
          });
        }
      });

      instance.Funded()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          console.log(`Loyalty SubPool TX: ${responce.transactionHash}`);
          console.log(`Loyalty SubPool ID ${responce.args.subPoolId.toString()} is funded.`);

          that.getSubPoolInfo(responce.args.subPoolId.toString(), (result) => {
            const timestamp = this.moment.unix(result[0].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const closure = this.moment.unix(result[1].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const subPool = {
              created:timestamp,
              closed:closure,
              numberOfMembers:result[2].toString(),
              numberOfActivated:result[3].toString(),
              debitValue:result[4].toString(),
              paymentAmount:result[5].toString(),
              value:result[6].toString()
            };
            that._setData({ event:responce.event ,tx:responce.transactionHash, supPoolId:responce.args.subPoolId.toString(), subPool:subPool});
          });
        }
      });
      
      instance.Paid()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          console.log(`Loyalty Token TX: ${responce.transactionHash}`);
          console.log(`Loyalty Token ID ${responce.args.tokenId.toString()} is paid.`);

          that.getSubPoolInfo(responce.args.subPoolId.toString(), (result) => {
            const timestamp = this.moment.unix(result[0].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const closure = this.moment.unix(result[1].toString()).format("MMMM Do YYYY, h:mm:ss a");
            const subPool = {
              created:timestamp,
              closed:closure,
              numberOfMembers:result[2].toString(),
              numberOfActivated:result[3].toString(),
              debitValue:result[4].toString(),
              paymentAmount:result[5].toString(),
              value:result[6].toString()
            };
            that._setData({ event:responce.event ,tx:responce.transactionHash, tokenId:responce.args.tokenId.toString(), supPoolId:responce.args.subPoolId.toString(), subPool:subPool});
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

  setData(data, cb) {

    const that = this;

    console.log(`TokenLoyalty:setData data.member:${data.member} data.clientId:${data.clientId} from:${that.address} partner:${data.partner}`);
    this.partner = data.partner;

    if(this.instance === undefined) {
      this.contr.deployed()
      .then(function(instance) {
        instance.create(data.member, data.clientId, {from: that.address, gas:900000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.create(data.member, data.clientId, {from: that.address, gas:900000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

  activate(data, cb) {

    const that = this;
    console.log(`TokenLoyalty:activate data.tokenId:${data.tokenId}`);
    if(this.instance === undefined) {

      this.contr.deployed()
      .then(function(instance) {
        instance.activate(data.tokenId, {from: that.address, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.activate(data.tokenId, {from: that.address, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

  getSubPoolInfo(subPoolId, cb) {

    const that = this;
    console.log(`TokenLoyalty:getSubPoolInfo data.subPoolId:${subPoolId}`);
    if(this.instance === undefined) {

      this.contr.deployed()
      .then(function(instance) {
        instance.getSubPoolExtension.call(subPoolId)
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.getSubPoolExtension.call(subPoolId)
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

  fund(data, cb) {

    const that = this;
    console.log(`TokenLoyalty:fund data.fund:${data.subPoolId}`);
    if(this.instance === undefined) {

      this.contr.deployed()
      .then(function(instance) {
        instance.fund(data.subPoolId, data.payment, data.debit, {from: that.address, value: data.value, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.fund(data.subPoolId, data.payment, data.debit, {from: that.address, value: data.value, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

  payment(data, cb) {

    const that = this;
    console.log(`TokenLoyalty:payment data.tokenId:${data.tokenId}`);

    if(this.instance === undefined) {

      this.contr.deployed()
      .then(function(instance) {
        instance.payment(data.tokenId, {from: this.tokenAddr, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.payment(data.tokenId, {from: this.tokenAddr, gas:700000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

}
