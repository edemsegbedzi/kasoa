const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

const Product = class {
    constructor(title,imageUrl,price,description,id){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb()
        if(this._id){
            return db.collection("products").updateOne({_id : this._id},{$set : this})
        }else{
            return db.collection("products").insertOne(this)
        }
    }

    static fetchAll () {
        const db = getDb();
        return db.collection("products").find().toArray();
    }

    static findById(productId){
        const db = getDb();
        return db.collection("products").find({_id : new mongodb.ObjectId(productId)}).next();
    }

    static deleteById(productId){
        const db = getDb();
        return db.collection("products").deleteOne({_id : new mongodb.ObjectId(productId)})
    }
}



module.exports = Product;