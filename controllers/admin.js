const Product = require("../model/product")

exports.addProduct = (req,res,next) => {
    res.render('admin/edit-product',{pageTitle : "Add Product", path: "admin/add-product",editable: false})

}
exports.postProduct = (req,res,next) => {
    const {title,imageUrl,price,description} = req.body;
    const product = new Product(title,price,description,imageUrl)

    product.save().then(result => {
        res.redirect("/")
    }).catch ( err => console.log(err))
}


exports.getProducts = (req,res,next) => {
    Product.fetchAll().then(products => {
        res.render('admin/products',{
            prods : products,
            pageTitle : "Let's Shop",
            path : "/admin/products"
        })
    } ).catch(err => console.log(err))
}

exports.editProduct  = (req,res,next) => {   
    const editable = req.query.edit;

    if(editable){
        const productId = req.params.productId;
        req.user.getProducts({where : {id : productId}}).then( product => {
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
        }).catch(err => console.log(err))

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
    Product.destroy({
        where : {
            id : productId
        }
    })
    .then( res.redirect("/admin/productc")
    .catch(console.log(err = console.error(err))))
}