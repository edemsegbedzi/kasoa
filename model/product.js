const Sequilize = require("sequelize");
const sequelize = require("../util/database")

const Product = sequelize.define("product", {
    id : {
        type : Sequilize.INTEGER,
        autoIncrement: true,
        allowNull : false,
        primaryKey : true
    },
    imageUrl : Sequilize.STRING,
    description : {
        type : Sequilize.STRING,
        allowNull: false
    },
    price : {
        type: Sequilize.DOUBLE,
        allowNull : false

    }
})

module.exports = Product;