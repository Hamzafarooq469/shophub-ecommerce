
const Product = require("../models/productModel"); // Corrected from 'Porduct'
const User = require("../models/userModel");
const admin = require("../firebase/firebaseAdmin")


const createProduct = async (req, res) => {
    const { name, description, color, category, price, stock } = req.body;
    const user = req.user; // Access the user from the middleware

    if (!name || !description || !color || !category || !price || !stock) {
        return res.status(400).json({ message: "Please enter all the fields" });
    }
    
    try {
        // Create a new product including only the user's name
        const product = new Product({
            user: user._id,
            createdBy: user.name, // Assuming user object has a name property
            name,
            description,
            color,
            category,
            price,
            stock,
        });

        await product.save(); 
        return res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        console.error("Error creating product:", error); // Log the error for debugging
        return res.status(500).json({ message: "Error creating product", error: error.message });
    }
};


const getAllProductsForAdmin = async (req, res) => {

    try {
        // const product = await Product.find()
        const product = await Product.find({}, {
            name: 1, description: 1, color: 1, category: 1, price: 1, stock: 1, createdBy: 1, createdAt: 1
        });
        return res.status(201).json({message: "All the products are given", product})
    } catch (error) {
        console.error("Error message:", error.message);
        return res.status(500).json({ message: "Error getting products for admin ." });
    }
}

// const getAllProducts = async (req, res) => {

//     try {
//         // const product = await Product.find()
//         const product = await Product.find({}, {
//             name: 1, description: 1, color: 1, category: 1, price: 1, stock: 1,
//         });
//         return res.status(201).json({message: "All the products are given", product})
//     } catch (error) {
//         console.error("Error message:", error.message);
//         return res.status(500).json({ message: "Error getting products ." });
//     }
// }

const getAllProducts = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const categoryFilter = req.query.category || "";
        const colorFilter = req.query.color || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const minPrice = parseFloat(req.query.minPrice) || 0; 
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity; 
        const skip = (page - 1) * limit;

        // Get sort parameters
        const sortBy = req.query.sortBy || "createdAt"; // Default sorting by creation date
        const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Default sorting order is ascending

        // Build the query object
        const query = {
            $or: [
                { name: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { category: { $regex: searchQuery, $options: "i" } }, 
                { color: { $regex: searchQuery, $options: "i" } }, 
            ],
            price: { $gte: minPrice, $lte: maxPrice } 
        };

        // Add filters if provided
        if (categoryFilter) {
            query.category = { $regex: categoryFilter, $options: "i" };
        }

        if (colorFilter) {
            query.color = { $regex: colorFilter, $options: "i" };
        }

        const products = await Product.find(query, {
            name: 1, description: 1, color: 1, category: 1, price: 1, stock: 1
        })
        .sort({ [sortBy]: sortOrder }) // Add sorting here
        .skip(skip)
        .limit(limit);

        const totalProducts = await Product.countDocuments(query);

        return res.status(200).json({
            message: "All products retrieved",
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Error message:", error.message);
        return res.status(500).json({ message: "Error getting products." });
    }
};


const getProductDetailsForAdmin = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const product = await Product.findById(id, {
            name: 1, description: 1, color: 1, category: 1, price: 1, stock: 1, createdBy: 1, createdAt: 1
        })
        if(!product) {
            return res.status(404).json({message: "Could not find product with this id"})
        }
        return res.status(201).json({message:"Product details", product})
    } catch (error) {
        console.error("Error message:", error.message);
        return res.status(500).json({ message: "Error getting product details for admin ." });
    }
}

const getProductDetails = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const product = await Product.findById(id, {
            name: 1, description: 1, color: 1, category: 1, price: 1, stock: 1,
        })
        if(!product) {
            return res.status(404).json({message: "Could not find product with this id"})
        }
        return res.status(201).json({message:"Product details", product})
    } catch (error) {
        console.error("Error message:", error.message);
        return res.status(500).json({ message: "Error getting product details ." });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id)
        if(!product) {
            return res.status(201).json({message: "Could not find product with this id"})
        }
        console.log("Product not found")
        if(product) {
            await Product.findByIdAndDelete(id)
        }
        return res.status(201).json({message: "Product deleted successfully"})
    } catch (error) {
        console.error("Error message:", error.message);
        return res.status(500).json({ message: "Error deleting product." });
    }
}

const updateProduct = async (req, res) => {
    const { id } = req.params; // Get product ID from the request parameters
    const user = req.user; // Get user from the request (authenticated user)
    const { name, description, color, category, price, stock } = req.body; // Get updated product details from the request body
    console.log(req.body)
    console.log("User", user)
    console.log("id", id)

    if (!name || !description || !color || !category || typeof price !== "number" || typeof stock !== "number") {
        return res.status(400).json({ message: "All fields are required and must be valid types" });
    }

    try {
        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Could not find product with this id" });
        }

        // Update product details
        product.name = name;
        product.description = description;
        product.color = color;
        product.category = category;
        product.price = price;
        product.stock = stock;
        // product.createdBy = user.name; // Optionally track who updated the product

        // Save the updated product
        console.log( await product.save())
        // await product.save();

        return res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Error updating product" });
    }
};

// const updateProduct = async (req, res) => {
//     const { id } = req.params; // Get product ID from request parameters
//     const user = req.user; // Get user from request (authenticated user)
//     const { name, description, color, category, price, stock } = req.body; // Get updated details from request body
//     console.log(req.body)

//     // Check if all required fields are provided in the request body
//     // if (!name || !description || !color || !category || typeof price !== "number" || typeof stock !== "number") {
//     //     return res.status(400).json({ message: "All fields are required and must be valid types" });
//     // }    
//     if (!name || !description || !color || !category || !price || !stock) {
//         return res.status(400).json({ message: "All fields are required and must be valid types" });
//     }

//     try {
//         // Update the product directly using findByIdAndUpdate
//         const updatedProduct = await Product.findByIdAndUpdate(
//             id,
//             {
//                 name,
//                 description,
//                 color,
//                 category,
//                 price,
//                 stock,
//                 // createdBy: user.name // Uncomment if tracking update user
//             },
//             { new: true, runValidators: true } // Options to return updated product and enforce schema validation
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({ message: "Could not find product with this id" });
//         }

//         console.log("Updated product:", updatedProduct); // Log for debugging
//         return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

//     } catch (error) {
//         console.error("Error updating product:", error);
//         return res.status(500).json({ message: "Error updating product" });
//     }
// };



module.exports = {
    createProduct,
    getAllProductsForAdmin,
    getAllProducts,
    getProductDetails,
    getProductDetailsForAdmin,
    deleteProduct,
    updateProduct
};
