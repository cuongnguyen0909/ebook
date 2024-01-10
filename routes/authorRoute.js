const router = require('express').Router();
const authorController = require('../controllers/authorController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
// const upload = require('../config/cloudinary.config');
const uploadFile = require('../config/uploadFile');
router.post('/', verifyAccessToken, isAdmin, uploadFile.single('thumb'), authorController.createAuthor);
router.get('/', authorController.getAllAuthors);
// router.put('/ratings', verifyAccessToken, bookController.ratingBook);
// router.get('/:bid', bookController.getOneBook);
router.put('/:gid', verifyAccessToken, isAdmin, authorController.updateAuthor);
router.delete('/:gid', verifyAccessToken, isAdmin, authorController.deleteAuthor);

module.exports = router;