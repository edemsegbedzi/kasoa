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
    const productId = req.body.productId
    let fetchedCart ;
    let newquantity = 1;
    req.user.getCart().then((cart) => {
      fetchedCart = cart;
      cart.getProducts({where :{id : productId}}).then((products) => {
        let product ;
        if(products.length > 0){
          product = products[0]
        }
        if(product){
          const oldQuantity = product.cartItem.quantity;
          newquantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(req.body.productId)})
        .then(product => {
          return fetchedCart.addProduct(product, {through : {quantity : newquantity}})
      })
        .then((_) => {res.redirect("/cart")}).catch(err => console.log(err)).catch(err => console.log(err));
    }).catch(err => console.log(err))

}
exports.getOrders = (req, res ,next ) => {
    req.user.getOrders({include : ['products']}).then((orders) => {
      res.render("shop/orders",{pageTitle: "My Cart", path : "/orders", orders : orders});
    }).catch(err => console.log(err))
}
exports.postOrder = (req,res,next) => {
  let fetchedCart ;
  req.user.getCart()
  .then(cart =>  { 
    fetchedCart = cart;
     return cart.getProducts() 
    })
  .then(products => req.user.createOrder().then(order => {
      order.addProducts(products.map(product => {
        product.orderItem = product.cartItem.quantity
        return product;
      }))
  }))
  .then(_ => fetchedCart.setProducts(null))
  .then(_ => res.redirect("/orders"))
  .catch(err => console.log(err))
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
    req.user.getCart().then(cart => {
      return cart.getProducts({where : {id : prodId}})
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy()
    })
    .then( _ => res.redirect("/cart"))
    .catch(err => console.log(err))
  };