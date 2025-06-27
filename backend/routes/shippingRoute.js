
const express = require("express")
const { createShipping, getShippingInfo, updateShipping } = require("../controllers/shippingController")
const router = express.Router()

router.post("/createShipping", createShipping)
router.get("/getShippingInfo/:id", getShippingInfo)
router.put("/updateShipping", updateShipping);

module.exports = router

