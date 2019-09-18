const jwt = require("jsonwebtoken");

/**
 * @description: return a token
 * @param {user} : User body whose token needs to be generated
 */
exports.generateToken = (user) => {
    return jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
}

/**
 * @description : return true or false after verifying token
 * @param {req} : Request Object
 * @param {res} : Response Object
 * @param {next} : Next function
 */
exports.verifyToken = (req, res,next) => {
    var token  = req.header('auth-token');
    var verified = jwt.verify(token,process.env.TOKEN_SECRET);
    var response = {}
    
    if(!verified){
        response.status = false;
        response.error = "Invalid Token"
        res.send(response);
    }
    else{
        req.decode = verified;
        next();
    }
}

