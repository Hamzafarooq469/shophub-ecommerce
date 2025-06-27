
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Shipping = require("../models/shippingModel"); // Corrected import for Shipping
const Order = require("../models/orderModel");
const { ObjectId } = require('mongodb');

const createOrder = async (req, res) => {
    const { userId, guest, sh, ca } = req.body; // Changed to destructure `sh` and `ca`
    console.log("Guest ID:", guest);
    console.log("Request Body:", req.body);

    // Check if cartItems (ca) is defined and is an array
    if (!Array.isArray(ca) || ca.length === 0) {
        return res.status(400).json({ message: "Invalid cartItems" });
    }

    try {
        // Use provided shipping information from request body for guest users
        const shippingInfo = {
            name: sh.name,
            phoneNumber: sh.phoneNumber,
            address: sh.address,
            streetNumber: sh.streetNumber,
            area: sh.area,
            city: sh.city,
            district: sh.district,
            province: sh.province,
            country: sh.country,
            postalCode: sh.postalCode,
        };

        // Create a new shipping record for the guest user
        const shipping = new Shipping(shippingInfo);
        await shipping.save(); // Save the shipping information to the database

        // Map cart items to include product ObjectId
        const orderItems = ca.map(item => ({
            product: new ObjectId(item.product), // Convert to ObjectId
            quantity: item.quantity,
        }));

        // Create a new order
        const order = new Order({
            user: guest, // Use the guest ID
            cart: orderItems,
            shipping: shipping._id, // Use the newly created shipping ID
        });
        console.log("Here is order", order);

        // Save the order to the database
        await order.save();
        return res.status(201).json({ message: "Order made", order });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};




const getOrder = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const order = await Order.findOne({ user: userId })
            .populate('cart.product')
            .populate('shipping'); // This assumes 'cart.product' is a reference to your Product model

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { 
    createOrder,
    getOrder,
    
 };
