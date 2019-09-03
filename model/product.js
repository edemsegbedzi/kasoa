const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const Product = class {
    constructor(title,price,description,imageUrl){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb()
       return db.collection("products").insertOne(this)
    }

    static fetchAll () {
        const db = getDb();
        return db.collection("products").find().toArray();
    }

    static findById(productId){
        const db = getDb();
        return db.collection("products").find({_id : new mongodb.ObjectId(productId)}).next();
    }
}



module.exports = Product;