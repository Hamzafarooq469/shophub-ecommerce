import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeItemFromCart } from "../../Redux/reducers/guestCartSlice";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaTruck, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const guestCart = useSelector((state) => state.guestCart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      if (user) {
        try {
          const res = await axios.get(`/cart/getCart/${user.uid}`);
          setCartItems(res.data.cartItems);
        } catch (error) {
          console.error("Error fetching cart items:", error);
          toast.error("Failed to load cart items");
        }
      } else {
        setCartItems(guestCart);
      }
      setLoading(false);
    };

    fetchCartItems();
  }, [user, guestCart]);

  const decreaseQuantity = async (productId) => {
    setUpdating(true);
    if (user) {
      try {
        const cartItem = { userId: user.uid };
        await axios.post(`/cart/decreaseQuantity/${productId}`, cartItem);
        const res = await axios.get(`/cart/getCart/${user.uid}`);
        setCartItems(res.data.cartItems);
        toast.success("Quantity updated");
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to update quantity");
      }
    } else {
      const currentCartItem = guestCart.find(item => item.productId === productId);
      if (currentCartItem && currentCartItem.quantity > 1) {
          dispatch(addToCart({ 
              productId, 
              quantity: -1 
          }));
          toast.success("Quantity updated");
      } else {
          toast.warning("Quantity cannot be less than 1");
      }
    }
    setUpdating(false);
  };

  const increaseQuantity = async (productId) => {
    setUpdating(true);
    if (user) {
      try {
        const cartItem = { userId: user.uid, quantity: 1 };
        await axios.post(`/cart/increaseQuantity/${productId}`, cartItem);
        const res = await axios.get(`/cart/getCart/${user.uid}`);
        setCartItems(res.data.cartItems);
        toast.success("Quantity updated");
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to update quantity");
      }
    } else {
      dispatch(addToCart({ productId, quantity: 1 }));
      toast.success("Quantity updated");
    }
    setUpdating(false);
  };

  const removeFromCart = async (productId) => {
    if (user) {
        try {
            await axios.delete(`/cart/removeFromCart/${productId}`, {
                data: { userId: user.uid },
            });
            const res = await axios.get(`/cart/getCart/${user.uid}`);
            setCartItems(res.data.cartItems);
            toast.success("Item removed from cart");
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to remove item");
        }
    } else {
        dispatch(removeItemFromCart(productId));
        toast.success("Item removed from cart");
    }
  };

  const handleGoToShippingInfo = () => {
    navigate("/createShipping");
  };

  const calculateTotal = () => {
    const items = user ? cartItems : guestCart;
    return items.reduce((total, item) => {
      const price = user ? (item.product?.price || 0) : (item.productPrice || 0);
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getItemCount = () => {
    const items = user ? cartItems : guestCart;
    return items.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const items = user ? cartItems : guestCart;
  const total = calculateTotal();
  const itemCount = getItemCount();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            Continue Shopping
          </button>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div key={user ? item._id : index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {user ? (item.product?.name || "Unknown Product") : item.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {user ? (item.product?.description || "N/A") : item.productDescription}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span>Category: {user ? (item.product?.category || "N/A") : item.productCategory}</span>
                              <span>Color: {user ? (item.product?.color || "N/A") : item.productColor}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => decreaseQuantity(user ? item.product._id : item.productId)}
                                  disabled={updating}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                  <FaMinus className="h-3 w-3" />
                                </button>
                                <span className="font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => increaseQuantity(user ? item.product._id : item.productId)}
                                  disabled={updating}
                                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                                >
                                  <FaPlus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-blue-600">
                                  ${user ? (item.product?.price || 0) : item.productPrice}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Stock: {user ? (item.product?.stock || 0) : item.productStock}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(user ? item.product._id : item.productId)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleGoToShippingInfo}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaTruck className="h-4 w-4" />
                  Proceed to Shipping
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaSpinner className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;




