const jwt = require("jsonwebtoken");

/**
 * @description: return a token
 * @param {user} : User body whose token needs to be generated
 */
exports.generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

/**
 * @description : return true or false after verifying token
 * @param {token} : Token which needs to be validated
 */
exports.verifyToken = (token) => {
    var valid = false;
    jwt.verify(token,process.env.TOKEN_SECRET, (err,decode) => {
        if(decode)valid =  true;
    });
    return valid;
}