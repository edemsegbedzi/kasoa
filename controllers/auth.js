const User = require("../model/user")
const {validationResult} = require("express-validator")
const crypto = require("crypto")
const bycrpt = require("bcryptjs")
const nodeMailer = require("nodemailer")
const sendGridTransporter = require("nodemailer-sendgrid-transport")
const SENDGRID_API_KEY =  process.env.SENDGRID_API_KEY;


const mailer = nodeMailer.createTransport(sendGridTransporter({
  auth :{
    api_key : SENDGRID_API_KEY,
  }

}))

exports.getLogin = (req,res,next) => {
  let message = req.flash("error");
  if(message.length > 0){
    message = message[0]
  }else {
    message = null;
  }
    return res.render("auth/login", {
        pageTitle : "Login",
        path : "/login",
        isAuthenticated : req.session.isLoggedIn,
        errorMessage : message,
        validationError : [],
        oldInput : {
          email : ""
        }
    })
}
exports.postLogin = (req,res,next) => {
  const {email,password} = req.body
    User.findOne({email : email})
    .then(user => {
      if(user){
        bycrpt.compare(password,user.password)
        .then(response => {
          if(response){
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
            res.redirect('/');
            });
          }else {
            return res.render("auth/login", { 
              pageTitle : "Login",
              path : "/login",
              isAuthenticated : req.session.isLoggedIn,
              errorMessage : "Invalid username / password",
              oldInput : {
                email : email
              },
              validationError : validationResult(req).array()
          })
          }
        })
      }else {
        return res.render("auth/login", { 
          pageTitle : "Login",
          path : "/login",
          isAuthenticated : req.session.isLoggedIn,
          errorMessage : "Invalid username / password",
          oldInput : {
            email : email
          },
          validationError : validationResult(req).array()
      })
      }
      
    })
    .catch(err => console.log(err));
};  

exports.getSignup = (req,res,next) => {
  let message = req.flash("error");
  if(message.length > 0){
    message = message[0]
  }else {
    message = null;
  }
  return res.render("auth/signup", {
    pageTitle : "Sign Up",
    path : "/signup",
    isAuthenticated : req.session.isLoggedIn,
    errorMessage : message,
    oldInput : {
      email : "",
      password : "",
      confirmPassword : ""
    },
    validationError :[]
})}
exports.postSignup = (req, res, next) => {
  const {email,password,confirmPassword} = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle : "Sign Up",
      path : "/signup",
      isAuthenticated : req.session.isLoggedIn,
      errorMessage : errors.array()[0].msg,
      oldInput : {
        email : email,
        password : password,
        confirmPassword: confirmPassword
      },
      validationError : errors.array()
  });
  }
      bycrpt.hash(password,12).then(hash => {
        const u =new User({
          name : "Random User",
          email : email,
          password : hash,
          cart : {items : []}
        });
       u.save().then( _ => {
          res.redirect("/login") 
          mailer.sendMail({
            to : email,
            from : "hello@kasoa.com",
            subject : "Confirmation of Signup",
            html : "<h1>Your account on Kasoa has been succesfully created"
          })
          
      })
      })
    }

exports.getReset = (req,res,next) => {
  let message = req.flash("error");
  if(message.length > 0){
    message = message[0]
  }else {
    message = null;
  }
    return res.render("auth/reset", {
        pageTitle : "Reset Password",
        path : "/reset",
        isAuthenticated : req.session.isLoggedIn,
        errorMessage : message
    })
}


exports.postReset = (req,res,next) => {
  const email = req.body.email;
  User.findOne({email : email})
  .then(user => {
    if(!user){
      req.flash("error","No user found with email provided");
     return res.redirect("/reset")
    }else {
      crypto.randomBytes(32 , (err, buff)=> {
        if(err) { 
          console.error(err)
        }else{
          const token = buff.toString("hex")
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save().then(_ => {
            res.redirect("/");
            mailer.sendMail({
              to : email,
              from : "hello@kasoa.com",
              subject : "Password Reset",
              html : `
                  <p> You have request a password reset </p>
                  <p> Kindly click the <a href="http://localhost:3000/reset/${token}">link</a> to reset Password.
                  <hr>
                  <p> Ignore this email if you didnot request for a password reset.</p>
              `
            },(err,info) => console.log(err,info))
            
          }

          )
        }
      })

    }
  })
  .catch ( err => {
    const error = new Error(err)
    error.httpStatusCode = 500;
    next(error);
})}

exports.getNewPassword = (req,res,next) => {
  const token = req.params.token;
  User.findOne({resetToken : token})
  .then(user => {
    if(!user){
      return res.render("auth/reset", {
        pageTitle : "Reset Password",
        path : "/reset",
        isAuthenticated : req.session.isLoggedIn,
        errorMessage : "Password reset failed"
    })
      
    }else{
      if(user.resetTokenExpiration < Date.now){
        return res.render("auth/reset", {
          pageTitle : "Reset Password",
          path : "/reset",
          isAuthenticated : req.session.isLoggedIn,
          errorMessage : "Reset password token has expired",
      })
      }else{
        return res.render("auth/new-password", {
          pageTitle : "Reset Password",
          path : "/new-password",
          isAuthenticated : req.session.isLoggedIn,
          errorMessage : null,
          userId : user._id.toString(),
          token : token
      })
      }
    }
  } 
  )
}

exports.postNewPassword = (req,res,next) => {
  const userId = req.body.userId;
  const token = req.body.token;
  const newPassword = req.body.password;
  User.findOne({_id : userId, resetToken :token , resetTokenExpiration : {$gt : Date.now()} }).then(user => {
    bycrpt.hash(newPassword,12).then(hash => {
      user.password= hash;
      user.resetToken = undefined,
      user.resetTokenExpiration = undefined
      user.save().then( _ => res.redirect("/login"))
    })
  })
}
exports.postLogout = (req,res,next) => {
    req.session.destroy()
    return res.redirect("/")
}  
