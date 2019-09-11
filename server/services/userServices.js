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

    //save user to database
    user.save(function(err){
        if(err){
            console.error(err);
        }else{
            console.log("User was Saved");
        }
    });
}

module.exports = {addUser};