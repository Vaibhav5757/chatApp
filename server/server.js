const express = require("express");
const userRoute = require("../server/router/router")
const bodyParser = require("body-parser")

app = express();

//To ensure JSON conversion
app.use(express.json());

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Home Page
app.get("/", (req, res) => {
    res.send("Welcome to Home-Page");
})

//Route for adding a new User
app.use("/users", userRoute);

//Start the server
const port = process.env.PORT || 3000;
app.listen(port, console.log("Listening on 3000"))