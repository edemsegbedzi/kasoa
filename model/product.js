const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model("Product",ProductSchema)