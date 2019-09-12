const express = require("express");
const userRoute = require("../server/router/router")
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const validator = require("express-validator")
require("dotenv").config();

//Start the server
app = express();

//To ensure JSON conversion
app.use(express.json());

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Use express Validator
app.use(validator());

//connect to mongoDB database
mongoose.connect(process.env.DBPATH, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex :true });

//database connected checking
let db = mongoose.connection;//an instance of mongoose
db.once("open", (err) => {
    if (err) return res.status(404).send(err);
});

//Remove Depreciated Warning while changing password
mongoose.set('useFindAndModify', false);

//Home Page
app.get("/", (req, res) => {
    res.send("Welcome to Home-Page");
})

//Route for adding a new User
app.use("/users", userRoute);

//Start the server
const port = process.env.PORT || 4000;
app.listen(port, console.log("Listening on 4000"));