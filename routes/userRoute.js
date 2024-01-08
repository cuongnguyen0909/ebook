const router = require('express').Router();
const userController = require('../controllers/userController')
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', verifyAccessToken, isAdmin, userController.getAllUser)


module.exports = router;