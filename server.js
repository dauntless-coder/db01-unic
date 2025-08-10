const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const port = 3019

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/students')
const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful")
})

const userSchema = new mongoose.Schema({
    regd_no: String,
    name: String,
    email: String,
    branch: String,
});

const Users = mongoose.model("data", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'))        
})

app.post('/post', async (req, res)=>{
    const{ regd_no, name, email, branch } = req.body;
    const user = new Users({
        regd_no: req.body.regd_no,
        name: req.body.name,
        email: req.body.email,
        branch: req.body.branch,
    });
    await user.save ();
    console.log(user);
    res.send("Form submission successful");

})

    

app.listen(port, () => {
    console.log("Server started")
    })

