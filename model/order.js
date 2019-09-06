const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    product : {type : Object, required: true},
    user : { 
        name : {type : String},
        userId : {type : mongoose.Types.ObjectId, require : true , ref : 'User'},
    }
})

module.exports = mongoose.model('Order',OrderSchema)