const { Router } = require('express');
const router = Router();
const bootcampController = require('./../controllers/bootcamp.controller.js');
const { verifyToken } = require('./../middleware/index.js');

router.get('/', bootcampController.findAll);
router.get('/:id', verifyToken, bootcampController.findById);
router.post('/', verifyToken, bootcampController.createBootcamp);
router.post('/adduser', verifyToken, bootcampController.addUser);

module.exports = router;
