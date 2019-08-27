const path = require("path");
const fs = require("fs")

const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');    

const getProductsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
            callback([]);
        }else {
            callback(JSON.parse(fileContent));
        }
    })
}    

module.exports = class Product{
    constructor(id ,title,imageUrl,price,description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.id = id;
    }

    save(){
        getProductsFromFile(products => {

            if(this.id){
                const productId = products.findIndex( p => p.id == this.id);
                const updatedProduct = {...this}
                products[productId] = updatedProduct;
            }else{
                this.id = Math.random();
                products.push(this);
            }

            fs.writeFile(p,JSON.stringify(products), err => console.log(err));
        })

    }

    static getProducts(callback){
        getProductsFromFile(callback)
    }

    static getProductById(id,callback){
        getProductsFromFile(products => {
            const product = products.find(p => p.id == id);
            callback(product)
        })
    }
}