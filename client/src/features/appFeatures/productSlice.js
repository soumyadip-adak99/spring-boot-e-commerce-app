import { createSlice } from "@reduxjs/toolkit";
import { getProductById, getAllProducts } from "../product/productAction";

const initialState = {
    product: null,
    products: [],
    isLoading: false,
    isError: false,
    errorMessage: "",
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        resetProductState: (state) => {
            state.product = null;
            state.isLoading = false;
            state.isError = false;
            state.errorMessage = "";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.product = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
