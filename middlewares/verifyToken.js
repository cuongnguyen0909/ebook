const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {//Bearer token
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    status: false,
                    message: 'Invalid access token'
                });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: false,
            message: 'Required authentication'
        });
    }
});

module.exports = {
    verifyAccessToken
};
