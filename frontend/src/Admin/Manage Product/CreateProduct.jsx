import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { FaPlus, FaSpinner, FaArrowLeft, FaBox, FaTag, FaDollarSign, FaCubes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const user = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        const productData = { 
            name, 
            description, 
            color, 
            category, 
            price: parseFloat(price), 
            stock: parseInt(stock) 
        };
        
        try {
            await axios.post("/product/createProduct", productData, {
                headers: { idtoken: user?.token || "" },
            });
            toast.success("Product created successfully!");
            
            // Reset form
            setName("");
            setDescription("");
            setColor("");
            setCategory("");
            setPrice("");
            setStock("");
            
            // Navigate to products list
            setTimeout(() => {
                navigate('/admin/getAllProducts');
            }, 1500);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while creating the product!");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setColor("");
        setCategory("");
        setPrice("");
        setStock("");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <FaPlus className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                    </div>
                    <p className="text-gray-600">Add a new product to your inventory</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleCreateProduct} className="space-y-6">
                        {/* Basic Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaBox className="h-5 w-5 text-blue-600 mr-2" />
                                Basic Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="Mobile Phone">Mobile Phone</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="clothing">Clothing</option>
                                        <option value="books">Books</option>
                                        <option value="home">Home & Garden</option>
                                        <option value="sports">Sports</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Enter product description"
                                    required
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaTag className="h-5 w-5 text-blue-600 mr-2" />
                                Product Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                                        Color *
                                    </label>
                                    <select
                                        id="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        required
                                    >
                                        <option value="">Select a color</option>
                                        <option value="Black">Black</option>
                                        <option value="White">White</option>
                                        <option value="Gray">Gray</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Blue">Blue</option>
                                        <option value="Red">Red</option>
                                        <option value="Green">Green</option>
                                        <option value="Yellow">Yellow</option>
                                        <option value="Purple">Purple</option>
                                        <option value="Pink">Pink</option>
                                        <option value="Orange">Orange</option>
                                        <option value="Brown">Brown</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Multi">Multi-color</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Price ($) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaDollarSign className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="number" 
                                            id="price" 
                                            value={price} 
                                            onChange={(e) => setPrice(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaCubes className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="number" 
                                            id="stock" 
                                            value={stock} 
                                            onChange={(e) => setStock(e.target.value)} 
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            placeholder="0"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/getAllProducts')}
                                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FaArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                        Creating Product...
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="h-4 w-4 mr-2" />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
