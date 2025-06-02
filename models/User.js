const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    favoriteRecipes: [{ type: String, ref: 'Item' }]
});

module.exports = mongoose.model('User', User);