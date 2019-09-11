/**
 * @description : Business Logic
 */

const userModel = require("../app/model/userModel");
const bcrypt = require("bcryptjs");

async function addUser(req, res) {

    //Hashing to hide passwords
    var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Add the new User
    let user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    //save user to database
    user.save(function (err) {
        if (err) {
            return res.status(422).send(err);
        } else {
            return res.status(200).send("User was saved");
        }
    });
}

module.exports = {addUser};