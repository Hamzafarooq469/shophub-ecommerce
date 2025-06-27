
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const GetAllProducts = () => {
    const [products, setProducts] = useState([]);

    const user = useSelector((state) => state.user.currentUser);
    console.log(user);
    const idToken = user?.token || ""; // Use the token from currentUser

    const { id } = useParams()

    useEffect(() => {
        const handleProducts = async () => {
            try {
            const res = await axios.get("/product/getAllProductsForAdmin", {
                headers: { idtoken: idToken },
            });
                setProducts(res.data.product); // Set products in state
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        handleProducts();

        // Set up polling to fetch products every 10 seconds
        const interval = setInterval(() => {
            handleProducts(); // Fetch products every 10 seconds
        }, 10000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const deleteProduct = async (productId) => {
        try {
            const res = await axios.delete(`/product/deleteProduct/${productId}`, {
                headers: { idtoken: idToken }, // Include token if necessary
            });
            console.log(res.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <h1> Admin </h1>
            {/* <h1>All Products</h1> */}
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} 
                    // style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                    >
                        <h2>{product.name}</h2>
                        <p><strong>Category:</strong> {product.category}</p>
                        <p><strong>Color:</strong> {product.color}</p>
                        <p><strong>Description:</strong> {product.description}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                        <p><strong>Stock:</strong> {product.stock}</p>
                        <p><strong>Created by:</strong> {product.createdBy}</p>
                        <p><strong>Created at:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                        <button onClick={() => window.location.href = `/admin/products/${product._id}`}>Get Admin Details</button>
                        <button onClick={() => window.location.href = `/admin/updateProduct/${product._id}`}> Update Product </button>
                        <button onClick={() => deleteProduct(product._id)}>Delete Product</button>


                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
};

export default GetAllProducts;
