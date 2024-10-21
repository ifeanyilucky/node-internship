const { User } = require('../models');
const Web3Service = require('../services/Web3Service');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createWallet = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const wallet = await Web3Service.createWallet();
    user.wallet_id = wallet.address;
    await user.save();
    res.json({ address: wallet.address, privateKey: wallet.privateKey });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.signUser = async (req, res) => {
  try {
    const { private_key } = req.query;
    const message = 'Sign this message to authenticate';
    const signature = await Web3Service.signMessage(private_key, message);
    res.json(signature);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const { private_key } = req.query;
    const account = Web3Service.web3.eth.accounts.privateKeyToAccount(private_key);
    const balance = await Web3Service.getBalance(account.address);
    res.json({ address: account.address, balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { private_key, to_address, amount } = req.query;
    const result = await Web3Service.transfer(private_key, to_address, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
