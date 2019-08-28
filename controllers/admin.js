const Product = require("../model/product")

exports.addProduct = (req,res,next) => {
    res.render('admin/edit-product',{pageTitle : "Add Product", path: "admin/add-product",editable: false})

}
exports.postProduct = (req,res,next) => {
    const {title,imageUrl,price,description} = req.body;
    const product = new Product(null,title,imageUrl,price,description);
    product.save();
    res.redirect("/");
}


exports.getProducts = (req,res,next) => {
    Product.getProducts( products => {
        res.render('admin/products',{
            prods : products,
            pageTitle : "Let's Shop",
            path : "/admin/products"
        })
    })
}

exports.editProduct  = (req,res,next) => {   
    const editable = req.query.edit;

    if(editable){
        const productId = req.params.productId;
        Product.getProductById(productId, product => {
            if(!product){
                req.redirect("/")
            }
            res.render('admin/edit-product',
            {
                pageTitle : "Add Product",
                path: "admin/add-product",
                editable: true,
                product : product
            })
        })

    }else{
        res.render('admin/edit-product',{pageTitle : "Add Product", path: "admin/add-product",editable: false})

    } 
}


exports.updateProduct = (req,res,next) => {
    const {productId,title,imageUrl,price,description} = req.body;
    const product = new Product(productId,title,imageUrl,price,description);    
    product.save();
    res.redirect("/");

}  

exports.deleteProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.deleteProduct(productId);
    res.redirect("/admin/products")
}
