const express = require("express")
const {check} = require("express-validator")
const router = express.Router();
const authController = require("../controllers/auth")
const User = require("../model/user");

router.get("/login",authController.getLogin)
router.post("/login",[
    check("email").isEmail(),
    check("password").isLength({min : 6})
],authController.postLogin)
router.post("/logout",authController.postLogout)

router.get("/signup",authController.getSignup);
router.post("/signup",[
    check("email").isEmail().custom( (value, {req}) => {
       return User.findOne({email : value})
       .then(user => {
           if(user){
              return Promise.reject("Email already exists")
           }
           return true;
       })
    }).normalizeEmail(),
    check("password", "password should six digits long and Alpha numberic").isLength({min : 6}).trim(),
    check("confirmPassword").custom( (value ,{req})=> {
        if(value !== req.body.password){
            throw new Error("Password have to match")
        }
        return true
    }).trim()
], authController.postSignup)


router.get("/reset",authController.getReset);
router.post("/reset",authController.postReset);
router.get("/reset/:token",authController.getNewPassword)
router.post("/new-password",authController.postNewPassword)

module.exports = router;