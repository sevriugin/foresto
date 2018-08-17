import Web3             from 'web3';
import contract         from 'truffle-contract';
import HDWalletProvider from 'truffle-hdwallet-provider';

import TokenLoyaltyArtifact from './build/contracts/TokenLoyalty.json';

const mnemonic = "first mix any adult deal sand brand about window will casual second";
const rinkeby = "https://rinkeby.infura.io/fyE6fpwJWFc6fBYSet1w";
const localhost = "http://localhost:8545";

export default class TokenLoyalty {

  constructor() {

    this.instance = undefined;
    this.data = undefined;    
    this.web3Provider = new HDWalletProvider(mnemonic, rinkeby);
    this.address = this.web3Provider.addresses[0];
    console.log(`Set provider with address: ${this.address}`);
    
    this.web3 = new Web3(this.web3Provider);

    this.contract = contract(TokenLoyaltyArtifact);
    this.contract.setProvider(this.web3.currentProvider);
    this.watch = undefined;

    const that = this;

    this.contract.deployed()
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
          that._setData({ tx:responce.transactionHash, tokenId:responce.args.tokenId.toString(), supPoolId:responce.args.supPoolId.toString(), member:responce.args.member, clientId:responce.args.clientId });
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
    console.log(`TokenLoyalty:setData data.member:${data.member} data.clientId:${data.clientId} from:${that.address}`);
    if(this.instance === undefined) {
      this.contract.deployed()
      .then(function(instance) {
        instance.create(data.member, data.clientId, {from: that.address, gas:500000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.create(data.member, data.clientId, {from: that.address, gas:500000, gasPrice:"20000000000"})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

};
