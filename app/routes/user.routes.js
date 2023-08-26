const { Router } = require('express');
const router = Router();
const userController = require('./../controllers/user.controller.js');
const { verifySingUp, verifyToken, verifyIdentity } = require('./../middleware/index.js');

router.post('/signin', userController.signIn);
router.post('/signup', verifySingUp, userController.createUser);
router.get('/user', verifyToken, userController.findAll);
router.get('/user/:id', [verifyToken, verifyIdentity], userController.findUserById);
router.put('/user/:id', [verifyToken, verifyIdentity], userController.updateUserById);
router.delete('/user/:id', [verifyToken, verifyIdentity], userController.deleteUserById);

module.exports = router;
