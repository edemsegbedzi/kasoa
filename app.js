
const express = require('express')

const path = require("path")
const parser = require("body-parser")

const mongoConnect = require("./util/database").mongoConnect


const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop");


const User = require("./model/user")

const errorController = require("./controllers/error")

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(parser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, "public")))

//Add user to each request
app.use((req,res,next) => {
    User.findById("5d6eb5ca5712e870dfddad84").then((user) => {
        req.user = new User(user.name ,user.email,user._id, user.cart);
        next();
    }).catch(err => console.log(err))
    
})

app.use("/admin",adminRoutes);
app.use(shopRoutes);

// app.use(errorController.notFound);


mongoConnect( () => app.listen(3000) )

