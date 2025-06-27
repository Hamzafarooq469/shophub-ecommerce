import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shipping: null,
}

const guestShippingSlice = createSlice({
    name: "shipping",
    initialState,
    reducers: {
        addToShipping: (state, action) => {
            const {
                name, phoneNumber, address, streetNumber, area, city, district, province, country, postalCode 
            } = action.payload;

            // Update shipping state with the new shipping details
            state.shipping = {
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
        },
        clearShipping: (state) => {
            state.shipping = null
        }
    }
})

export const { addToShipping, clearShipping } = guestShippingSlice.actions;

export default guestShippingSlice.reducer;
