const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.epub') {
            cb(null, 'uploads/ebook')
        } else if (['.jpg', '.png', '.jpeg', '.webp', '.gif'].includes(ext)) {
            cb(null, 'uploads/images')
        } else {
            cb(new Error('Invalid file type'), false)
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage })
module.exports = upload;