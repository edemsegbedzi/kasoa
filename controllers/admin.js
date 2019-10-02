const Product = require("../model/product")
const {validationResult} = require("express-validator")
const fileHelper = require("../util/file")


exports.addProduct = (req,res,next) => {
    res.render('admin/edit-product',
    {pageTitle : "Add Product", 
    path: "admin/add-product",
    hasErrors : false,
    errorMessage : null,
    validationError : [],
    editable: false})

}
exports.postProduct = (req,res,next) => {
    const {title,price,description} = req.body;
    const image = req.file;
    const errors = validationResult(req);
    if(!errors.isEmpty() || !image){
        return res.render('admin/edit-product',
        { pageTitle : "Add Product",
         path: "admin/add-product",
        product : {
            title : title,
            price : price,
            description : description,
        },
        hasErrors : true,
        errorMessage : !image ? "File uploaded is not an image" : errors.array()[0].msg,
        validationError : !image? [] : errors.array(),
        editable: false})
    }
    const product = new Product({
        title : title,
        imageUrl : image.path,
        price : price,
        description : description,
        userId : req.user,
        isAuthenticated : req.session.isLoggedIn
    })
    product.save().then(result => {
        res.redirect("/")
    }).catch ( err => {
        const error = new Error(err)
        error.httpStatusCode = 500;
        next(error);
    })
}


exports.getProducts = (req,res,next) => {
    Product.find({userId : req.user._id}).then(products => {
        res.render('admin/products',{
            prods : products,
            pageTitle : "Let's Shop",
            path : "/admin/products",
            isAuthenticated : req.session.isLoggedIn,
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
                    isAuthenticated : req.session.isLoggedIn,
                    hasErrors : false,
                    errorMessage : null,
                    validationError: []

                })
            }
           
        }).catch ( err => {
            const error = new Error(err)
            error.httpStatusCode = 500;
            next(error);
        })

    }else{
        res.render('admin/edit-product',
        {pageTitle : "Add Product",
         path: "admin/add-product",
         editable: false,
          errorMessage : null,
          hasErrors: false,
        validationError : []})

    } 
}


exports.updateProduct = (req,res,next) => {
    const {productId,title,price,description} = req.body;
    const image = req.file;
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return  res.status(422).render('admin/edit-product',
        {
            pageTitle : "Edit Product",
            path: "admin/edit-product",
            editable: true,
            product : {
                title : title,
                price : price,
                description : description,
                _id : productId
            },
            isAuthenticated : req.session.isLoggedIn,
            hasErrors : true,
            errorMessage : errors.array()[0].msg,
            validationError: []

        })
    }
    Product.findById(productId).then( product => {
        product.title = title;
        if(image){
            fileHelper.deleteFile(product.imageUrl)
            product.imageUrl = image.path;
        }
        product.price = price;
        product.description = description;
        return product.save()
    }).then( _ => res.redirect("/"))   
}  

exports.deleteProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId).then( product => {
        if(!product){
            throw(new Error("Product not Found"))
        }else {
            return fileHelper.deleteFile(product.imageUrl)
        }
    }).then(_ =>  Product.deleteOne({_id : productId , userId : req.user._id}))
    .then( res.redirect("/admin/products"))
}