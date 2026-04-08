const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/')
    .then(() => console.log("Povezan na MongoDB!"))
    .catch(err => console.error("Napaka pri povezavi:", err));

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        const uporabnik = await User.findOne({email: email});

        if(uporabnik){
            return res.status(400).json({ error: "Uporabnik s tem e-naslovom že obstaja!" });
        }

        const noviUporabnik = new User({
            email: email,
            password: password
        });

        await noviUporabnik.save();

        res.status(201).json({ message: "Uporabnik uspešno shranjen v bazo!" });
    } catch (error) {
        console.error("Napaka pri shranjevanju:", error);
        res.status(500).json({ error: "Uporabnik ze obstaja" });
    }

});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Poišči uporabnika v bazi
        const uporabnik = await User.findOne({ email: email });

        if (!uporabnik) {
            return res.status(401).json({ error: "Napačen e-naslov ali geslo!" });
        }

        if (uporabnik.password !== password) {
            return res.status(401).json({ error: "Napačen e-naslov ali geslo!" });
        }
        res.status(200).json({
            message: "Prijava uspešna!",
            user: { email: uporabnik.email }
        });

    } catch (error) {
        console.error("Napaka pri prijavi:", error);
        res.status(500).json({ error: "Napaka na strežniku." });
    }
});

app.listen(5000, () => console.log("Backend teče na portu 5000"));