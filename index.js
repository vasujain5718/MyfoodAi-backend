const connectToMongo=require('./db');
connectToMongo();
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const port = 5000;
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/food', require('./routes/Favs'));
app.post('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})