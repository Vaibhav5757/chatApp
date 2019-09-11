const router = require("express").Router();
const userService = require("../services/userServices");
const { check, validationResult } = require("express-validator")
const mongoose = require("mongoose");
const userModel = require("../app/model/userModel");

//connect to mongoDB database
mongoose.connect("mongodb://localhost:27017/chatApp", { useNewUrlParser: true, useUnifiedTopology: true });

//database connected checking
let db = mongoose.connection;
db.once("open", (err) => {
    if (err) console.log(err);
});

//Home Page of Users
router.get("/", (req, res) => {
    userModel.find({}, (err, users) => {
        var keys = Object.keys(users);
        var userMap = {};

        keys.forEach(element => {
            userMap[element] = {
                name: users[element].name,
                email: users[element].email
            }
        });

        res.send(userMap);
    })
});

//Add a new user
router.post("/addUser", [check('email').isEmail(), check('password').isString().isLength({ min: 3 })],
    (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        } else {
            res.status(200);
            userService.addUser(req, res);
        }
    });

module.exports = router;

function demo() {
    console.log("I'm here");
}