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
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      {product ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg mb-2">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="text-lg mb-2">
            <strong>Color:</strong> {product.color}
          </p>
          <p className="text-lg mb-2">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="text-lg mb-2">
            <strong>Price:</strong> ${product.price}
          </p>
          <p className="text-lg mb-2">
            <strong>Stock:</strong> {product.stock}
          </p>
        </div>
      ) : (
        <p className="text-center text-lg">Loading product details...</p>
      )}
    </div>
  );
};

export default GetProductDetails;
