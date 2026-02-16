import { createSlice } from "@reduxjs/toolkit";
import { getAllProducts, addProduct } from "../actions/productActions";

const initialState = {
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
            state.isLoading = false;
            state.isError = false;
            state.errorMessage = "";
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false;

                state.products = action.payload.products || action.payload || [];
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            })

            .addCase(addProduct.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.isLoading = false;

                const newProduct = action.payload.product || action.payload;
                if (newProduct) {
                    state.products.push(newProduct);
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload;
            });
    },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
