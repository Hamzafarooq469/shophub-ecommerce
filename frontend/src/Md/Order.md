
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
        if(!user) {
            setCartEmpty(ca.length === 0);
            setShippingEmpty(!sh || Object.keys(sh).length === 0);

        }
    }, [ca, sh]);

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
        <>
            {(!user && cartEmpty && shippingEmpty) || (user && (cartEmpty || shippingEmpty)) ? (
                <p>Please add items to your cart and provide shipping information to proceed.</p>
            ) : (
                <>
                    {isEditing ? (
                        <>
                            <UpdateShipping />
                            <button onClick={handleCancelEdit}>Back to Shipping Info</button>
                        </>
                    ) : (
                        <>
                            <GetShippingInfo />
                            <button onClick={handleEditShipping}>Edit Shipping Info</button>
                        </>
                    )}
                    <Cart />
                    <button onClick={handleOrder}>Make Order</button>
                </>
            )}
        </>
    );
};

export default Order;
