const path = require("path");
const fs = require("fs")
const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');    


module.exports = class Cart {
    static saveToCart (productId, productPrice){    
        fs.readFile(p, (err, fileContent) => {
            let cart = {products : [],totalPrice : 0}
            if(!err){
                cart = JSON.parse(fileContent)
            }
            const existingProductId = cart.products.findIndex( p => p.id == productId);
            const existingProduct = cart.products[existingProductId];
            let updatedProduct
            if(existingProduct){
                updatedProduct = {...existingProduct, qty : existingProduct.qty + 1};
                cart.products = [...cart.products]
                cart.products[existingProductId] = updatedProduct;
            }else{
                updatedProduct = {id : productId, qty : 1}
                cart.products = [...cart.products,updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => console.log(err))
        })
    }
    
    static deleteFromCart(productId, price){
        fs.readFile(p, (err, fileContent) => {
            let updatedCart = {products : [],totalPrice : 0};
            if(!err){
                updatedCart = JSON.parse(fileContent)
                const product = updatedCart.products.find(e => e.id == productId)
                if(product){
                    updatedCart.products = updatedCart.products.filter(p => p.id != productId);
                    updatedCart.totalPrice = updatedCart.totalPrice - product.qty * price;
                    fs.writeFile(p, JSON.stringify(updatedCart), err => {
                        console.log(err);
                      });
                }

            }
        })

    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
          const cart = JSON.parse(fileContent);
          if (err) {
            cb(null);
          } else {
            cb(cart);
          }
        });
      }
    
    
}