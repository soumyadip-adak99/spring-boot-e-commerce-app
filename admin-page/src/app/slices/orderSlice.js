import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders } from "../actions/ordersAction";

const initialState = {
    orders: [],
    loading: false,
    error: null,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch orders";
            });
    },
});

export default orderSlice.reducer;
