import Web3             from 'web3';
import contract         from 'truffle-contract';
import HDWalletProvider from 'truffle-hdwallet-provider';

const mnemonic = "first mix any adult deal sand brand about window will casual second";
declare function require(url: string);

export default class SimpleStorage {

  readonly SimpleStorageArtifact = require('./build/contracts/SimpleStorage.json');

  protected web3Provider = new HDWalletProvider(mnemonic, "http://localhost:8545");
  protected address = this.web3Provider.addresses[0];

  protected web3 = new Web3(this.web3Provider);

  protected contract = contract(this.SimpleStorageArtifact);
  protected instance = undefined;
  protected data = undefined;

  constructor() {    
    console.log(`Set provider with address: ${this.address}`);    
    this.contract.setProvider(this.web3.currentProvider);

    const that = this;

    this.contract.deployed()
    .then((instance) => {
      console.log('SimpleStorage: instance is ready');
      that._setInstance(instance);
      that._refreshData();
      instance.StorageSet()
      .watch((err, responce) => {
        if(err) {
          console.error(err)
        }
        else {
          that._refreshData();
          console.log(responce.args._message)
        }
      });
    });
  }

  getData() {
    return this.data;
  }

  _setData(data) {
    if(this.data !== data) {
      this.data = data;
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
    const that = this;

    if(this.instance === undefined) return;

    this.instance.storedData.call()
      .then(result => that._setData(result))
      .catch(error => console.error(error));
  }

  setData(data, cb) {

    const that = this;
    if(this.instance === undefined) {

      this.contract.deployed()
      .then(function(instance) {
        instance.set(data, {from: that.address})
        .then(result => cb(result))
        .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
    }
    else {
      this.instance.set(data, {from: that.address})
        .then(result => cb(result))
        .catch(error => console.error(error));
    }
  }

};
