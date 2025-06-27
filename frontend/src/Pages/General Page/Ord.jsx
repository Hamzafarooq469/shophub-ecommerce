// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";

// const Ord = () => {
//     const user = useSelector((state) => state.user.currentUser);
//     console.log("Current User:", user); // Log the current user
//     const [orderDetails, setOrderDetails] = useState(null); // State to hold order details

//     useEffect(() => {
//         const handle = async () => {
//             if (!user) return; // Ensure user is available
//             try {
//                 const cart = await axios.get(`/cart/getCart/${user.uid}`);
//                 console.log("Cart Data:", cart.data); // Log cart data
                
//                 if (!Array.isArray(cart.data.cartItems) || cart.data.cartItems.length === 0) {
//                     console.log("Cart is empty");
//                     return;
//                 }

//                 const shipping = await axios.get(`/shipping/getShippingInfo/${user.uid}`);
//                 console.log("Shipping Data:", shipping.data); // Log shipping data
                
//                 if (!shipping.data.shipping) {
//                     console.log("Shipping information not found");
//                     return;
//                 }

//                 const orderData = {
//                     userId: user.uid,
//                     cart: cart.data.cartItems.map(item => item._id),
//                     shipping: shipping.data.shipping
//                 };
                
//                 const res = await axios.post("/order/createOrder", orderData);
//                 console.log("Created Order:", res.data); // Check the created order details

//                 // Save the order details in state
//                 setOrderDetails(res.data.order); // Adjust based on your response structure
//             } catch (error) {
//                 console.log("Error creating order:", error.message);
//             }
//         };

//         handle(); // Call the handle function
//     }, [user]);

//     return (
//         <div>
//             {orderDetails ? (
//                 <div>
//                     <h2>Order Details</h2>
//                     <p>Order ID: {orderDetails._id}</p>
//                     <p>User ID: {orderDetails.user}</p>
//                     <p>Created At: {new Date(orderDetails.createdAt).toLocaleString()}</p>
//                     <h3>Cart Items:</h3>
//                     <ul>
//                         {orderDetails.cart.map((item) => (
//                             <li key={item._id}>{item.product.name} (Quantity: {item.quantity})</li>
//                         ))}
//                     </ul>
//                     <h3>Shipping Information:</h3>
//                     <p>{orderDetails.shipping.address}</p>
//                     <p>{orderDetails.shipping.city}, {orderDetails.shipping.state}, {orderDetails.shipping.zip}</p>
//                 </div>
//             ) : (
//                 <p>Loading order details...</p>
//             )}
//         </div>
//     );
// };

// export default Ord;
