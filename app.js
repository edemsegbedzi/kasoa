
const express = require('express')
const sequelize = require("./util/database")

const path = require("path")
const parser = require("body-parser")

const User = require("./model/user");
const Product = require("./model/product")
const Cart = require("./model/cart")
const CartItem = require("./model/cart-item")
const Order = require("./model/order")
const OderItem = require("./model/oder-item")

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
    User.findByPk(1).then((user) => {
        req.user = user;
        next();
    }).catch(err => console.log(err))
    
})

app.use("/admin",adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound)

Product.belongsTo(User,{constraints : true, onDelete : 'CASCADE'});
User.hasMany(Product)
User.hasOne(Cart);
Cart.belongsTo(User);
Product.belongsToMany(Cart, {through : CartItem})
Cart.belongsToMany(Product, {through : CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, {through : OderItem})

sequelize
.sync()
//  .sync({force : true})
.then( _ =>  User.findByPk(1))
.then(user => {
    if(!user){
        return User.create({
            name : "Edem",
            email : "edem@gmail.com"
        })
    }else {
        return user //Automatically wrapped into a promise
    }
})
.then(user => {
    return user.createCart();
})
.then(_ =>     app.listen(3000))
.catch((err) => {console.log(err);
})

