/**
 * @description : Server
 * @author : Vaibhav Pratihar
 * @since : 08/20/19
 */

const express = require("express");
const userRoute = require("../server/router/router")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const validator = require("express-validator");
const userController = require("../server/controller/userController");
var socket = require("socket.io");
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


//To access data on client side - CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next();
});

//Route for adding a new User
app.use("/users", userRoute);

//Start the server
const port = process.env.PORT || 3000;
if (!module.parent) { //For testing purposes - lets this block restrict any call outside module
    var server = app.listen(port, console.log("Listening on " + port));
}

//Client Side Use
app.use(express.static("../client"))//Hosts the website - or create http-server
//Makes the static files available

//Socket Setup
var io = socket.listen(server);

//Socket Connection created successfully
io.on('connection', function (socket) {

    socket.on('message-sent', function (message) {
        userController.sendMessage(message, (err, data) => {
            if (!err) {
                io.sockets.emit('message-sent', message);
            } else {
                console.log("Error in message-sending: " + err);
            }
        })
    })
})