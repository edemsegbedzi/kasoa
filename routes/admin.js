const express = require('express')
const path = require('path')
const router = express.Router();

const auth = require("../middleware/is-auth")
const adminController = require("../controllers/admin")


router.get("/add-product",auth,adminController.addProduct)
router.post("/add-product",auth, adminController.postProduct)
router.get("/edit-product/:productId",auth, adminController.editProduct)
router.post("/edit-product/:productId",auth ,adminController.updateProduct)

router.get("/products",auth,adminController.getProducts)

router.post("/delete-product/:productId",auth,adminController.deleteProduct)
module.exports = router
