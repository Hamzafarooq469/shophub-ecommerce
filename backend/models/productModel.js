
const mongoose = require("mongoose");
const { Schema } = mongoose; // Destructure Schema from mongoose
const User = require("../models/userModel")

// Define the Product schema
const productSchema = new Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    user: { type: String, ref: 'User' }, 
    createdBy: { type: String, required: true },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0, // Ensure stock cannot be negative
    },
}, {
    timestamps: true,
});

// Export the Product model
module.exports = mongoose.model("Product", productSchema);
