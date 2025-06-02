const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../midware/fetchuser');
const JWT_SECRET = "vasu$loves@ashi!very*very=much";
// Route 1: Create a User using POST "/api/auth/createuser". No login required
router.post('/createuser',
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
    , async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ error: errors.array()[0].msg, success: false });
            }
            // Check if user already exists
            let user = await userModel.findOne({ email });
            if (user) {
                return res.status(400).json({ error: "User with this email already exists", success: false });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new user
            user = await userModel.create({
                name,
                email,
                password: hashedPassword
            });

            // Generate JWT token
            const authToken = jwt.sign({ id: user.id }, JWT_SECRET);

            res.json({ authToken, success: true });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Internal Server Error", success: false });
        }
    });
// Route 2: Authenticate a User using POST "/api/auth/login". No login required
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials", success: false });
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid credentials", success: false });
        }
        // Generate JWT token
        const authToken = jwt.sign({ id: user.id }, JWT_SECRET);
        res.json({ authToken, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error", success: false });
    }
}
);
// Route 3: Get logged-in user details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        // Fetch user details from the database
        const user = await userModel.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;