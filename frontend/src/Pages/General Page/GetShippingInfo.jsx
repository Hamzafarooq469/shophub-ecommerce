import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";

const ShippingTwo = () => {
    const user = useSelector((state) => state.user.currentUser);
    const [shippingInfo, setShippingInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShippingInfo = async () => {
            if (user && user.uid) {
                try {
                    const shippingRes = await axios.get(`/shipping/getShippingInfo/${user.uid}`);
                    console.log("Fetching shipping info:", shippingRes.data);

                    setShippingInfo(shippingRes.data.shipping); // Set the shipping info
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
        <div className="p-6 bg-gray-100 min-h-screen">
            {loading ? (
                <h1 className="text-center text-lg font-bold">Loading...</h1>
            ) : (
                <>
                    <h1 className="text-2xl font-bold mb-4 text-center">Shipping Information</h1>
                    {shippingInfo ? (
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Shipping Details</h2>
                            <p className="mb-1"><strong>Name:</strong> {shippingInfo.name}</p>
                            <p className="mb-1"><strong>Address:</strong> {shippingInfo.address}, {shippingInfo.streetNumber}</p>
                            <p className="mb-1"><strong>Area:</strong> {shippingInfo.area}</p>
                            <p className="mb-1"><strong>City:</strong> {shippingInfo.city}</p>
                            <p className="mb-1"><strong>Province:</strong> {shippingInfo.province}</p>
                            <p className="mb-1"><strong>District:</strong> {shippingInfo.district}</p>
                            <p className="mb-1"><strong>Country:</strong> {shippingInfo.country}</p>
                            <p className="mb-1"><strong>Postal Code:</strong> {shippingInfo.postalCode}</p>
                            <p className="mb-1"><strong>Phone Number:</strong> {shippingInfo.phoneNumber}</p>
                        </div>
                    ) : (
                        <p className="text-center text-yellow-600">No shipping info found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default ShippingTwo;
