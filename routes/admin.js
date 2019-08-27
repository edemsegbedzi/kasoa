const express = require('express')
const path = require('path')
const router = express.Router();
const adminController = require("../controllers/admin")


router.get("/add-product",adminController.addProduct)
router.post("/add-product", adminController.postProduct)
router.get("/edit-product/:productId", adminController.editProduct)
router.post("/edit-product/:productId", adminController.updateProduct)

router.get("/products",adminController.getProducts)
module.exports = router
