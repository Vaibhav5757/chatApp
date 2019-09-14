const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

exports.verifyToken = (token) => {
    var valid = false;
    jwt.verify(token,process.env.TOKEN_SECRET, (err,decode) => {
        if(decode)valid =  true;
    });
    return valid;
}