module.exports = (req,res,next) => {
    if(!req.isLoggedIn){
        res.redirect("/login")
    }else{
        return next();
    }
}