/**
 * @description : Input-Output Validation is Done here
 */

const userServices = require('../services/userServices')

//get All data of all users
exports.getAllData = (req, res) => {
    var response = {
        state: false,
        data: null,
    }

    userServices.getAllData((err, data) => {
        if (err) {
            response.state = false;
            response.data = null;

            res.status(422).send(response);
        } else {
            response.state = true;
            response.data = data;

            res.status(200).send(response);
        }
    })


}

//Add a new User
exports.addUser = (req, res) => {

    req.checkBody('name', 'Invalid Name or Length of Name').isString().isLength({ min: 3 });
    req.checkBody('email', 'Invalid Email Id').isEmail();
    req.checkBody('password','Invalid Password Length').isString().isLength({min:3});

    var response = {
        state: false,
        data: null
    }

    req.getValidationResult().then((err) => {
        if (err.isEmpty()) {
            userServices.addUser(req.body, (err, data) => {
                if (err) {
                    response.data = err; //Any error in saving
                    res.status(422).send(response);
                }
                else {
                    response.state = true;
                    response.data = data;

                    res.status(200).send(response);
                }
            });
        } else {
            response.data = err; // Any error in adding new User
            res.status(422).send(response);
        }
    });
}

//Log-in with email and ID
exports.logIn = (req,res) => {

    req.checkBody('email','Invalid Email Address').isEmail();
    req.checkBody('password','Invalid Password Length').isString().isLength({min:3});

    var response = {
        state: false,
        data: null
    }

    req.getValidationResult().then(err => {
        if(err.isEmpty()){
            userServices.logIn(req.body,(err,data) => {
                if(!err){
                    response.state = true;
                    response.data = data;

                    res.status(200).send(response);
                }else{
                    response.data = err;
                    res.status(404).send(response);
                }
            });
        }
    })
}

//reset Password
exports.resetPassword = (req,res) => {

    req.checkBody('password','Invalid Password Length').isString().isLength({min:3});
    
    var response = {
        state: false,
        data: null
    }

    req.getValidationResult().then((err) => {
        if(err.isEmpty()){
            userServices.resetPassword(req.body,(err,data) => {
                if(!err){
                    response.state = true;
                    response.data = data;

                    res.status(200).send(response);
                }else{
                    response.data = err;
                    res.status(422).send(response);
                }
            });
        }
    });

}

//send a mail if password forgotten
exports.forgotPassword = (req,res) => {
    req.checkBody('email','Invalid Email Address').isEmail();

    var response = {
        state: false,
        data: null
    }

    req.getValidationResult().then((err) => {
        if(err.isEmpty()){
            userServices.forgotPassword(req.body, (err,data) => {
                if(!err){
                    response.state = true;
                    response.data = data;

                    res.status(200).send(response);
                }else{
                    response.data = err;
                    res.status(422).send(response);
                }
            })
        }else{
            response.data = err;
            res.status(422).send(response);
        }
    })
}