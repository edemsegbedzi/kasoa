const fs = require("fs")
const pdfDocument = require("pdfkit")


const Product = require("../model/product")
const Order = require("../model/order")


exports.getProducts = (req,res,next) => {
    Product.find()
    .then(products => {
      res.render('shop/product-list',{
        prods : products,
        pageTitle : "All Products",
        path : "/products",
        isAuthenticated : req.session.isLoggedIn
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
          path : '/products',
          isAuthenticated : req.session.isLoggedIn
      })
      }).then((err) => {console.log(err);
      })
}

exports.getCart = (req, res, next) => {

  req.user.populate('cart.items.productId').execPopulate().then(user => 
    {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated : req.session.isLoggedIn
      });
    }
  )
  };

exports.addToCart = (req, res, next) => {
    const productId = req.body.productId;
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
    Order.find({'user.userId' : req.user._id}).then((orders) => {
      res.render("shop/orders",
      {pageTitle: "My Cart",
       path : "/orders", 
       orders : orders,
       isAuthenticated : req.session.isLoggedIn
      });
    }).catch(err => console.log(err))
}
exports.postOrder = (req,res,next) => {
  req.user.populate('cart.items.productId').execPopulate().then(user => 
    {   
    const products = user.cart.items.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc }}
    });
    const order = new Order({
     user : {
       name : req.user.name,
       userId : req.user._id
     },
     product :products
  })
  return order.save();
}).then( () => {
   req.user.clearCart();
}).then( () => {
  res.redirect("/orders")
})
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
        path : "/",
        isAuthenticated : req.session.isLoggedIn 
    })
    })
    .catch ( err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      next(error);
  })}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeItemFromCart(prodId)
    .then( _ => res.redirect("/cart"))
    .catch ( err => {
      const error = new Error(err)
      error.httpStatusCode = 500;
      next(error);
  })  };


  exports.getInvoice = (req,res,next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order => {
      if(!order){
        return next("No Oder Found");
      }else if (! order.user.userId.equals(req.session.user._id)){
        return next("UnAuthorized")
      }
      const invoiceName = "invoice-"+order._id+".pdf"
      res.setHeader("Content-Type","application/pdf");
      res.setHeader('Content-Disposition','attachement; filename="'+invoiceName+'"')
      const doc = new pdfDocument();
      doc.pipe(fs.createWriteStream("data/invoices/"+invoiceName));
      doc.pipe(res);

      doc.fontSize(24).text("Invoice")
      doc.text("------------------")
      order.product.forEach(o => {
          doc.fontSize(13).text(`
          ${o.product.title} x ${o.quantity}  ${o.product.price*o.quantity} 
          `)
        
      });
     doc.fontSize(20).text("Total - "+ order.product.reduce((total,val) => total +  val.quantity * val.product.price ,0))
     doc.end();

      
    })
    .catch(err => console.log(err))
  }