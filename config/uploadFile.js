const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.epub' || ext === ".pdf") {
            cb(null, 'ebooks')
        } else if (['.jpg', '.png', '.jpeg', '.webp', '.gif'].includes(ext)) {
            cb(null, 'images')
        } else {
            cb(new Error('Invalid file type'), false)
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })
module.exports = upload;