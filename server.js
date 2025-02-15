require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// ✅ Ensure only ONE connection to MongoDB
if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch(err => console.error("MongoDB Connection Error:", err));
}

// Define Models
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
}));

const Booking = mongoose.model('Booking', new mongoose.Schema({
    username: String,
    doctor: String,
    time: String,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists." });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.json({ success: true, message: "Registration successful!" });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    res.json({ success: true });
});

app.post('/book', async (req, res) => {
    await new Booking(req.body).save();
    res.sendStatus(200);
});

app.get('/bookings', async (req, res) => {
    const bookings = await Booking.find({ username: req.query.username });
    res.json(bookings);
});

app.get('/download-unity', (req, res) => {
    res.download(path.join(__dirname, 'Reflective_Care.unitypackage'));
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
