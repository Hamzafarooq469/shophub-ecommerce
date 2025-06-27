import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToShipping } from "../../Redux/reducers/guestShippingSlice";
import InputMask from "react-input-mask";
import { FaTruck, FaUser, FaMapMarkerAlt, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Shipping = () => {
    const user = useSelector((state) => state.user.currentUser);
    const cart = useSelector((state) => state.guestCart.cart);
    const navigate = useNavigate();
    
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

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (cartEmpty) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-gray-400 mb-4">
                        <FaTruck className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Please add items to your cart before proceeding to shipping.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const handleShipping = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            if (user) {
                const shippingData = {
                    userId: user.uid, 
                    name, 
                    phoneNumber,
                    address, 
                    streetNumber, 
                    area, 
                    city, 
                    district, 
                    province, 
                    country, 
                    postalCode
                };
                await axios.post(`/shipping/createShipping`, shippingData);
                toast.success("Shipping information saved successfully!");
                navigate('/order');
            } else {
                const shippingData = {
                    name, 
                    phoneNumber,
                    address, 
                    streetNumber, 
                    area, 
                    city, 
                    district, 
                    province, 
                    country, 
                    postalCode
                };
                dispatch(addToShipping(shippingData));
                toast.success("Shipping information saved successfully!");
                navigate('/order');
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to save shipping information");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <FaTruck className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
                    </div>
                    <p className="text-gray-600">Please provide your shipping details to complete your order</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleShipping} className="space-y-6">
                        {/* Personal Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaUser className="h-5 w-5 text-blue-600 mr-2" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your full name"
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <InputMask
                                        mask="9999-9999999"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    >
                                        {(inputProps) => (
                                            <input
                                                {...inputProps}
                                                placeholder="0300-1234567"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        )}
                                    </InputMask>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="border-b border-gray-200 pb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FaMapMarkerAlt className="h-5 w-5 text-blue-600 mr-2" />
                                Address Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Enter your address"
                                        value={address}
                                        required
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="streetNumber"
                                        placeholder="Enter street name"
                                        value={streetNumber}
                                        required
                                        onChange={(e) => setStreetNumber(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                                        Area *
                                    </label>
                                    <input
                                        type="text"
                                        id="area"
                                        placeholder="Enter area"
                                        value={area}
                                        required
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        placeholder="Enter city"
                                        value={city}
                                        required
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                                        District *
                                    </label>
                                    <input
                                        type="text"
                                        id="district"
                                        placeholder="Enter district"
                                        value={district}
                                        required
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
                                        Province *
                                    </label>
                                    <select
                                        value={province}
                                        onChange={(e) => setProvince(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Select a province</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="ICT">ICT</option>
                                        <option value="Sindh">Sindh</option>
                                        <option value="KPK">KPK</option>
                                        <option value="Balochistan">Balochistan</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        id="country"
                                        placeholder="Enter country"
                                        value={country}
                                        required
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        placeholder="Enter postal code"
                                        value={postalCode}
                                        required
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/cart')}
                                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <FaArrowLeft className="h-4 w-4 mr-2" />
                                Back to Cart
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaTruck className="h-4 w-4 mr-2" />
                                        Continue to Order
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
