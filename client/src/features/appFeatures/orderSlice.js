import { createSlice } from "@reduxjs/toolkit";
import { createOrder } from "../orders/orderAction";

const initialState = {
    order: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
};

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
            state.order = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload;
                state.errorMessage = "";
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage = action.payload || "Failed to place order";
            });
    },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
