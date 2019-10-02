const express = require('express')
const path = require('path')
const router = express.Router();
const {check} = require("express-validator")

const auth = require("../middleware/is-auth")
const adminController = require("../controllers/admin")


router.get("/add-product",auth,adminController.addProduct)
router.post("/add-product",auth,[
    check("title","Title has to be as least 3 charactes long").isLength({min : 3}).trim(),
    check("price","Enter a valid price").isFloat(),
    check("description", "Description should be at least on 3 characters").isLength({min: 5}).trim(),
], adminController.postProduct)
router.get("/edit-product/:productId",auth, adminController.editProduct);
router.post("/edit-product/:productId",auth,[
    check("title","Title has to be as least 3 charactes long").isLength({min : 3}).trim(),
    check("price","Enter a valid price").isFloat(),
    check("description", "Description should be at least on 3 characters").isLength({min: 5}).trim(),
],adminController.updateProduct)

router.get("/products",auth,adminController.getProducts)

router.post("/delete-product/:productId",auth,adminController.deleteProduct)
module.exports = router
