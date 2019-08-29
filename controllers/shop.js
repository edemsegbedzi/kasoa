const Product = require("../model/product")
const Cart = require("../model/cart")

exports.getProducts = (req,res,next) => {
    Product.findAll()
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
    Product.findByPk(productId).then(
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
  req.user
  .getCart()
  .then(cart => {
    return cart.getProducts()
  }).then(products => {
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
  }).catch(err => console.error(err))
    // Cart.getCart(cart => {
    //   Product.findAll().then(products => {
    //     const cartProducts = [];
    //     for (product of products) {
    //       const cartProductData = cart.products.find(
    //         prod => prod.id === product.id
    //       );
    //       if (cartProductData) {
    //         cartProducts.push({ productData: product, qty: cartProductData.qty });
    //       }
    //     }
    //     res.render('shop/cart', {
    //       path: '/cart',
    //       pageTitle: 'Your Cart',
    //       products: cartProducts
    //     });
    //   });
    // });
  };

exports.addToCart = (req, res, next) => {
    Product.getProductById(req.body.productId, product => {
        Cart.saveToCart(product.id, product.price)
    })
    res.redirect("/")
}
exports.getOrders = (req, res ,next ) => {
    res.render("shop/orders",{pageTitle: "My Cart", path : "/orders"});
}

exports.getCheckout = (req,res,next) => {
    res.render("shop/checkout", {pageTitle: "Checkout",path : "checkout"})
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
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
    Product.getProductById(prodId, product => {
      Cart.deleteFromCart(prodId, product.price);
      res.redirect('/cart');
    });
  };