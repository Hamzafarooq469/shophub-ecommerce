
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const GetOrder = () => {
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    
    const user = useSelector((state) => state.user.currentUser);
    const id = useSelector((state) => state.guestOrder?.order?.id); // Use optional chaining
    console.log(id);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                let res;
                // Check if user exists and fetch accordingly
                if (user && user.uid) {
                    res = await axios.get(`/order/getOrder/${user.uid}`);
                } else if (id) { // Only fetch with id if it is defined
                    res = await axios.get(`/order/getOrder/${id}`);
                } else {
                    setError("No user or order ID available"); // Handle the case where neither exists
                    return; // Exit early if there's no valid ID
                }
                
                console.log(res.data.order);
                
                if (res.status === 200) {
                    setOrder(res.data.order); // Store the order data in state
                } else {
                    setError("Order not found");
                }
            } catch (error) {
                setError("Failed to fetch order");
                console.error(error.message);
            }
        };

        fetchOrder();
    }, [user, id]);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {error && <p className="text-red-500">{error}</p>}
            {order ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Order Details</h2>
                    <p className="mb-2"><strong>Order ID:</strong> {order._id}</p>
                    <p className="mb-2"><strong>User ID:</strong> {order.user}</p>
                    
                    <h3 className="text-xl font-semibold mt-4">Shipping Details:</h3>
                    {order.shipping ? (
                        <div className="mb-4">
                            <p><strong>Shipping ID:</strong> {order.shipping._id}</p>
                            <p><strong>Name:</strong> {order.shipping.name}</p>
                            <p><strong>Phone Number:</strong> {order.shipping.phoneNumber}</p>
                            <p><strong>Address:</strong> {order.shipping.address}</p>
                            {order.shipping.streetNumber && (
                                <p><strong>Street Number:</strong> {order.shipping.streetNumber}</p>
                            )}
                            {order.shipping.area && (
                                <p><strong>Area:</strong> {order.shipping.area}</p>
                            )}
                            <p><strong>City:</strong> {order.shipping.city}</p>
                            <p><strong>District:</strong> {order.shipping.district}</p>
                            <p><strong>Province:</strong> {order.shipping.province}</p>
                            <p><strong>Country:</strong> {order.shipping.country}</p>
                            <p><strong>Postal Code:</strong> {order.shipping.postalCode}</p>
                        </div>
                    ) : (
                        <p className="text-yellow-600">Shipping details are not available.</p>
                    )}
                    
                    <h3 className="text-xl font-semibold mt-4">Cart Items:</h3>
                    {order.cart && order.cart.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {order.cart.map((item, index) => (
                                <li key={index} className="mb-4 border p-4 rounded shadow-sm">
                                    <p><strong>Product ID:</strong> {item.product._id}</p> 
                                    <p><strong>Product Name:</strong> {item.product.name}</p> 
                                    <p><strong>Product Description:</strong> {item.product.description}</p> 
                                    <p><strong>Color:</strong> {item.product.color}</p>
                                    <p><strong>Category:</strong> {item.product.category}</p>
                                    <p><strong>Price:</strong> ${item.product.price.toFixed(2)}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-yellow-600">No items in the cart.</p>
                    )}
                </div>
            ) : (
                !error && <p className="text-gray-500">Loading order...</p>
            )}
        </div>
    );
};

export default GetOrder;
