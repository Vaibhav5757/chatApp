/**
 * @description : Business Logic
 */

const userModel = require("../app/model/userModel");

function addUser(req, res) {
    //Add the new User
    let user = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    return res.status(200).send(user);
}

module.exports = {addUser};