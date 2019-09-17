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
 * @param {token} : Token which needs to be validated
 */
exports.verifyToken = (req, res,next) => {
    var token  = req.header('auth-token');
    var verified = jwt.verify(token,process.env.TOKEN_SECRET);
    
    if(!verified){
        res.send("Invalid Token");
        
    }
    else{
        req.decode = verified;
        next();
    }
}

