
import { useState, useEffect } from 'react';
import GetShippingInfo from './GetShippingInfo';  // Component to get shipping info
import Cart from "./Cart";  // Component to display cart details
import UpdateShipping from './UpdateShipping';  // Component to update shipping info
import { useSelector } from 'react-redux';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { addToOrder } from '../../Redux/reducers/guestOrderSlice';

const Order = () => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);  // State to track whether editing or viewing shipping info
    const sh = useSelector((state) => state.guestShipping.shipping);
    const ca = useSelector((state) => state.guestCart.cart);
    const user = useSelector((state) => state.user.currentUser);

    const [cartEmpty, setCartEmpty] = useState(false);
    const [shippingEmpty, setShippingEmpty] = useState(false);

    useEffect(() => {
        // Check if the cart or shipping info is empty
        if (!user) {
            setCartEmpty(ca.length === 0);
            setShippingEmpty(!sh || Object.keys(sh).length === 0);
        }
    }, [ca, sh, user]);

    const generateGuestId = () => `guest_${Date.now()}`;

    const handleEditShipping = () => {
        setIsEditing(true);  // Switch to editing mode
    };

    const handleCancelEdit = () => {
        setIsEditing(false);  // Switch back to viewing mode
    };

    const handleOrder = async () => {
        if (user) {
            // Existing logic for registered users
            try {
                const cartResponse = await axios.get(`/cart/getCart/${user.uid}`);
                const shippingResponse = await axios.get(`/shipping/getShippingInfo/${user.uid}`);

                const orderItems = cartResponse.data.cartItems.map(item => ({
                    product: item.product._id, // Use only product ID
                    quantity: item.quantity,
                }));

                const orderData = {
                    userId: user.uid,
                    cartItems: orderItems,
                    shippingId: shippingResponse.data.shipping._id
                };

                // Sending the order data to the backend
                const res = await axios.post(`/order/createOrder/`, orderData);
                console.log("Order created:", res.data);
            } catch (error) {
                console.error("Error creating order:", error.message);
            }
        } else {
            // Logic for guest users
            const guestId = generateGuestId(); // Generate a new guest ID
            const guestData = {
                guest: guestId,
                sh: sh, // Shipping information
                ca: ca.map(item => ({
                    product: item.productId, // Use the product ID from the cart
                    quantity: item.quantity,
                })),
            };

            try {
                // Send guest data to the backend for order creation
                const res = await axios.post("/order/createOrder/", guestData);
                dispatch(addToOrder({
                    cartItems: guestData.ca, // Send the mapped cart items
                    shippingDetails: guestData.sh,
                    id: guestData.guest // Send the shipping info
                }));
                console.log("Order created for guest:", res.data);
            } catch (error) {
                console.error("Error creating guest order:", error.message);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {(!user && cartEmpty && shippingEmpty) || (user && (cartEmpty || shippingEmpty)) ? (
                <p className="text-center text-lg text-red-600">
                    Please add items to your cart and provide shipping information to proceed.
                </p>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Cart />
                    {isEditing ? (
                        <>
                            <UpdateShipping />
                            <button 
                                onClick={handleCancelEdit} 
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                                Back to Shipping Info
                            </button>
                        </>
                    ) : (
                        <>
                            <GetShippingInfo />
                            <button 
                                onClick={handleEditShipping} 
                                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
                                Edit Shipping Info
                            </button>
                        </>
                    )}
                    <button 
                        onClick={handleOrder} 
                        className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Make Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default Order;
