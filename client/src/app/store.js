import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/appFeatures/authSlice.js";
import productReducer from "../features/appFeatures/productSlice.js";
import orderReducer from "../features/appFeatures/orderSlice.js";
import cartReducer from "../features/appFeatures/cartSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        cart: cartReducer,
    },
});
