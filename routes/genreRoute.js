const router = require('express').Router();
const genreController = require('../controllers/genreController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
// const upload = require('../config/cloudinary.config');
const uploadFile = require('../config/uploadFile');
router.post('/', verifyAccessToken, isAdmin, uploadFile.single('thumb'), genreController.createGenre);
router.get('/', genreController.getAllGenres);
// router.put('/ratings', verifyAccessToken, bookController.ratingBook);
// router.get('/:bid', bookController.getOneBook);
router.put('/:gid', verifyAccessToken, isAdmin, uploadFile.single('thumb'), genreController.updateGenre);
router.delete('/:gid', verifyAccessToken, isAdmin, genreController.deleteGenre);

module.exports = router;