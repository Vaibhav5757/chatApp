/**
 * @description : Input-Output Validation is Done here
 */

const userServices = require('../services/userServices')


/**
 * @description : Get data of all users
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.getAllData = (req, res) => {

    var response = {}

    userServices.getAllData((err, data) => {
        if (err) {
            response.status = false;
            response.error = err;

            res.status(404).send(response);
        } else {
            response.status = true;
            response.data = data;

            res.status(200).send(response);
        }
    });


}

/**
 * @description : Add a new User
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.addUser = (req, res) => {
    var response = {}

    req.checkBody('name', 'Invalid Name or Length of Name').isString().isLength({ min: 3 });
    req.checkBody('email', 'Invalid Email Id').isEmail();
    req.checkBody('password', 'Invalid Password Length').isString().isLength({ min: 3 }).equals(req.body.confirmPassword);

    req.getValidationResult().then((err) => {
        if (err.isEmpty()) {
            userServices.addUser(req.body, (err, data) => {
                if (err) {
                    response.status = false;
                    response.error = err; //Any error in saving
                    res.status(422).send(response);
                } else {
                    response.status = true;
                    response.data = data;

                    res.status(200).send(response);
                }
            });
        } else {
            response.status = false;
            response.error = "Invalid Details Entered"; // Any error in adding new User
            res.status(500).send(response);
        }
    });
}

/**
 * @description : Log-in with email and ID
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.logIn = (req, res) => {
    var response = {}

    req.checkBody('email', 'Invalid Email Address').isEmail();
    req.checkBody('password', 'Invalid Password Length').isString().isLength({ min: 3 });

    req.getValidationResult().then(err => {
        if (err.isEmpty()) {
            userServices.logIn(req.body, (err, data) => {
                if (!err) {
                    response.status = true;
                    response.data = data;

                    res.status(200).send(response);
                } else {
                    response.status = false;
                    response.error = err;
                    res.status(400).send(response);
                }
            });
        } else {
            response.status = false;
            response.error = "Invalid Email or Password";
            res.status(422).send(response);
        }
    });
}

/**
 * @description : Reset Password
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.resetPassword = (req, res) => {
    var response = {}

    req.checkBody('password', 'Invalid Password Length').isString().isLength({ min: 3 });
    req.checkBody('confirmPassword', 'Invalid Password Length').isString().isLength({ min: 3 });

    if (req.body.password !== req.body.confirmPassword) {
        response.data = "passwords don't match";
        res.status(422).send(response);
    }

    req.getValidationResult().then((err) => {
        if (err.isEmpty()) {
            userServices.resetPassword(req, (err, data) => {
                if (!err) {
                    response.status = true;
                    response.data = data;

                    res.status(200).send(response);
                } else {
                    response.status = false;
                    response.error = err;
                    res.status(422).send(response);
                }
            });
        }
    });

}

/**
 * @description : send a mail if password forgotten
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.forgotPassword = (req, res) => {
    var response = {}

    req.checkBody('email', 'Invalid Email Address').isEmail();

    req.getValidationResult().then((err) => {
        if (err.isEmpty()) {
            userServices.forgotPassword(req.body, (err, data) => {
                if (!err) {
                    if (data) {
                        response.status = true;
                        response.data = data;

                        res.status(200).send(response);
                    }
                } else {
                    response.status = false;
                    response.error = err;
                    res.status(404).send(response);
                }
            })
        } else {
            response.status = false;
            response.error = "Invalid Email Id Entered";
            res.status(422).send(response);
        }
    });
}

/**
 * @description : Send a Message from one user to another
 * @param {message}: Message Body
 */
exports.sendMessage = (message, callback) => {

    var response = {}

    userServices.sendMessage(message, (err, data) => {
        if (!err) {
            if (data) {
                response.status = true;
                response.data = data;

                callback(null, response);
            }
        } else {
            response.status = false;
            response.error = err;
            callback(response);
        }
    })
}

/**
 * @description: Fetch the chat data between two people
 * @param {req} : Request Body
 * @param {res} : Response
 */
exports.fetchChat = (req, res) => {
    var response = {};

    userServices.fetchChat(req.body, (err, data) => {
        if (!err) {
            response.status = true;
            response.data = data;

            res.status(200).send(response);
        } else {
            response.status = false;
            response.error = err;
            res.status(404).send(response);
        }
    })
}