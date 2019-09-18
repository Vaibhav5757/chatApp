/**
 * @description : Server
 * @author : Vaibhav Pratihar
 * @since : 08/20/19
 */

const express = require("express");
const userRoute = require("../server/router/router")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const validator = require("express-validator")
require("dotenv").config();

//Start the server
app = express();

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Use express Validator
app.use(validator());

//Connect to Database
mongoose.connect(process.env.DBPATH,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true//used for unique entities in Schema
    }).catch(error => console.error(error));//Handling Initial Errors in Connecting to Databases

//Successful Connection to Database
mongoose.connection.on('open', () => {
    console.log("Connected to database");
    mongoose.set('useFindAndModify', false);//Remove Depreciated Warning while changing password

});

//Database disconnected or Database Off
mongoose.connection.on('disconnected', () => {
    console.log("Database Offline");
});

//Error in connecting to Database
mongoose.connection.on('error', (err) => {
    if (err) {
        console.log("There was an error connecting to database");
    }
});


//Home Page
app.get("/", (req, res) => {
    res.send("Welcome to Home-Page");
});

//To access data on client side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Route for adding a new User
app.use("/users", userRoute);

//Start the server
const port = process.env.PORT || 3000;
app.listen(port, console.log("Listening on " + port));

