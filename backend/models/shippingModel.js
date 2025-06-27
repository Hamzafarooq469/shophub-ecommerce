const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")

const shippingInfoSchema = new Schema({
    user: { type: String, ref: 'User' },
    guestId: { type: String, default: null },
    // product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    // cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // phoneNumber: {
    //     type: String,
    //     required: true,
    //     validate: {
    //         validator: function(v) {
    //             return /^\d{10,15}$/.test(v); // Validates 10-15 digit phone numbers
    //         },
    //         message: props => `${props.value} is not a valid phone number!`
    //     }
    // },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    streetNumber: {
        type: String,
        required: true,
    },
    area: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String
    },
    province: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Shipping", shippingInfoSchema);
