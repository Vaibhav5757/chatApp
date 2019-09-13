/**
* @description : Business Logic
* 
*/

const userModel = require("../app/model/userModel");
const bcrypt = require("bcryptjs");
const tokenFactory = require("../middleware/token");
const mailerFactory = require("../middleware/mail");

require("dotenv").config();


async function generatePassword(password) {
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password,salt);
    
    if(hashedPassword)return hashedPassword;
}

async function verifyPassword(givenPassword,hashedPassword){ 
    return await bcrypt.compare(givenPassword,hashedPassword);
}


//get All Users and their data
exports.getAllData = (callback) => {
    userModel.find({}, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}

//Add a new User
exports.addUser = async (body, callback) => {

    //Hashing to hide passwords
    var user = new userModel({
        name: body.name,
        email: body.email,
        password: await generatePassword(body.password)
    });
    user.save((err,data) => {
        if(err)callback(err);
        else callback(null,data);
    });
}

//LogIn user
exports.logIn = (body, callback) => {
    userModel.findOne({ email: body.email }, async (err, user) => {
        if (!user) {
            callback(err);
        } else {
            //Compare the Password;
            var validPass = await verifyPassword(body.password,user.password);
            
            if (!validPass) { //Invalid Password
                callback("Invalid Password");
            } else { 
                //Generate Token and return the token
                var token = tokenFactory.generateToken(user);
                callback(null, token);
            }
        }
    });
}

//reset password
exports.resetPassword = async (body, callback) => {
    var validToken = tokenFactory.verifyToken(body);
    
    if(!validToken){
        callback("Invalid Token");
    }else{
        userModel.findOneAndUpdate({email: body.email},
            {$set: {password: await generatePassword(body.password)}},
            (err,doc) => {
                if(err)callback(err);
                else callback(null,doc);
            });
    }
}

//forgot password
exports.forgotPassword = (body, callback) => {
    userModel.findOne({ email: body.email }, (err, user) => {
        if(err)callback(err);
        if (!user) {
            callback("User Not Found");
        } else { 
            // Send Mail to User with a token
            var token = tokenFactory.generateToken(user);
            mailerFactory.sendMail(token,user,(err,data) => {
                if(err){
                    callback(err);
                }else callback(null,data);
            });
        }
    });
}
