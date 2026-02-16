import { createSlice } from "@reduxjs/toolkit";
import { addToCart } from "../cart/cartAction";

const initialState = {
    items: [],
    loading: false,
    error: null,
    message: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartMessage: (state) => {
            state.message = null;
        },
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload?.message || "Added to cart successfully";
                if (action.payload?.cart_items) {
                    state.items = action.payload.cart_items;
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add item to cart";
            });
    },
});

export const { clearCartMessage, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;
