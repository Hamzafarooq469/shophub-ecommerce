
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import Cart from "./Cart";
import UpdateShipping from "./UpdateShipping";
// import CreateShipping from "./CreateShipping";

const ShippingTwo = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [shippingInfo, setShippingInfo] = useState(null);
    // const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShippingInfo = async () => {
            if (user && user.uid) {
                try {
                    const shippingRes = await axios.get(`/shipping/getShippingInfo/${user.uid}`);
                    // const cartRes = await axios.get(`/cart/getCart/${user.uid}`);
                    
                    console.log("Fetching shipping info:", shippingRes.data);
                    // console.log("Fetching Cart info:", cartRes.data);

                    setShippingInfo(shippingRes.data.shipping); // Set the shipping info
                    // setCartItems(cartRes.data.cartItems); // Set the cart items
                } catch (error) {
                    console.log("Error fetching data:", error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchShippingInfo();
    }, [user]);

    return (
        <>  
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <h1>Shipping Information</h1>
                    {shippingInfo ? (
                        <div>
                            <h2>Shipping Details</h2>
                            <p><strong>Name:</strong> {shippingInfo.name}</p>
                            <p><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.streetNumber}</p>
                            <p><strong>Area:</strong> {shippingInfo.area}</p>
                            <p><strong>City:</strong> {shippingInfo.city}</p>
                            <p><strong>Province:</strong> {shippingInfo.province}</p>
                            <p><strong>District:</strong> {shippingInfo.district}</p>
                            <p><strong>Country:</strong> {shippingInfo.country}</p>
                            <p><strong>Postal Code:</strong> {shippingInfo.postalCode}</p>
                            <p><strong>Phone Number:</strong> {shippingInfo.phoneNumber}</p>
                        </div>
                    ) : (
                        <p>No shipping info found.</p>
                    )}

                </>
            )}
        </>
    );
};

export default ShippingTwo;
