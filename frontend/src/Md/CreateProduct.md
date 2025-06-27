
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const CreateProduct = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    const user = useSelector((state) => state.user.currentUser);
    const idToken = user?.token || ""; // Use the token from currentUser

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        const productData = {
            name, description, color, category, price, stock,
        };

        try {
            const res = await axios.post("/product/createProduct", productData, {
                headers: { idtoken: idToken }, // Ensure the key matches server expectations
            });
            console.log("Product created:", res.data);
            toast.success("Product created successfully!"); // Show success notification
        } catch (error) {
            console.error("Error creating product:", error.response ? error.response.data : error.message);
            toast.error(error.response ? error.response.data.message : "An error occurred!"); // Show error notification
        }
    };

    return (
        <>
            <ToastContainer /> 
            <form onSubmit={handleCreateProduct}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                
                <label htmlFor="color">Color:</label>
                <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                
                <label htmlFor="category">Category:</label>
                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                
                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
                
                <label htmlFor="stock">Stock:</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                
                <button type="submit">Create Product</button>
            </form>
        </>
    );
};

export default CreateProduct;
