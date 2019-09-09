const User = require("../model/user")
const bycrpt = require("bcryptjs")
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
        errorMessage : message
    })
}
exports.postLogin = (req,res,next) => {
    User.findOne({email : req.body.email})
    .then(user => {
      bycrpt.compare(req.body.password,user.password)
      .then(response => {
        if(response){
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
          console.log(err);
          res.redirect('/');
          });
        }else {
          req.flash("error", "Invalid email / password")
          return res.redirect("/login")
        }
      })
      
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
    errorMessage : message
})}
exports.postSignup = (req, res, next) => {
  const {email,password} = req.body;
  User.findOne({email : email}).
  then(user => {
    if(user){
      req.flash("error", "User email Aleady exits")
     return res.redirect("/login")
    }else {
      bycrpt.hash(password,12).then(hash => {
        const u =new User({
          name : "Random User",
          email : email,
          password : hash,
          cart : {items : []}
        });
        u.save().then( _ => res.redirect("/login"))
      })
    }
  })
}


exports.postLogout = (req,res,next) => {
    req.session.destroy()
    return res.redirect("/")
}  
