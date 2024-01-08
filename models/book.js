const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    genre: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    thumb: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: 0,
    },
    totalRating: {
        type: Number,
        default: 0,
    },
    publication_date: {
        type: Date,
        default: Date.now()
    },
    totalPage: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Book', bookSchema);