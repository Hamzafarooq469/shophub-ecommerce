

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { addToShipping } from "../../Redux/reducers/guestShippingSlice";
import { useDispatch } from "react-redux";

const Shipping = () => {

    const user = useSelector( (state) => state.user.currentUser)
    const cart = useSelector((state) => state.guestCart.cart)
    // console.log(cart.length)


    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [area, setArea] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [province, setProvince] = useState("");
    const [country, setCountry] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true);
    const [cartEmpty, setCartEmpty] = useState(false);

    useEffect(() => {
        const checkCart = async () => {
            setLoading(true);
            try {
                if (user) {
                    const res = await axios.get(`/cart/getCart/${user.uid}`);
                    const cartItems = res.data.cartItems;

                    if (!cartItems || cartItems.length === 0) {
                        setCartEmpty(true);
                    }
                } else if (!cart || cart.length === 0) {
                    setCartEmpty(true);
                }
            } catch (error) {
                console.error("Error checking cart:", error);
            } finally {
                setLoading(false);
            }
        };

        checkCart();
    }, [user, cart]);

    if (loading) return <p>Loading...</p>;
    
    if (cartEmpty) {
        return <p>Your cart is empty. Please add items to your cart.</p>;
    }


    const handleShipping = async (e) => {
        e.preventDefault()
        if(user) {
            try {
                const shippingData = {
                    userId: user.uid, name, phoneNumber,address, streetNumber, area, city, district, province, country, postalCode
                }
                const res = await axios.post(`/shipping/createShipping`, shippingData )
            } catch (error) {
                console.log(error.message)
            }
        } else {
            const shippingData = {
                name, phoneNumber,address, streetNumber, area, city, district, province, country, postalCode
            }
            dispatch(addToShipping(shippingData))
            console.log(addToShipping)
        }
    }

    return (
        <>
            <h1>Shipping</h1>
            <form action="" onSubmit={handleShipping}>

            <label htmlFor="">Name:</label>
            <input type="text" value={name} required onChange={(e) => setName(e.target.value)} />

            <label htmlFor="">Phone Number:</label>
            <input type="text" value={phoneNumber} required onChange={(e) => setPhoneNumber(e.target.value)} />

            <label htmlFor="">Address:</label>
            <input type="text" value={address} required onChange={(e) => setAddress(e.target.value)} />

            <label htmlFor="">Street Number:</label>
            <input type="text" value={streetNumber} required onChange={(e) => setStreetNumber(e.target.value)} />

            <label htmlFor="">Area:</label>
            <input type="text" value={area} required onChange={(e) => setArea(e.target.value)} />

            <label htmlFor="">City:</label>
            <input type="text" value={city} required onChange={(e) => setCity(e.target.value)} />

            <label htmlFor="">District:</label>
            <input type="text" value={district} required onChange={(e) => setDistrict(e.target.value)} />

            <label htmlFor="">Province:</label>
            <input type="text" value={province} required onChange={(e) => setProvince(e.target.value)} />

            <label htmlFor="">Country:</label>
            <input type="text" value={country} required onChange={(e) => setCountry(e.target.value)} />

            <label htmlFor="">Postal Code:</label>
            <input type="text" value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} />

            <button> Ship Data </button>

            </form>



        </>
    );
};

export default Shipping;
