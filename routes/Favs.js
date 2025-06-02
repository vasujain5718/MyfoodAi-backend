const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const ItemModel = require('../models/Item');
const fetchuser = require('../midware/fetchuser');
router.post('/addfav', fetchuser, async (req, res) => {
    const { name, imageUrl, recipelink, macros, id } = req.body;
    try {
        // Check if item already exists
        let item = await ItemModel.findOne
            ({ id });
        if (!item) {
            item = await ItemModel.create({
                name,
                id,
                imageUrl,
                recipelink,
                macros
            });
        }
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }
        // Check if item already exists in user's favorites
        if (user.favoriteRecipes.includes(item.id)) {
            return res.status(400).json({ error: "Item already in favorites", success: false });
        }
        // Add item to user's favorites
        user.favoriteRecipes.push(item.id);
        await user.save();
        res.json({ item, success: true });
    } catch (error) {
        console.error('Error in /addfav:', error.message, error);
        res.status(500).send({ error: error.message || "Internal Server Error", success: false });
    }
});
router.put('/removefav', fetchuser, async (req, res) => {
    const { id } = req.body;
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }
        // Check if item exists in user's favorites
        const itemIndex = user.favoriteRecipes.indexOf(id);
        if (itemIndex === -1) {
            return res.status(400).json({ error: "Item not found in favorites", success: false });
        }
        // Remove item from user's favorites
        user.favoriteRecipes.splice(itemIndex, 1);
        await user.save();
        res.json({ user, success: true });
    } catch (error) {
        res.status(500).send({ error: 'Error in /removefav:', success: false });
    }
});
router.get('/getfav', fetchuser, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" , success: false });
        }
        res.json({ favoriteRecipes: user.favoriteRecipes, success: true });
    } catch (error) {
        console.error('Error in /getfav:', error.message, error);
        res.status(500).send({error : error.message || "Internal Server Error", success: false});
    }
});
router.post('/getinfo', async (req, res) => {
    try {
        const item = await ItemModel.findOne({ id: req.body.id });
        if (!item) {
            return res.status(404).json({ error: "Item not found", success: false });
        }
        res.json({ item, success: true });
    } catch (error) {
        console.error('Error in /getinfo:', error.message, error);
        res.status(500).send({ error: error.message || "Internal Server Error", success: false });
    }
});
module.exports = router;