const Sequilize = require("sequelize");
const sequelize = require("../util/database")

const User = sequelize.define('user',{
    id :{
        type : Sequilize.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    name : {
        type : Sequilize.STRING,
        allowNull: false
    },
    email : {
        type : Sequilize.STRING,
        allowNull : false
    }
})

module.exports = User