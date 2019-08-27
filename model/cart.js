const path = require("path");
const fs = require("fs")

exports.saveToCart = (productId, productPrice) => {
    const p = path.join(path.dirname(process.mainModule.filename),'data','cart.json');    

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