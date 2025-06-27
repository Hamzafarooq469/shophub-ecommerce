
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeItemFromCart } from "../../Redux/reducers/guestCartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = useSelector((state) => state.user.currentUser); // Get the current user from Redux
  const guestCart = useSelector((state) => state.guestCart.cart); // Get guest cart items
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) {
        try {
          // Fetch cart items for the current user using their Firebase UID
          const res = await axios.get(`/cart/getCart/${user.uid}`);
          console.log(res.data);
          setCartItems(res.data.cartItems); // Set cart items in the state
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        // If no user, set cart items from Redux guest cart
        setCartItems(guestCart);
      }
    };

    fetchCartItems(); // Fetch cart items based on user authentication
  }, [user, guestCart]);

  const decreaseQuantity = async (productId) => {
    if (user) {
      // Logic for decreasing quantity in the user's cart
      try {
        const cartItem = { userId: user.uid };
        await axios.post(`/cart/decreaseQuantity/${productId}`, cartItem);
        const res = await axios.get(`/cart/getCart/${user.uid}`);
        setCartItems(res.data.cartItems);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      const currentCartItem = guestCart.find(item => item.productId === productId);
      // Ensure the current quantity is greater than 1 before decreasing
      if (currentCartItem && currentCartItem.quantity > 1) {
          dispatch(addToCart({ 
              productId, 
              quantity: -1 
          }));
      } else {
          console.log("Quantity cannot be less than 1.");
      }
    }
  };

  const increaseQuantity = async (productId) => {
    if (user) {
      // Logic for increasing quantity in the user's cart
      try {
        const cartItem = { userId: user.uid, quantity: 1 };
        await axios.post(`/cart/increaseQuantity/${productId}`, cartItem);
        const res = await axios.get(`/cart/getCart/${user.uid}`);
        setCartItems(res.data.cartItems);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // Logic for guest cart
      dispatch(addToCart({ productId, quantity: 1 })); // Add to guest cart
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
        // Logic for removing from the authenticated user's cart
        try {
            await axios.delete(`/cart/removeFromCart/${productId}`, {
                data: { userId: user.uid },
            });
            const res = await axios.get(`/cart/getCart/${user.uid}`);
            setCartItems(res.data.cartItems);
        } catch (error) {
            console.log(error.message);
        }
    } else {
        // Logic for guest cart
        dispatch(removeItemFromCart(productId)); // Remove from guest cart
    }
  };

  const handleGoToShippingInfo = () => {
    navigate("/createShipping"); // Change this to your actual shipping info route
  };

  return (
    <>
      <h1>Cart</h1>
      {user ? ( // Check if user is logged in
        cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h2>Product Name: {item.product ? item.product.name : "Unknown Product"}</h2>
              <p><strong>Product ID:</strong> {item.product ? item.product._id : "N/A"}</p>
              <p><strong>Description:</strong> {item.product ? item.product.description : "N/A"}</p>
              <p><strong>Color:</strong> {item.product ? item.product.color : "N/A"}</p>
              <p><strong>Category:</strong> {item.product ? item.product.category : "N/A"}</p>
              <p><strong>Price:</strong> ${item.product ? item.product.price : "N/A"}</p>
              <p><strong>Stock:</strong> {item.product ? item.product.stock : "N/A"}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <button onClick={() => decreaseQuantity(item.product._id)}>Decrease quantity</button>
              <button onClick={() => increaseQuantity(item.product._id)} disabled={item.quantity >= item.product.stock}>Increase quantity</button>
              <button onClick={() => removeFromCart(item.product._id)}>Remove from cart</button>
            </div>
          ))
        ) : (
          <p>Your cart is empty. Please add products to view them.</p>
        )
      ) : (
        // If the user is not logged in, render the guest cart
        guestCart.length > 0 ? (
          guestCart.map((item, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h2>Guest Product Name: {item.productName}</h2>
              <p><strong>Product ID:</strong> {item.productId || "N/A"}</p>
              <p><strong>Description:</strong> {item.productDescription}</p>
              <p><strong>Color:</strong> {item.productColor}</p>
              <p><strong>Category:</strong> {item.productCategory}</p>
              <p><strong>Price:</strong> ${item.productPrice}</p>
              <p><strong>Stock:</strong> {item.productStock}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <button onClick={() => increaseQuantity(item.productId)}>Increase quantity</button>
              <button onClick={() => decreaseQuantity(item.productId)}>Decrease quantity</button>
              <button onClick={() => removeFromCart(item.productId)}>Remove from cart</button>
            </div>
          ))
        ) : (
          <p>Your cart is empty. Please add products to view them.</p>
        )
      )}
      {cartItems.length > 0 && ( // Only show the shipping info button if there are items in the cart
        <button onClick={handleGoToShippingInfo}>Add Shipping Info</button>
      )}
      <button onClick={() => navigate("/")}>Go to shopping</button>
    </>
  );
};

export default Cart;
