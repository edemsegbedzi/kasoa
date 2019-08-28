const path = require("path");
const fs = require("fs")
const Cart = require("./cart")

const p = path.join(path.dirname(process.mainModule.filename),'data','products.json');    

const getProductsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
            callback([]);
        }else {
            let content = []
            try{
                content = JSON.parse(fileContent);
            }catch{
                content = [];
            }
            callback(content);
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

    static deleteProduct(productId){
        getProductsFromFile(products => {
            const product = products.find(e => e.id == productId);
            const updatedProduct = products.filter(p => p.id != productId);
            Cart.deleteFromCart(productId, product.price)
            fs.writeFile(p,JSON.stringify(updatedProduct), err => console.log(err));
        })
    }
}