const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 3019;
const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.once('open', () => {
    console.log("✅ MongoDB connection successful");
});

// Schema
const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    roll: String,
    phone: String,
    section: String,
    semester: Number,
    dob: String,
    branch: String,
    subjects: [
        {
            code: String,
            name: String
        }
    ]
});

const Users = mongoose.model("data", userSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/post', async (req, res) => {
    let subjects = [];

    if (req.body.subjects) {
        let subjArray = Array.isArray(req.body.subjects) ? req.body.subjects : [req.body.subjects];
        subjects = subjArray.map(s => {
            try {
                return JSON.parse(decodeURIComponent(s));
            } catch (err) {
                console.error("❌ Failed to parse subject:", s, err);
                return null;
            }
        }).filter(Boolean);
    }

    const user = new Users({
        regd_no: req.body.regd_no,
        name: req.body.name,
        email: req.body.email,
        roll: req.body.roll,
        phone: req.body.phone,
        section: req.body.section,
        semester: Number(req.body.semester) || null,
        dob: req.body.dob,
        branch: req.body.branch,
        subjects
    });

    try {
        await user.save();
        console.log("✅ Data saved to MongoDB:", user);
        res.send("Form submission successful");
    } catch (err) {
        console.error("❌ Error saving to MongoDB:", err);
        res.status(500).send("Error saving data");
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
