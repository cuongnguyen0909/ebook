const router = require('express').Router();
const userController = require('../controllers/userController')
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const uploadImage = require('../config/uploadFile');

router.get('/', verifyAccessToken, isAdmin, userController.getUSers);
router.get('/current', verifyAccessToken, userController.getCurrentUser);
router.put('/current', verifyAccessToken, uploadImage.single("avatar"), userController.updateCurrentUser);
router.put('/changepassword', verifyAccessToken, userController.changePassword);
router.put('/wishlist/:bid', verifyAccessToken, userController.addToWishlist);
router.put('/:uid', verifyAccessToken, isAdmin, userController.updateUserByAdmin);
router.delete('/:uid', verifyAccessToken, isAdmin, userController.deleteUser);


module.exports = router;