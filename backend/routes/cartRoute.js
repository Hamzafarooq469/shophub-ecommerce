
const express = require("express")
const { addToCart, getCart, increaseQuantity, decreaseQuantity, removeFromCart } = require("../controllers/cartController")
const router = express.Router()

router.post("/addToCart/:id", addToCart)
// router.get("/getCart/:id", getCart)
router.get('/getCart/:id', getCart);
router.post("/increaseQuantity/:id", increaseQuantity)
router.post("/decreaseQuantity/:id", decreaseQuantity)
router.delete("/removeFromCart/:id", removeFromCart)

module.exports = router