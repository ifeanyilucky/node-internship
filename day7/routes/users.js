var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/:id/wallet', userController.createWallet);
router.get('/sign', userController.signUser);
router.get('/account', userController.getAccount);
router.get('/transfer', userController.transfer);

module.exports = router;
