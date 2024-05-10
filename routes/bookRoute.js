const router = require('express').Router();
const bookController = require('../controllers/bookController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const uploadFile = require('../config/uploadFile');
router.post('/', verifyAccessToken, isAdmin, uploadFile.fields([
    {
        name: 'thumb', maxCount: 1
    },
    {
        name: 'fileReader', maxCount: 1
    }
]), bookController.createBook);
router.get('/', bookController.getBooks);
router.put('/ratings', verifyAccessToken, bookController.ratingBook);
router.get('/:bid', bookController.getOneBook);
router.put('/:bid', verifyAccessToken, isAdmin, uploadFile.fields([
    {
        name: 'thumb', maxCount: 1
    },
    {
        name: 'fileReader', maxCount: 1
    }
]), bookController.updateBook);
router.delete('/:bid', verifyAccessToken, isAdmin, bookController.deleteBook);


module.exports = router;