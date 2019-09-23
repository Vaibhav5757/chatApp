/**
 * @description : Business Logic
 */

const userModel = require("../app/model/userModel");
const messageModel = require("../app/model/messageModel");
const bcrypt = require("bcryptjs");
const tokenFactory = require("../middleware/token");
const mailerFactory = require("../middleware/mail");

require("dotenv").config();

/**
 * @description : Hash the password given in plain text
 * @param {password} password is the password in plain text
 */

async function generatePassword(password) {
    const salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(password, salt);

    if (hashedPassword) return hashedPassword;
}

/**
 * @description : Verify the password in plain text with encrypted password
 * @param {givenPassword} password in plain text
 * @param {hashedPassword} encrypted password in database
 */
async function verifyPassword(givenPassword, hashedPassword) {
    return await bcrypt.compare(givenPassword, hashedPassword);
}


/**
 * @description : Get data of all users in Database
 * @param {callback} : Callback function
 */
exports.getAllData = (callback) => {
    userModel.find({}, (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    })
}


/**
 * @description : Add a new User
 * @param {body} : body in Request Object
 * @param {callback} : Callback function
 */
exports.addUser = (body, callback) => {

    userModel.findOne({ email: body.email }, async (err, user) => { //Check if the email is taken
        if (err) callback(err);
        if (user) { //If Email already taken
            callback("Email already taken");
        } else {
            var user = new userModel({
                name: body.name,
                email: body.email,
                password: await generatePassword(body.password), //Hashing to hide passwords
                joined: new Date(),
                timestamp: new Date()
            });
            user.save((err, data) => {
                if (err) callback(err);
                else callback(null, data);
            });
        }
    });
}

/**
 * @description : LogIn user with username and password and return a token
 * @param {body} : body in Request Object
 * @param {callback} : Callback function
 */
exports.logIn = (body, callback) => {
    userModel.findOne({ email: body.email }, async (err, user) => {
        if (!user) {
            err = "No User with this email exists"
            callback(err);
        } else {
            //Compare the Password;
            var validPass = await verifyPassword(body.password, user.password);

            if (!validPass) { //Invalid Password
                callback("Invalid Password");
            } else { //Passwords match

                //Generate Token and return the token
                var token = tokenFactory.generateToken(user);
                callback(null, token);
            }
        }
    });
}

/**
 * @description : reset password with new password
 * @param {req} : Request Object
 * @param {callback} : Callback function
 */
exports.resetPassword = async (req, callback) => {

    if (!req.decode) {
        callback("Invalid Token");
    } else {
        userModel.findOneAndUpdate({ email: req.decode.email }, { $set: { password: await generatePassword(req.body.password), timestamp: new Date() } },
            (err, doc) => {
                if (err) callback(err);
                else callback(null, doc);
            });
    }
}

/**
 * @description : Send a mail to user if password is forgotten
 * @param {body} : body in Request Object
 * @param {callback} : Callback function
 */
exports.forgotPassword = (body, callback) => {
    userModel.findOne({ email: body.email }, (err, user) => {
        if (err) callback(err);
        if (!user) {
            callback("User Not Found");
        } else {
            // Send Mail to User with a token
            var token = tokenFactory.generateToken(user);
            mailerFactory.sendMail(token, user, (err, data) => {
                if (err) {
                    callback(err);
                } else callback(null, "Mail Sent to User");
            });
        }
    });
}

/**
 * @description: Send Message
 * @param{body} : Details of message - sender,reciever,message
 * @param{callback}: Callback to Controller function
 */
exports.sendMessage = (body, callback) => {
    var query = {
        $or: [{
            sender: body.sender,
            receiver: body.receiver
        }, {
            sender: body.receiver,
            receiver: body.sender
        }]

    }

    messageModel.findOne(query)
        .then((doc) => {
            let oldConvo = doc.conversation;
            oldConvo.push(body.message);

            messageModel.findOneAndUpdate(query, { $set: { conversation: oldConvo } }, { new: true })
                .then((data) => {
                    callback(null, data);
                })
                .catch((err) => {
                    callback(err);
                })
        })
        .catch(() => { //If there was no existing chat - Create a chat
            var array = new Array();
            array.push(body.message);
            var message = new messageModel({
                sender: body.sender,
                receiver: body.receiver,
                conversation: array
            })
            message.save((err, data) => {
                if (!err) callback(null, data);
                else callback(err);
            });
        })
}

/**
 * @description: Fetch chat between two users
 * @param {body} : body in Request Object
 * @param {callback} : Callback function
 */
exports.fetchChat = (body, callback) => {
    
    var query = {
        $or: [{
            sender: body.sender,
            receiver: body.receiver
        }, {
            sender: body.receiver,
            receiver: body.sender
        }]

    }

    messageModel.findOne(query)
        .then((doc) => {
            if (doc) callback(null, doc.conversation);
            else callback(null,["No chat history. Send a message to begin Conversation"]);
        })
        .catch(() => {
            callback("Error in Finding Chat-Data")
        })
}