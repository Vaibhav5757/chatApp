const router = require("express").Router();
const userController = require("../controller/userController")
const tokenFactory = require("../middleware/token")

//Users HomePage - Display all users
router.get("/",userController.getAllData);

//Add a new User
router.post("/addUser",userController.addUser);

//logIn with email and password
router.post("/login",userController.logIn);

//reset password
router.post("/resetPassword",tokenFactory.verifyToken,userController.resetPassword);

//forgot Password
router.post("/forgotPassword",userController.forgotPassword);

module.exports = router;
