const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Povezan na MongoDB!"))
    .catch(err => console.error("Napaka pri povezavi:", err));

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
}));

const WorkLog = mongoose.model('WorkLog', new mongoose.Schema({
    clientName: String,
    time: Date,
    pickupAddress: String,
    destinationAddress: String,
    assignedUser: String
}));

// TUKAJ MORAJO BITI POTI Z /_/backend/
app.post('/register', async (req, res) => {
    try {
        // Spremeni to vrstico (dodaj isAdmin)
        const { email, username, password, isAdmin } = req.body;

        const obstojecUporabnik = await User.findOne({ $or: [{ email }, { username }] });
        if (obstojecUporabnik) {
            return res.status(400).json({ error: "Uporabnik že obstaja!" });
        }

        // Dodaj isAdmin v nov objekt
        const noviUporabnik = new User({
            email,
            username,
            password,
            isAdmin: isAdmin || false // Privzeto false, če ni označeno
        });

        await noviUporabnik.save();
        res.status(201).json({ message: "Uporabnik uspešno shranjen!" });
    } catch (error) {
        res.status(500).json({ error: "Napaka na strežniku." });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const uporabnik = await User.findOne({ username });

        if (!uporabnik || uporabnik.password !== password) {
            return res.status(401).json({ error: "Napačni podatki" });
        }
        res.status(200).json({
            user: {
                username: uporabnik.username,
                isAdmin: uporabnik.isAdmin // Zdaj bo frontend vedel za to!
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Napaka" });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        res.json(users);
    } catch (err) { res.status(500).json({ error: "Napaka" }); }
});

app.post('/create-work', async (req, res) => {
    try {
        const noviLog = new WorkLog(req.body);
        await noviLog.save();
        res.status(201).json({ message: "Termin ustvarjen!" });
    } catch (err) { res.status(500).json({ error: "Napaka" }); }
});

app.listen(5001, () => console.log("Backend teče na portu 5001"));