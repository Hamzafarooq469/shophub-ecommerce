
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [], // Stores cart items for guest users
};

const guestCartSlice = createSlice({
    name: "guestCart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { 
                productId, 
                quantity, 
                productName, 
                productDescription, 
                productColor, 
                productCategory, 
                productPrice, 
                productStock 
            } = action.payload;
            
            const existingItem = state.cart.find(item => item.productId === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cart.push({ 
                    productId, 
                    quantity, 
                    productName, 
                    productDescription, 
                    productColor, 
                    productCategory, 
                    productPrice, 
                    productStock 
                });
            }
        },
        removeItemFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.productId !== action.payload);
        },
        clearCart: (state) => {
            state.cart = []
        }
    },
});

export const { addToCart, removeItemFromCart, clearCart } = guestCartSlice.actions;
export default guestCartSlice.reducer;
