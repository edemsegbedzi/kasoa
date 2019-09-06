
const express = require('express')

const path = require("path")
const parser = require("body-parser")

const mongoose = require("mongoose")

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
    User.findById("5d72693bfe6d070dd469c951").then((user) => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
    
})

app.use("/admin",adminRoutes);
app.use(shopRoutes);

// app.use(errorController.notFound);


mongoose.connect("mongodb://localhost:27017/node-complete")
.then( result => {
    User.findOne().then((user) => {
        if(!user){
            const user = new User({
                name: 'Edem',
                email: 'edem@test.com',
                cart: {
                    items : []
                },
                orders : []
                
              });
            user.save();
        }
    }).catch(err => console.log(err))
    app.listen(3000)
}).catch(err => console.error(err))
