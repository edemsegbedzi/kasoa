
const express = require('express')
const path = require("path")
const parser = require("body-parser")

const adminRoutes = require("./routes/admin")
const shopRoutes = require("./routes/shop")

const errorController = require("./controllers/error")

const app = express();
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(parser.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname, "public")))

app.use("/admin",adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound)
app.listen(3000)
