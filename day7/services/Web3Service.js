const {Web3} = require('web3');
const { Wallet } = require('ethers');

class Web3Service {
  constructor() {
    this.web3 = new Web3('https://eth-sepolia.g.alchemy.com/v2/demo');
  }

  async createWallet() {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }

  async signMessage(privateKey, message) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    return account.sign(message);
  }

  async getBalance(address) {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async transfer(privateKey, toAddress, amount) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    const nonce = await this.web3.eth.getTransactionCount(account.address);
    const gasPrice = await this.web3.eth.getGasPrice();
    const value = this.web3.utils.toWei(amount.toString(), 'ether');

    const tx = {
      from: account.address,
      to: toAddress,
      value: value,
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce
    };

    const signedTx = await account.signTransaction(tx);
    return this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  }
}

module.exports = new Web3Service();
