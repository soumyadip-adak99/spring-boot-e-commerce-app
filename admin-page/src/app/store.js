import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../app/slices/authSlice";
import orderReducer from "../app/slices/orderSlice";
import productReducer from "../app/slices/productSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orders: orderReducer,
        products: productReducer,
    },
});
