const Product = require("../model/product")
// const Cart = require("../model/cart")

exports.getProducts = (req,res,next) => {
    Product.find()
    .then(products => {
      res.render('shop/product-list',{
        prods : products,
        pageTitle : "All Products",
        path : "/products"
    })
    })
    .catch(err => console.log(err));
}
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).then(
      (product) => {
        res.render('shop/product-detail', {
          product : product,
          pageTitle : product.title,
          path : '/products'
      })
      }).then((err) => {console.log(err);
      })
}

exports.getCart = (req, res, next) => {

  req.user.getCart().then(products => 
    {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    }
  )
  };

exports.addToCart = (req, res, next) => {
    const productId = req.body.productId
    Product.findById(productId).then((product) => {
      return req.user.addToCart(product)
    })
    .then( result => {
      res.redirect("/cart")
    })
    .catch(err => console.log(err))
    let fetchedCart ;
    let newquantity = 1;
}
exports.getOrders = (req, res ,next ) => {
    req.user.getOrders().then((orders) => {
      res.render("shop/orders",{pageTitle: "My Cart", path : "/orders", orders : orders});
    }).catch(err => console.log(err))
}
exports.postOrder = (req,res,next) => {
  let fetchedCart ;
  req.user
  .createOrders()
  .then(_ => res.redirect("/orders"))
  .catch(err => console.log(err))
}


exports.getCheckout = (req,res,next) => {
    res.render("shop/checkout", {pageTitle: "Checkout",path : "checkout"})
}

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
      res.render('shop/product-list',{
        prods : products,
        pageTitle : "Let's Shop",
        path : "/"
    })
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeItemFromCart(prodId)
    .then( _ => res.redirect("/cart"))
    .catch(err => console.log(err))
  };