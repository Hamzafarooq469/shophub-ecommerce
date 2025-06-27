

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const GetProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`/product/getProductDetails/${id}`);
        setProduct(res.data.product);
        console.log("bb")
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  return (
    <div>
      {product ? (
        <div>
          <h1>{product.name}</h1>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default GetProductDetails;
