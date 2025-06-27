

import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UpdateShipping = () => {
    const user = useSelector((state) => state.user.currentUser);
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

    const handleShippingUpdate = async (e) => {
        e.preventDefault();
        try {
            const shippingData = {
                userId: user.uid,  // Add user ID
                name,
                phoneNumber,
                address,
                streetNumber,
                area,
                city,
                district,
                province,
                country,
                postalCode,
            };
    
            const res = await axios.put(`/shipping/updateShipping`, shippingData);
            console.log(res.data); // Handle success response
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <h1>Update Shipping</h1>
            <form onSubmit={handleShippingUpdate}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Phone Number:</label>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <label>Address:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                <label>Street Number:</label>
                <input type="text" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
                <label>Area:</label>
                <input type="text" value={area} onChange={(e) => setArea(e.target.value)} />
                <label>City:</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                <label>District:</label>
                <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} />
                <label>Province:</label>
                <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} />
                <label>Country:</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
                <label>Postal Code:</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                <button type="submit">Update Shipping</button>
            </form>
        </>
    );
};

export default UpdateShipping;
