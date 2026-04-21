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

const Group = mongoose.model('Group', new mongoose.Schema({
    groupName: String,
    groupAdmin: String,
    members: [String]
}))

app.post('/register', async (req, res) => {
    try {

        const { email, username, password, isAdmin } = req.body;

        const obstojecUporabnik = await User.findOne({ $or: [{ email }, { username }] });
        if (obstojecUporabnik) {
            return res.status(400).json({ error: "Uporabnik že obstaja!" });
        }

        const noviUporabnik = new User({
            email,
            username,
            password,
            isAdmin: isAdmin || false
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
                isAdmin: uporabnik.isAdmin
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


app.post('/create-group', async (req, res) => {
    try{
        const { groupName, groupAdmin, members } = req.body;
        const newGroup = new Group({ groupName, groupAdmin ,members });
        await newGroup.save();
        res.status(201).json({ message: "Skupina uspešno ustvarjena!" });
    } catch (err) {
        res.status(500).json({ error: "Napaka pri ustvarjanju skupine" });
    }
});


app.get('/groups/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const groups = await Group.find({
            $or: [
                { groupAdmin: username },
                { members: username }
            ]
        });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: "Napaka pri pridobivanju skupin" });
    }
});

app.get('/work/:username', async (req, res) => {

    try{
        const { username } = req.params;
        const work = await WorkLog.find({ assignedUser: username });
        res.json(work);
    }catch (err){
        res.status(500).json({ error: "Napaka pri pridbivanju dela" });
    }
});


app.listen(5001, () => console.log("Backend teče na portu 5001"));