const fs = require("fs")
const pdfDocument = require("pdfkit")

const STRIPE_API_KEY =  process.env.STRIPE_API_KEY;
const Product = require("../model/product")
const Order = require("../model/order")
const stripe = require('stripe')(STRIPE_API_KEY);


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
      return res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
        isAuthenticated : req.session.isLoggedIn
      });
    }
  ).catch(err => console.error(err))
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
exports.getOrders = (req,res,next) => {
  Order.find({'user.userId' : req.user._id}).then((orders) => {
    res.render("shop/orders",
    {pageTitle: "My Cart",
     path : "/orders", 
     orders : orders,
     isAuthenticated : req.session.isLoggedIn
    });
  }).catch(err => console.log(err))
}

exports.stripeCallback = (req,res,next) => {
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
  Order.find({'user.userId' : req.user._id}).then((orders) => {
    res.render("shop/orders",
    {pageTitle: "My Cart",
     path : "/orders", 
     orders : orders,
     isAuthenticated : req.session.isLoggedIn
    });
  }).catch(err => console.log(err))})
}


exports.getCheckout = (req,res,next) => {
  req.user.populate('cart.items.productId').execPopulate().then(user => 
    {
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          name: "Products from Kasoa",
          description: user.cart.items.map(item => item.quantity + "( " +item.productId.title + ")").join(","),
          images: ['https://images.unsplash.com/photo-1518729571365-9a891a9df2bd?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb'],
          amount: user.cart.items.reduce((total,item)=> total += item.quantity * item.productId.price,0)*100,
          currency: 'usd',
          quantity: 1,
        }],
        success_url: 'http://localhost:3000/orders?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/cart',
      })
      .then(session => {
       res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: user.cart.items,
        total : user.cart.items.reduce((total,item)=> total += item.quantity * item.productId.price,0),
        isAuthenticated : req.session.isLoggedIn,
        stripeSession : session.id
      });
    }).catch(err => console.error(err))
  })
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