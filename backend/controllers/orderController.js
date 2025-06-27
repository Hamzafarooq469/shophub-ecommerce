const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Shipping = require("../models/shippingModel"); 
const Order = require("../models/orderModel");
const { ObjectId } = require('mongodb');

const createOrder = async (req, res) => {
    const { userId, guest, sh, ca, cartItems, shippingId } = req.body; // Destructure incoming request
    console.log("User ID:", userId);
    console.log("Guest ID:", guest);
    console.log("Request Body:", req.body);

    // Validate that the cart items exist
    // if (!Array.isArray(ca) || ca.length === 0) {
    //     return res.status(400).json({ message: "Invalid cartItems" });
    // }

    try {
        let shippingIdToUse;

        // Handle guest users
        if (guest && sh) {
            // Create a new shipping record
            const shipping = new Shipping({
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
            });
            await shipping.save(); // Save shipping information
            shippingIdToUse = shipping._id; // Use newly created shipping ID

            const orderItems = ca.map(item => ({
                product: new ObjectId(item.product), // Convert product ID to ObjectId
                quantity: item.quantity,    
            }));

            const order = new Order({
                user: userId || guest, // Assign user ID or guest ID
                cart: orderItems,
                shipping: shippingIdToUse, // Use the appropriate shipping ID
            });
            console.log("Here is the order", order);

            await order.save();
            return res.status(201).json({ message: "Order created successfully", order });

        } else if (userId) {
            const shipping = await Shipping.findOne({ user: userId });
            if (!shipping) {
                return res.status(404).json({ message: "Shipping not found for user" });
            }

            const orderItems = cartItems.map(item => ({
                product: new ObjectId(item.product), // Convert to ObjectId
                quantity: item.quantity,
            }));

            const order = new Order({
                user: userId,
                cart: orderItems,
                shipping: new ObjectId(shippingId), // Ensure shipping ID is also an ObjectId
            });
            console.log("Here is order", order);

            // Save the order to the database
            await order.save();
            return res.status(201).json({ message: "Order made", order });
        } else {
            return res.status(400).json({ message: "Invalid request. Provide either guest shipping info or user ID." });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};





// Get order function remains the same
const getOrder = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const order = await Order.findOne({ user: userId })
            .populate('cart.product')
            .populate('shipping');

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
