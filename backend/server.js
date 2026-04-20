const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(MONGODB_URI)
    .then(() => console.log("Povezan na MongoDB!"))
    .catch(err => console.error("Napaka pri povezavi:", err));

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const WorkLogSchema = new mongoose.Schema({
    clientName: String,
    time: Date,
    pickupAddress: String,
    destinationAddress: String,
    assignedUser: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // 1. Preveri, če kateri od podatkov že obstaja
        const obstojecUporabnik = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (obstojecUporabnik) {
            // Preverimo, kateri podatek je podvojen, da vrnemo točen error
            if (obstojecUporabnik.email === email) {
                return res.status(400).json({ error: "Uporabnik s tem e-naslovom že obstaja!" });
            }
            if (obstojecUporabnik.username === username) {
                return res.status(400).json({ error: "Uporabniško ime je že zasedeno!" });
            }
        }

        const noviUporabnik = new User({
            email,
            username,
            password
        });

        await noviUporabnik.save();
        res.status(201).json({ message: "Uporabnik uspešno shranjen v bazo!" });

    } catch (error) {
        console.error("Napaka pri shranjevanju:", error);

        // Če pride do napake pri unikatnih indeksih v MongoDB, ki je nismo ujeli zgoraj
        if (error.code === 11000) {
            return res.status(400).json({ error: "E-naslov ali uporabniško ime že obstaja!" });
        }

        // Za vse ostale napake (npr. izpad baze) vrnemo splošno napako
        res.status(500).json({ error: "Prišlo je do napake na strežniku." });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Poišči uporabnika v bazi
        const uporabnik = await User.findOne({ username: username });

        if (!uporabnik) {
            return res.status(401).json({ error: "Napačno uporabniško ime ali geslo!" });
        }

        if (uporabnik.password !== password) {
            return res.status(401).json({ error: "Napačno uporabniško ime ali geslo!" });
        }
        res.status(200).json({
            message: "Prijava uspešna!",
            user: { username: uporabnik.username }
        });

    } catch (error) {
        console.error("Napaka pri prijavi:", error);
        res.status(500).json({ error: "Napaka na strežniku." });
    }
});


const WorkLog = mongoose.model('WorkLog', WorkLogSchema);

/// ... (tvoj obstoječi začetek)

// 1. Pot za pridobivanje uporabnikov
app.get('/_/backend/users', async (req, res) => {
    try {
        const uporabniki = await User.find({}, 'username');
        res.status(200).json(uporabniki);
    } catch (error) {
        console.error("Napaka pri pridobivanju uporabnikov:", error);
        res.status(500).json({ error: "Napaka na strežniku." });
    }
});

app.post('/_/backend/create-work', async (req, res) => {
    try {
        const { clientName, time, pickupAddress, destinationAddress, assignedUser } = req.body;
        const noviLog = new WorkLog({ clientName, time, pickupAddress, destinationAddress, assignedUser });
        await noviLog.save();
        res.status(201).json({ message: "Termin uspešno ustvarjen!" });
    } catch (error) {
        res.status(500).json({ error: "Napaka pri shranjevanju termina." });
    }
});


app.listen(5001, () => console.log("Backend teče na portu 5001"));