const router = require("express").Router();
const userService = require("../services/userServices");
const { check, validationResult } = require("express-validator")

//Home Page of Users
router.get("/", (req, res) => {
    res.send("Users Page");
});

//Add a new user
router.post("/addUser", [check('email').isEmail(), 
                        check('password').isString().isLength({ min: 3 })],
    (req, res) => {
        
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        } else return userService.addUser(req, res);
    });

module.exports = router;

function demo() {
    console.log("I'm here");
}