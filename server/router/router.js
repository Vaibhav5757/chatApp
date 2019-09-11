const router = require("express").Router();
const userService = require("../services/userServices");
const { check, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const userModel = require("../app/model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config();

//connect to mongoDB database
mongoose.connect(process.env.DBPATH, { useNewUrlParser: true, useUnifiedTopology: true });


//database connected checking
let db = mongoose.connection;//an instance of mongoose
db.once("open", (err) => {
    if (err) return res.status(404).send(err);
});

//Remove Depreciated Warning while changing password
mongoose.set('useFindAndModify', false);

//Home Page of Users
router.get("/", (req, res) => {
    //find all the users and store their name and email-id in array and return the array 
    userModel.find({}, (err, users) => {
        var keys = Object.keys(users);
        var userArray = [];

        keys.forEach(element => {
            userArray.push({
                name: users[element].name,
                email: users[element].email
            })
        });

        return res.status(200).send(userArray);
    })
});


//Add a new user
router.post("/addUser", [check('email').isEmail(), check('password').isString().isLength({ min: 3 })],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        } else {

            //Check if the User with email ID exists
            var user = await userModel.findOne({ email: req.body.email });
            if (user) return res.status(400).send("User with this email ID already exists");

            return userService.addUser(req, res);
        }
    });


//Login with username and password to retrieve a token
router.post("/login", [check('email').isEmail(), check('password').isString().isLength({ min: 3 })],
    async (req, res) => {

        //Check if the User with email ID exists
        var user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(404).send("No user with this email found");

        //Compare the Password
        var validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send("Incorrect Password");

        //Generate Token and return the token
        try {
            var token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
            return res.header('auth-token', token).status(422).send(token);
        } catch (err) {
            res.status(422).send(err);
        }

    });

module.exports = router;