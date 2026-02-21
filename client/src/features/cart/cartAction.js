import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API } from "../../utils/constants";
import { getUserDetails } from "../appFeatures/authSlice";
import { mockProducts } from "../../utils/mockData";

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (productId, { dispatch, rejectWithValue }) => {
        try {
            const userId = localStorage.getItem("loggedInUserId");

            if (!userId) {
                return rejectWithValue("Please login to add items to cart");
            }

            let users = JSON.parse(localStorage.getItem("demo_users")) || [];
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return rejectWithValue("User not found");
            }
            
            const productToAdd = mockProducts.find(p => p.id === productId.productId || p.id === productId);
            if (!productToAdd) return rejectWithValue("Product not found");

            users[userIndex].cart_items = users[userIndex].cart_items || [];
            users[userIndex].cart_items.push({
                product: productToAdd,
                quantity: 1
            });
            
            localStorage.setItem("demo_users", JSON.stringify(users));
            dispatch(getUserDetails());
            
            return users[userIndex].cart_items;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
