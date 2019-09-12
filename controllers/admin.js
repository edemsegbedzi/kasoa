const Product = require("../model/product")

exports.addProduct = (req,res,next) => {
    res.render('admin/edit-product',{pageTitle : "Add Product", path: "admin/add-product",editable: false})

}
exports.postProduct = (req,res,next) => {
    const {title,imageUrl,price,description} = req.body;
    const product = new Product({
        title : title,
        imageUrl : imageUrl,
        price : price,
        description : description,
        userId : req.user,
        isAuthenticated : req.session.isLoggedIn
    })
    product.save().then(result => {
        res.redirect("/")
    }).catch ( err => console.log(err))
}


exports.getProducts = (req,res,next) => {
    Product.find({userId : req.user._id}).then(products => {
        res.render('admin/products',{
            prods : products,
            pageTitle : "Let's Shop",
            path : "/admin/products",
            isAuthenticated : req.session.isLoggedIn

        })
    } ).catch(err => console.log(err))
}

exports.editProduct  = (req,res,next) => {   
    const editable = req.query.edit;

    if(editable){
        const productId = req.params.productId;

        Product.findOne({_id : productId, userId : req.user._id}).then( product => {
            if(!product){
               return res.redirect("/")
            }else {
                res.render('admin/edit-product',
                {
                    pageTitle : "Add Product",
                    path: "admin/add-product",
                    editable: true,
                    product : product,
                    isAuthenticated : req.session.isLoggedIn
                })
            }
           
        }).catch(err => console.log(err))

    }else{
        res.render('admin/edit-product',{pageTitle : "Add Product", path: "admin/add-product",editable: false})

    } 
}


exports.updateProduct = (req,res,next) => {
    const {productId,title,imageUrl,price,description} = req.body;
    console.log(productId);
    Product.findById(productId).then( product => {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save()
    }).then( _ => res.redirect("/"))   
}  

exports.deleteProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.deleteOne({_id : productId , userId : req.user._id})
    .then( res.redirect("/admin/products"))
}