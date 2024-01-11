const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
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
        required: true,
    },
    fileReader: {
        type: String,
        default: '',
        required: true,
    },
    ratings: [
        {
            star: {
                type: Number
            },
            ratingBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String
            },
            updateAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
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
    totalView: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Book', bookSchema);