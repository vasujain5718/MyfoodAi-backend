const mongoose = require('mongoose');
const { Schema } = mongoose;

const FoodSchema = new Schema({
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    recipelink: { type: String, required: true },
    macros: {
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Item', FoodSchema);