import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Redux/reducers/guestCartSlice";
import { FaSearch, FaFilter, FaShoppingCart, FaEye, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("asc");
    const limit = 12;

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        setCurrentPage(1);
    };  

    useEffect(() => {
        const handleProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`/product/getAllProducts`, {
                    params: {
                        page: currentPage,
                        limit: limit,
                        search: searchQuery,
                        category: categoryFilter,
                        color: colorFilter,
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        sortBy: sortBy,
                        sortOrder: sortOrder,
                    },
                });

                setProducts(res.data.products); 
                setTotalPages(res.data.totalPages); 
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products. Please try again.");
                toast.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        
        handleProducts();
    }, [currentPage, searchQuery, categoryFilter, colorFilter, minPrice, maxPrice, sortBy, sortOrder]);

    const handleCart = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (user) {
            try {
                const cartData = {
                    userId: user?.uid || "guest",
                    quantity: 1,
                };
                await axios.post(`/cart/addToCart/${productId}`, cartData);
                toast.success("Product added to cart successfully!");
            } catch (error) {
                console.error("Error adding product to cart:", error);
                toast.error("Failed to add product to cart");
            }
        } else {
            dispatch(addToCart({ 
                productId, 
                quantity: 1, 
                productName: product.name,
                productDescription: product.description,
                productColor: product.color,
                productCategory: product.category,
                productPrice: product.price,
                productStock: product.stock,
            }));
            toast.success("Product added to cart!");
        }
    };  

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setCategoryFilter("");
        setColorFilter("");
        setMinPrice("");
        setMaxPrice("");
        setSortBy("createdAt");
        setSortOrder("asc");
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ShopHub</h1>
                    <p className="text-lg text-gray-600">Discover amazing products at great prices</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearchSubmit} className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="Search products..." 
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                            <input 
                                type="number" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                                placeholder="Min" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                            <input 
                                type="number" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                                placeholder="Max" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select 
                                onChange={(e) => setCategoryFilter(e.target.value)} 
                                value={categoryFilter} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="electronics">Electronics</option>
                                <option value="Mobile Phone">Mobile Phone</option>
                                <option value="Laptop">Laptop</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                            <select 
                                onChange={(e) => setColorFilter(e.target.value)} 
                                value={colorFilter} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Colors</option>
                                <option value="Gray">Gray</option>
                                <option value="Black">Black</option>
                                <option value="Silver">Silver</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select 
                                onChange={(e) => setSortBy(e.target.value)} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="createdAt">Date</option>
                                <option value="price">Price</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                            <select 
                                onChange={(e) => setSortOrder(e.target.value)} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={clearFilters}
                            className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
                        >
                            <FaFilter className="h-3 w-3" />
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h2>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Category:</span> {product.category}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Color:</span> {product.color}
                                            </p>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                <span className="font-medium">Description:</span> {product.description}
                                            </p>
                                            <p className="text-lg font-bold text-blue-600">
                                                ${product.price}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Stock: {product.stock} units
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => navigate(`/product/${product._id}`)} 
                                                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FaEye className="h-4 w-4" />
                                                Details
                                            </button>
                                            <button 
                                                onClick={() => handleCart(product._id)} 
                                                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <FaShoppingCart className="h-4 w-4" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-8 space-x-2">
                                <button 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1} 
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                
                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                        if (page > totalPages) return null;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-2 rounded-lg ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages} 
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <FaSearch className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
  