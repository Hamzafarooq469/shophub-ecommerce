
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Redux/reducers/guestCartSlice";

const Home = () => {
    const [products, setProducts] = useState([]);
    const user = useSelector((state) => state.user.currentUser);
    const idToken = user?.token || "";
    const navigate = useNavigate(); 
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [minPrice, setMinPrice] = useState(""); // New state for min price
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("createdAt"); // Default sort field
    const [sortOrder, setSortOrder] = useState("asc");
    const limit = 10;

    const handleSearchSubmit = (e) => {
        e.preventDefault(); 
        setCurrentPage(1); // Reset to first page on search
    };  

    useEffect(() => {
        const handleProducts = async () => {
            try {
                const res = await axios.get(`/product/getAllProducts`, {
                    params: {
                        page: currentPage,
                        limit: limit,
                        search: searchQuery,
                        category: categoryFilter,
                        color: colorFilter,
                        minPrice: minPrice, // Include min price in params
                        maxPrice: maxPrice,
                        sortBy: sortBy, // Include sort field in params
                        sortOrder: sortOrder,
                    },
                });

                setProducts(res.data.products); 
                setTotalPages(res.data.totalPages); 
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        
        handleProducts();

        const interval = setInterval(() => {
            handleProducts();
        }, 10000);

        return () => clearInterval(interval);
    }, [currentPage, searchQuery, categoryFilter, colorFilter, minPrice, maxPrice, sortBy, sortOrder]);  // Dependency on filters

    const handleCart = async (productId) => {
        const product = products.find(p => p._id === productId);
        if (user) {
            try {
                const cartData = {
                    userId: user?.uid || "guest",
                    quantity: 1,
                };
                const res = await axios.post(`/cart/addToCart/${productId}`, cartData);
                console.log(res.data);
            } catch (error) {
                console.error("Error adding product to cart:", error);
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
            console.log("Product added to cart for guest user.");
        }
    };  

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h1>All Products</h1>
            <form onSubmit={handleSearchSubmit}>
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search products" 
                />
                <input 
                    type="text" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                    placeholder="Min Price" 
                />
                <input 
                    type="text" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                    placeholder="Max Price" 
                />
                {/* <button type="submit">Search</button> */}
            </form>

            <div>
    <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">Sort by Date</option>
        <option value="price">Sort by Price</option>
        <option value="name">Sort by Name</option>
    </select>
    <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
    </select>
</div>

            <div>
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter}>
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Laptop">Laptop</option>
                    {/* Add more categories as needed */}
                </select>

                <select onChange={(e) => setColorFilter(e.target.value)} value={colorFilter}>
                    <option value="">All Colors</option>
                    <option value="Gray">Gray</option>
                    <option value="Black">Black</option>
                    <option value="Silver">Silver</option>
                    {/* Add more colors as needed */}
                </select>
            </div>

            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                        <h2>{product.name}</h2>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Color:</strong> {product.color}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <button onClick={() => window.location.href = `/product/${product._id}`}>Get Details</button>
                        <button onClick={() => handleCart(product._id)}>Add to Cart</button>
                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}

            {/* Pagination Controls */}
            <div>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Home;
