/**
* @description : Business Logic
* 
*/

const userModel = require("../app/model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("nodemailer");
require("dotenv").config();


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
exports.addUser = (body, callback) => {

    //Hashing to hide passwords
    bcrypt.genSalt(5).then((data) => {
        if (data) {
            bcrypt.hash(body.password, data).then((hashedPassword) => {
                if (hashedPassword) { //If hashed password generated successfully
                    var user = new userModel({
                        name: body.name,
                        email: body.email,
                        password: hashedPassword
                    });
                    user.save((err, data) => {
                        if (err) {
                            callback(err);
                        } else callback(null, data);
                    });
                } else callback(err);
            })
        }
    });
}

//LogIn user
exports.logIn = (body, callback) => {
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!user) {
            callback(err);
        } else {
            //Compare the Password;
            bcrypt.compare(body.password, user.password).then((valid) => {
                if (!valid) { //Invalid Password
                    callback("Invalid Password");
                } else { //Generate Token and return the token
                    var token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
                    callback(null, token);
                }
            });
        }
    });
}

//reset password
exports.resetPassword = (body, callback) => {
    jwt.verify(body.token, process.env.TOKEN_SECRET, (err, decode) => {
        if (err) callback(err);
        else {
            bcrypt.genSalt(5).then((data) => {
                if (data) {
                    bcrypt.hash(body.password, data).then((hashedPassword) => {
                        if (hashedPassword) { //If hashed password generated successfully
                            userModel.findOneAndUpdate({ email: decode.email },
                                { $set: { password: hashedPassword } }, (err, doc) => {
                                    if (err) callback(err);
                                    else callback(null, doc);
                                })
                        } else callback(err);
                    })
                }
            });
        }
    });
}

//forgot password
exports.forgotPassword = (body, callback) => {
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!user) {
            callback("User Not Found");
        } else { // Send Mail to User
            var user = userModel.findOne({ email: body.email }, (err, user) => {
                if (!user) {
                    callback(err);
                } else {
                    var token = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
                    var transporter = mailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.USERMAIL,
                            pass: process.env.PASSWORD
                        },
                        tls: { rejectUnauthorized: false }
                    });

                    let mailOptions = {
                        from: process.env.USERMAIL,
                        to: body.email,
                        subject: 'testing node-mailer',
                        text: "http://localhost:"+process.env.PORT+"/resetPassword "+token
                    }

                    transporter.sendMail(mailOptions, (err, data) => {
                        if (!err) {
                            callback(null, data);
                        } else {
                            callback(err);
                        }
                    });
                }
            });

        }
    });
}
