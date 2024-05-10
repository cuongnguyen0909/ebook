const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    status: {
        type: String,
        default: 'active',
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    passwordRegisterToken: {
        type: String,
        default: '',
    },
},
    {
        timestamps: true,
    }
);

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await password === this.password;
    },
}

//Export the model
module.exports = mongoose.model('User', userSchema);