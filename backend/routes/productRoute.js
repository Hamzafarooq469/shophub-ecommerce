
const express = require("express")

const { createProduct, getAllProductsForAdmin, getAllProducts, getProductDetails, getProductDetailsForAdmin, deleteProduct, updateProduct } = 
require("../controllers/productController")

const adminCheck = require("../middelware/adminMiddelware") 
const router = express.Router()

router.post("/createProduct", adminCheck, createProduct)
router.get("/getAllProductsForAdmin", adminCheck,  getAllProductsForAdmin)
router.get("/getAllProducts",   getAllProducts)
router.get("/getProductDetails/:id", getProductDetails)
router.get("/getProductDetailsForAdmin/:id", adminCheck, getProductDetailsForAdmin)
router.delete("/deleteProduct/:id", adminCheck, deleteProduct)
router.post("/updateProduct/:id", adminCheck, updateProduct)

module.exports = router