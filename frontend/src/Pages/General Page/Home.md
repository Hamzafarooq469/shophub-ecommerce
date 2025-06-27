
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../Redux/reducers/guestCartSlice";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Define currentPage here
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state) => state.user.currentUser);
  const idToken = user?.token || "";
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  useEffect(() => {
    const handleProducts = async () => {
      try {
        const res = await axios.get(`/product/getAllProducts?page=${currentPage}&limit=10`); // Fetch products with pagination
        setProducts(res.data.products); // Set products in state
        setTotalPages(res.data.totalPages); // Set total pages in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    handleProducts();

    // Polling to fetch products every 10 seconds (if needed)
    const interval = setInterval(() => {
      handleProducts();
    }, 10000);

    return () => clearInterval(interval);
  }, [currentPage]); // Dependency on currentPage

  const handleCart = async (productId) => {
    const product = products.find(p => p._id === productId);
    if(user) {
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
