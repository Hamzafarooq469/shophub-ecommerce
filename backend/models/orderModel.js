
const mongoose = require("mongoose")
const { Schema } = mongoose
const Shipping = require("../models/shippingModel")

const orderSchema = new Schema({
  user: { type: String, ref: 'User', default: null }, // Allow null for guest users
  // guestId: { type: String, default: null },
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
  }],
  shipping: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
}, {
  timestamps: true,
});


module.exports = mongoose.model("Order", orderSchema)

