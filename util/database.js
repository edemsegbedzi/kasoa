const Sequelize = require('sequelize');

const sequelize = new Sequelize("node-complete","root","javatar",{
    dialect : "mysql",
    host : "localhost"
})

module.exports = sequelize;