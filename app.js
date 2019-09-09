
const express = require('express')
const session = require("express-session")
const MongoStore = require("connect-mongodb-session")(session)
const csrf = require("csurf")
const flash = require("connect-flash")

const MONGO_DB_URI = "mongodb://localhost:27017/node-complete";

const store  = new MongoStore({
    uri : MONGO_DB_URI,
    collection : "sessions"
})

const path = require("path")
const parser = require("body-parser")
const mongoose = require("mongoose")

const adminRoutes = require("./routes/admin")
const authRoutes = require("./routes/auth")
const shopRoutes = require("./routes/shop");


const User = require("./model/user")

const errorController = require("./controllers/error")

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(parser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({secret: 'the big bad wolf', resave : false, saveUninitialized : false,store : store}))

//csrf should be afer session always and before request handlers
const csrfProtection = csrf();
app.use(csrfProtection);
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(flash())

app.use("/admin",adminRoutes);
app.use(authRoutes)
app.use(shopRoutes);

// app.use(errorController.notFound);

mongoose.connect(MONGO_DB_URI)
.then( result => {
    app.listen(3000)
}).catch(err => console.error(err))
