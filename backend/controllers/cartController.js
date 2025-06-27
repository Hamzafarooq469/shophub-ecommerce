
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
    const { userId, quantity } = req.body; // Extract userId from request body
    const  productId  = req.params.id;
    console.log(req.params)
    console.log(req.body)

    try {
        // 1. Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Check if the user already has the product in their cart
        let cartItem = await Cart.findOne({ user: userId, product: productId });

        if (cartItem) {
            // 3. If product is already in the cart, update quantity
            cartItem.quantity += quantity || 1; // Add new quantity or default to 1
            cartItem.price = product.price; // Update the price (optional, in case it changed)
        } else {
            // 4. If product is not in the cart, create a new cart entry
            cartItem = new Cart({
                user: userId,
                product: productId,
                quantity: quantity || 1, // Default to 1 if no quantity provided
                price: product.price, // Store current price
            });
        }

        // Save the cart item
        await cartItem.save();
        return res.status(201).json({ message: "Product added to cart", cartItem });
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        return res.status(500).json({ message: "Error adding product to cart" });
    }
};

const decreaseQuantity = async (req, res) => {
    const { userId, quantity } = req.body; // Extract userId from request body
    const  productId  = req.params.id;
    try {
        const product = await Product.findById(productId)
        if(!product) {
            return res.status(401).json({message: "Product not found"})
        }
        const cartItem = await Cart.findOne({ user: userId, product: productId })
        if(cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save()
            return res.status(200).json({ message: "Quantity decreased", cartItem });
        } else {
            await cartItem.deleteOne();
            return res.status(200).json({ message: "Item removed from cart" });
        }
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        return res.status(500).json({ message: "Error adding product to cart" });
    }
}

const increaseQuantity = async (req, res) => {
    const { userId, quantity } = req.body; // Extract userId and quantity from request body
    const productId = req.params.id; // Extract productId from request params
    try {
        const product = await Product.findById(productId); // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cartItem = await Cart.findOne({ user: userId, product: productId });
        
        if (cartItem) {
            const newQuantity = cartItem.quantity + (quantity || 1); 
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items in stock` });
            }

            cartItem.quantity = newQuantity;
            await cartItem.save();

            return res.status(200).json({ message: "Product quantity increased", cartItem });
            // cartItem.quantity += quantity || 1;
            // await cartItem.save();
            // return res.status(200).json({ message: "Product quantity increased", cartItem });
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Error updating product quantity in cart:", error.message);
        return res.status(500).json({ message: "Error updating product quantity in cart" });
    }
}

const removeFromCart = async (req, res) => {
    const { userId, quantity } = req.body; // Extract userId and quantity from request body
    const productId = req.params.id; // Extract productId from request params  
    try {
        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const cartItem = await Cart.findOne({ user: userId, product: productId });
        if(cartItem) {
            await cartItem.deleteOne()
            // await cartItem.save();
            return res.status(201).json({message: "Product removed from cart"})
        } 
    } catch (error) {
        console.error("Error updating product quantity in cart:", error.message);
        return res.status(500).json({ message: "Error updating product quantity in cart" });
    } 
}


const getCart = async (req, res) => {
    // const userId = req.params; // Extract userId from request parameters
    const id = req.params.id;
    console.log(req.params.id)


    try {
        // Find all cart items for the specified user
        const cartItems = await Cart.find({ user: id }).populate('product');
        // if(cartItems) {
        //     return res.status(201).json({message: "Cart Found"})
        // }

        // if (cartItems.length === 0) {
        //     return res.status(404).json({ message: "Cart is empty" });
        // }

        return res.status(200).json({ cartItems });
    } catch (error) {
        console.error("Error fetching cart items:", error.message);
        return res.status(500).json({ message: "Error fetching cart items" });
    }
};

module.exports = {
    addToCart,
    getCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart
};
