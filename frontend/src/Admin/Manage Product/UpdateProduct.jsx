
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InputMask from "react-input-mask";

const UpdateProduct = () => {

    // const [phoneNumber, setPhoneNumber] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    const { id } = useParams();
     // Get product ID from URL params
    const user = useSelector((state) => state.user.currentUser);
    const idToken = user?.token || ""; 
    // Use the token from currentUser
    
    useEffect(() => {
        // Fetch existing product details
        const fetchProductDetails = async () => {
            try {
                const res = await axios.get(`/product/getProductDetailsForAdmin/${id}`, {
                    headers: { idtoken: idToken },
                });
                const product = res.data.product;
                setName(product.name);
                setDescription(product.description);
                setColor(product.color);
                setCategory(product.category);
                setPrice(product.price);
                setStock(product.stock);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();
    }, [id, idToken]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault(); // Prevent form submission

        const productData = {
            name,
            description,
            color,
            category,
            price,
            stock,
        };

        try {
            const res = await axios.post(`/product/updateProduct/${id}`, productData, {
                headers: { idtoken: idToken }, // Ensure the key matches server expectations
            });
            console.log("Product updated:", res.data); // Handle success response
        } catch (error) {
            console.error("Error updating product:", error.response ? error.response.data : error.message);
        }
    };


    return (
        <>
            <h1>Update Product</h1>
            <form onSubmit={handleUpdateProduct}>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                
                <label htmlFor="description">Description:</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                
                <label htmlFor="color">Color:</label>
                <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} />
                
                <label htmlFor="category">Category:</label>
                <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                
                <label htmlFor="price">Price:</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value)) } />
                
                <label htmlFor="stock">Stock:</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(Number(e.target.value)) } />

                {/* <InputMask mask="(999) 9999999" placeholder="Enter your phone number">{(inputProps) => <input {...inputProps} required />}
                    </InputMask>

                    <InputMask
                mask="99999-9999999-9" // Change '999' and '9999999' based on your specific needs
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                required
            >
                {(inputProps) => <input {...inputProps} />}
            </InputMask> */}
                
                <button type="submit">Update Product</button>
            </form>
        </>
    );
};

export default UpdateProduct;
