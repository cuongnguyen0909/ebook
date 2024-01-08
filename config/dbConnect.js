const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const dbConnect = asyncHandler(async () => {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    try {
        if (connection.connection.readyState === 1) {
            console.log('MongoDB connected!');
        } else {
            console.log('MongoDB not connected!');
        }
    } catch (error) {
        console.log('Error: ' + error);
        throw new Error(error);
    }
})

module.exports = { dbConnect };