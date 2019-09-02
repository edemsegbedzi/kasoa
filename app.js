
const express = require('express')
const sequelize = require("./util/database")

const path = require("path")
const parser = require("body-parser")

const mongoConnect = require("./util/database").mongoConnect


const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const errorController = require("./controllers/error")

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(parser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, "public")))

//Add user to each request
app.use((req,res,next) => {
//     User.findByPk(1).then((user) => {
//         req.user = user;
//         next();
//     }).catch(err => console.log(err))

    next();
    
})

app.use("/admin",adminRoutes);
app.use(shopRoutes);

// app.use(errorController.notFound);


mongoConnect( () => app.listen(3000) )

