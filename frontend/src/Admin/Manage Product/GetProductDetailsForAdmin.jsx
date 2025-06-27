
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const GetProductDetailsForAdmin = () => {

    const { id } = useParams(); 
    const [product, setProduct] = useState(null);

    const user = useSelector((state) => state.user.currentUser);
    console.log(user);
    const idToken = user?.token || ""; // Use the token from currentUser
  
    useEffect(() => {
      const fetchProductDetails = async () => {
        try {
          const res = await axios.get(`/product/getProductDetailsForAdmin/${id}`, {
            headers: { idtoken: idToken },
          });
          setProduct(res.data.product);
          console.log(res.data.product)
          console.log("ab")
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
  
      fetchProductDetails();
    }, [id]);

  return (
    <>
          <div>
      {product ? (
        <div>
          <h1>{product.name}</h1>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Created by:</strong> {product.createdBy}</p>
          <p><strong>Created at:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
    </>
  )
}

export default GetProductDetailsForAdmin
