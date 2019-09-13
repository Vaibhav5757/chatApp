const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

exports.verifyToken = (body) => {
    var valid = false;
    jwt.verify(body.token,process.env.TOKEN_SECRET, (err,decode) => {
        if(decode)valid =  true;
    });
    return valid;
}